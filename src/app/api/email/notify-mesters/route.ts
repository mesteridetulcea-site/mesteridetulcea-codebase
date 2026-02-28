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

    // Get top 3 mesters in the category (by tier and rating)
    let mesterQuery = supabase
      .from("mesters")
      .select(
        `
        *,
        profile:profiles(email, full_name)
      `
      )
      .eq("approval_status", "approved")

    if (categoryId) {
      mesterQuery = mesterQuery.eq("category_id", categoryId)
    }

    interface MesterWithProfile {
      id: string
      business_name: string
      profile: { email: string; full_name: string | null } | null
    }

    const { data: mesters } = await mesterQuery
      .order("subscription_tier", { ascending: false })
      .order("average_rating", { ascending: false })
      .limit(3) as { data: MesterWithProfile[] | null }

    if (!mesters || mesters.length === 0) {
      return NextResponse.json({ message: "No mesters to notify" })
    }

    // Create service request record
    const { data: serviceRequest, error: requestError } = await supabase
      .from("service_requests")
      .insert({
        query,
        category_id: categoryId || null,
        user_id: userId || null,
        notified_mesters: mesters.map((m) => m.id),
        status: "pending",
      } as never)
      .select()
      .single() as { data: { id: string } | null; error: Error | null }

    if (requestError) {
      console.error("Error creating service request:", requestError)
    }

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

    // Update service request status
    if (serviceRequest) {
      await supabase
        .from("service_requests")
        .update({ status: "sent" } as never)
        .eq("id", serviceRequest.id)
    }

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
