import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createAdminClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { query, categoryId, userId } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    interface MesterWithProfile {
      id: string
      display_name: string
      profile: { email: string; full_name: string | null } | null
    }

    // Get top 3 mesters in the category (by tier and rating)
    let mesterIds: string[] = []

    if (categoryId) {
      const { data: categoryMesters } = await supabase
        .from("mester_categories")
        .select("mester_id")
        .eq("category_id", categoryId) as { data: { mester_id: string }[] | null }

      mesterIds = categoryMesters?.map((m) => m.mester_id) || []
    }

    let mesterQuery = supabase
      .from("mester_profiles")
      .select(`
        id, display_name,
        profile:profiles(email, full_name)
      `)
      .eq("approval_status", "approved")

    if (mesterIds.length > 0) {
      mesterQuery = mesterQuery.in("id", mesterIds)
    }

    const { data: mesters } = await mesterQuery
      .order("subscription_tier", { ascending: false })
      .order("avg_rating", { ascending: false })
      .limit(3) as { data: MesterWithProfile[] | null }

    if (!mesters || mesters.length === 0) {
      return NextResponse.json({ message: "No mesters to notify" })
    }

    // Create service request record
    await supabase
      .from("service_requests")
      .insert({
        original_message: query,
        detected_category_id: categoryId || null,
        client_id: userId || null,
        notified_mesters: mesters.map((m) => m.id),
      } as never)

    // Send emails to each mester
    const emailPromises = mesters.map(async (mester) => {
      const email = mester.profile?.email
      if (!email) return null

      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@mesteritulcea.ro",
          to: email,
          subject: "Cerere nouă pe Meșteri de Tulcea",
          html: `
            <h2>Ai primit o nouă cerere de servicii!</h2>
            <p>Un potențial client caută serviciile tale pe Meșteri de Tulcea.</p>
            <p><strong>Cererea:</strong> ${query}</p>
            <p>
              Intră în panoul tău pentru a vedea mai multe detalii și a contacta clientul.
            </p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/mester-cont">
                Mergi la Panoul Meșter
              </a>
            </p>
            <hr />
            <p style="color: #666; font-size: 12px;">
              Acest email a fost trimis de Meșteri de Tulcea.
            </p>
          `,
        })
        return { mesterId: mester.id, sent: true }
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error)
        return { mesterId: mester.id, sent: false, error }
      }
    })

    const results = await Promise.all(emailPromises)

    return NextResponse.json({
      message: "Notifications sent",
      results: results.filter(Boolean),
      notifiedCount: results.filter((r) => r?.sent).length,
    })
  } catch (error) {
    console.error("Error in notify-mesters:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
