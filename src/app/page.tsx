import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";

export default function Home() {
  return (
    <main className="container p-4 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center">Appointment Scheduler</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Create a New Appointment</h2>
          <AppointmentForm />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Appointments</h2>
          <AppointmentList />
        </div>
      </div>
    </main>
  );
}
