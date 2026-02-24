import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";
import UserMenu from "../components/UserMenu";
import AnimatedBackground from "../components/AnimatedBackground";
import { createClient } from "@/utils/supabase/server";

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let appointments: any[] = [];

  if (user) {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (data) {
      appointments = data;
    }
  }

  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Schedule Appointments
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage your appointments with ease. Schedule, view, and organize your bookings all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          <div className="lg:col-span-1">
            <UserMenu />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-2">
              <AppointmentForm />
            </div>
            <div className="space-y-2">
              <AppointmentList appointments={appointments} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

