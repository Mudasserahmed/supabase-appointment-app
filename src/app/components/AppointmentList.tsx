// app/components/AppointmentList.tsx
"use client";

import { useEffect, useState } from "react";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data.appointments);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id} className="p-4 transition-shadow border rounded-lg shadow-sm hover:shadow-md">
            <h3 className="text-lg font-bold">{appointment.name}</h3>
            <p className="text-gray-600">{appointment.email}</p>
            <p className="text-gray-600">
              {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
              {appointment.appointment_time}
            </p>
          </div>
        ))
      ) : (
        <p>No appointments scheduled.</p>
      )}
    </div>
  );
}
