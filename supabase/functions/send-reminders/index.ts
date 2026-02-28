import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const in24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const in24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    const in1hStart = new Date(now.getTime() + 50 * 60 * 1000);
    const in1hEnd = new Date(now.getTime() + 70 * 60 * 1000);

    const { data: allApts } = await supabase
      .from("appointments")
      .select("id, name, email, appointment_date, appointment_time, notes, reminder_24h_sent, reminder_1h_sent")
      .or("status.neq.cancelled,status.is.null")
      .gte("appointment_date", now.toISOString().split("T")[0]);

    const toMinutes = (d: Date) => d.getTime() / (60 * 1000);
    const aptTime = (apt: { appointment_date: string; appointment_time: string }) =>
      toMinutes(new Date(`${apt.appointment_date}T${apt.appointment_time}`));

    const appointments24h = (allApts ?? []).filter(
      (a) => !a.reminder_24h_sent && aptTime(a) >= toMinutes(in24hStart) && aptTime(a) <= toMinutes(in24hEnd)
    );
    const appointments1h = (allApts ?? []).filter(
      (a) => !a.reminder_1h_sent && aptTime(a) >= toMinutes(in1hStart) && aptTime(a) <= toMinutes(in1hEnd)
    );

    const sent: string[] = [];

    if (resendApiKey && appointments24h?.length) {
      for (const apt of appointments24h) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Appointly <onboarding@resend.dev>",
            to: apt.email,
            subject: "Reminder: Appointment in 24 hours",
            html: `<p>Hi ${apt.name},</p><p>This is a reminder that you have an appointment on ${apt.appointment_date} at ${apt.appointment_time}.</p>${apt.notes ? `<p>Notes: ${apt.notes}</p>` : ""}`,
          }),
        });
        if (res.ok) {
          await supabase.from("appointments").update({ reminder_24h_sent: true }).eq("id", apt.id);
          sent.push(apt.id);
        }
      }
    }

    if (resendApiKey && appointments1h?.length) {
      for (const apt of appointments1h) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Appointly <onboarding@resend.dev>",
            to: apt.email,
            subject: "Reminder: Appointment in 1 hour",
            html: `<p>Hi ${apt.name},</p><p>This is a reminder that you have an appointment in 1 hour (${apt.appointment_date} at ${apt.appointment_time}).</p>`,
          }),
        });
        if (res.ok) {
          await supabase.from("appointments").update({ reminder_1h_sent: true }).eq("id", apt.id);
          sent.push(apt.id);
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        reminder24h: appointments24h?.length ?? 0,
        reminder1h: appointments1h?.length ?? 0,
        sent: sent.length,
        note: !resendApiKey ? "RESEND_API_KEY not set - no emails sent" : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
