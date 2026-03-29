import { createHmac, timingSafeEqual } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import {
  buildConfirmEmail,
  buildRecoveryEmail,
  buildEmailChangeEmail,
  buildMagicLinkEmail,
} from "@/lib/email/auth-templates"

const resend = new Resend(process.env.RESEND_API_KEY)

// Verify Supabase HS256 JWT hook signature
// Supabase hook secrets have format: "v1,whsec_<base64>" — the signing key
// is the base64-decoded bytes of the part after "whsec_"
function verifyJwt(authHeader: string, secret: string): boolean {
  try {
    const token = authHeader.replace(/^Bearer\s+/i, "")
    const parts = token.split(".")
    if (parts.length !== 3) return false
    const [header, payload, signature] = parts

    // Decode the Supabase hook secret: strip "v1,whsec_" prefix and base64-decode
    let signingKey: Buffer | string = secret
    const whsecMatch = secret.match(/(?:v\d+,)?whsec_(.+)/)
    if (whsecMatch) {
      signingKey = Buffer.from(whsecMatch[1], "base64")
    }

    const expected = createHmac("sha256", signingKey)
      .update(`${header}.${payload}`)
      .digest("base64url")
    // Constant-time comparison to avoid timing attacks
    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const hookSecret = process.env.SEND_EMAIL_HOOK_SECRET

  // Verify signature only if secret is configured
  if (hookSecret) {
    const authHeader = req.headers.get("authorization") ?? ""
    console.log("[send-email] Auth header length:", authHeader.length)
    if (authHeader.length === 0) {
      // Supabase is not sending the Authorization header — secret may not be set in hook config
      console.warn("[send-email] No Authorization header — skipping verification. Set signing secret in Supabase hook config.")
    } else if (!verifyJwt(authHeader, hookSecret)) {
      console.error("[send-email] JWT verification failed. Header prefix:", authHeader?.slice(0, 60))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  } else {
    console.warn("[send-email] SEND_EMAIL_HOOK_SECRET is not set — hook is unprotected!")
  }

  // Parse body
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    console.error("[send-email] Failed to parse request body")
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const user = body.user as {
    email?: string
    user_metadata?: { full_name?: string; name?: string }
  } | undefined

  const emailData = body.email_data as {
    token_hash?: string
    redirect_to?: string
    email_action_type?: string
    site_url?: string
  } | undefined

  if (!user?.email) {
    console.error("[send-email] Missing user.email in payload:", JSON.stringify(body).slice(0, 200))
    return NextResponse.json({ error: "Missing user email" }, { status: 400 })
  }

  if (!emailData?.email_action_type) {
    console.error("[send-email] Missing email_data.email_action_type")
    return NextResponse.json({ error: "Missing email action type" }, { status: 400 })
  }

  const { email_action_type, token_hash, redirect_to, site_url } = emailData
  const toEmail = user.email
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""

  // Build the confirmation/action URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? site_url ?? ""
  const redirectTo = redirect_to || appUrl
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const actionUrl =
    `${supabaseUrl}/auth/v1/verify` +
    `?token=${token_hash}` +
    `&type=${email_action_type}` +
    `&redirect_to=${encodeURIComponent(redirectTo)}`

  // Select template
  let subject: string
  let html: string

  switch (email_action_type) {
    case "signup":
      subject = "Confirmă adresa de email — Meșteri de Tulcea"
      html = buildConfirmEmail(name, actionUrl)
      break
    case "recovery":
      subject = "Resetare parolă — Meșteri de Tulcea"
      html = buildRecoveryEmail(name, actionUrl)
      break
    case "email_change":
    case "email_change_new":
      subject = "Confirmă noua adresă de email — Meșteri de Tulcea"
      html = buildEmailChangeEmail(name, actionUrl)
      break
    case "magiclink":
      subject = "Link de autentificare — Meșteri de Tulcea"
      html = buildMagicLinkEmail(name, actionUrl)
      break
    default:
      subject = "Acțiune necesară — Meșteri de Tulcea"
      html = buildConfirmEmail(name, actionUrl)
  }

  const fromAddress = process.env.EMAIL_FROM ?? "noreply@mesteritulcea.ro"

  console.log(`[send-email] Sending "${email_action_type}" to ${toEmail} from ${fromAddress}`)

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: toEmail,
    subject,
    html,
  })

  if (error) {
    console.error("[send-email] Resend error:", JSON.stringify(error))
    return NextResponse.json({ error: "Failed to send email", detail: error }, { status: 500 })
  }

  console.log("[send-email] Sent successfully, id:", data?.id)
  return NextResponse.json({ message: "Email sent", id: data?.id })
}
