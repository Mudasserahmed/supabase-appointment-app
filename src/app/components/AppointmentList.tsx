"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Mail, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAppointment } from "../appointments/actions";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments = [] }: AppointmentListProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      const result = await deleteAppointment(id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          {appointments.length > 0
            ? `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""} scheduled`
            : "No appointments scheduled yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="border-l-4 border-l-primary relative group">
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{appointment.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{appointment.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No appointments scheduled.</p>
            <p className="text-sm mt-2">Create your first appointment to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
