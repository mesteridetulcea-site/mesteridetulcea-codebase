import { NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (!error) {
      // For signup, ensure profile exists
      if (type === "signup") {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single()

          if (!existingProfile) {
            await supabase.from("profiles").insert({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata.full_name || user.user_metadata.name || null,
              avatar_url: user.user_metadata.avatar_url || null,
              role: "client",
            } as never)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error("[auth/confirm] verifyOtp error:", error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
