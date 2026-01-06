import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Appointment Scheduler
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage your appointments with ease. Schedule, view, and organize your bookings all in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-7xl mx-auto">
          <div className="space-y-2">
            <AppointmentForm />
          </div>
          <div className="space-y-2">
            <AppointmentList />
          </div>
        </div>
      </div>
    </main>
  );
}

