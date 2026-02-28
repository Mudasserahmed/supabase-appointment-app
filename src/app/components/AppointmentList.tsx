"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Mail, Trash2, CalendarX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DeleteAppointmentDialog from "./DeleteAppointmentDialog";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onNewClick?: () => void;
}

function formatDate(dateStr: string) {
  // Append T00:00:00 to parse as local date, not UTC
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().split("T")[0];
}

function isUpcoming(dateStr: string) {
  return dateStr >= new Date().toISOString().split("T")[0];
}

export default function AppointmentList({
  appointments = [],
  onNewClick,
}: AppointmentListProps) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const appointmentToDelete = confirmDeleteId
    ? appointments.find((a) => a.id === confirmDeleteId) ?? null
    : null;

  const openDeleteConfirm = (id: string) => setConfirmDeleteId(id);
  const closeDeleteConfirm = () => setConfirmDeleteId(null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Appointments</CardTitle>
          <CardDescription className="mt-1">
            {appointments.length > 0
              ? `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""} total`
              : "No appointments yet"}
          </CardDescription>
        </div>
        {appointments.length > 0 &&
          (onNewClick ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={onNewClick}
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
          ) : (
            <Link href="/appointments?new=true">
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </Link>
          ))}
      </CardHeader>

      <CardContent>
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No appointments yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              You haven&apos;t scheduled any appointments. Create your first one
              to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border -mx-2">
            {appointments.map((appointment) => {
              const today = isToday(appointment.appointment_date);
              const upcoming = isUpcoming(appointment.appointment_date);

              return (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 px-2 py-4 hover:bg-muted/40 rounded-lg transition-colors group"
                >
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {getInitials(appointment.name)}
                  </div>

                  {/* Name & Email */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{appointment.name}</p>
                      {today && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          Today
                        </span>
                      )}
                      {!upcoming && !today && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                          Past
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="text-sm text-muted-foreground truncate">
                        {appointment.email}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(appointment.appointment_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(appointment.appointment_time)}</span>
                    </div>
                  </div>

                  {/* Mobile: date below name */}
                  <div className="sm:hidden flex flex-col gap-0.5 shrink-0 text-xs text-muted-foreground">
                    <span>{formatDate(appointment.appointment_date)}</span>
                    <span>{formatTime(appointment.appointment_time)}</span>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    onClick={() => openDeleteConfirm(appointment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <DeleteAppointmentDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && closeDeleteConfirm()}
        appointment={appointmentToDelete}
        onDeleted={() => router.refresh()}
      />
    </Card>
  );
}
