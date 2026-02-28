import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import AppointmentsDashboard from "../components/AppointmentsDashboard";

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let appointments: any[] = [];

  if (user) {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (data) appointments = data;
  }

  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const todayCount = appointments.filter(
    (a) => a.appointment_date === today
  ).length;
  const weekCount = appointments.filter(
    (a) => a.appointment_date >= today && a.appointment_date <= nextWeek
  ).length;

  return (
    <Suspense fallback={<div className="animate-pulse space-y-8">Loading...</div>}>
      <AppointmentsDashboard
        appointments={appointments}
        todayCount={todayCount}
        weekCount={weekCount}
      />
    </Suspense>
  );
}
