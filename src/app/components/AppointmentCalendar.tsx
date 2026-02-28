"use client";

import { useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  type?: string;
  notes?: string | null;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectAppointment?: (appointment: Appointment) => void;
}

const locales = { "en-US": undefined };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function appointmentToEvent(appointment: Appointment) {
  const dateStr = appointment.appointment_date;
  const timeStr = appointment.appointment_time.padEnd(5, "0").slice(0, 5);
  const duration = appointment.duration_minutes ?? 60;
  const start = new Date(`${dateStr}T${timeStr}:00`);
  const end = new Date(start.getTime() + duration * 60 * 1000);
  return {
    id: appointment.id,
    title: appointment.name,
    start,
    end,
    resource: appointment,
  };
}

export default function AppointmentCalendar({
  appointments,
  onSelectAppointment,
}: AppointmentCalendarProps) {
  const events = appointments.map(appointmentToEvent);

  const handleSelectEvent = useCallback(
    (event: { resource: Appointment }) => {
      onSelectAppointment?.(event.resource);
    },
    [onSelectAppointment]
  );

  return (
    <div className="h-[600px] rounded-lg border bg-card p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        className="rbc-calendar"
      />
    </div>
  );
}
