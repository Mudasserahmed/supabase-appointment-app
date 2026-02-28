"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Calendar, Clock, Mail, User, MapPin, FileText } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { createAppointment, updateAppointment } from "../appointments/actions";

export const APPOINTMENT_TYPES = [
  "Meeting",
  "Medical",
  "Personal",
  "Work",
  "Other",
] as const;

export interface AppointmentFormData {
  id?: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string | null;
  duration_minutes?: number;
  type?: string;
  location?: string | null;
}

interface AppointmentFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
  initialData?: AppointmentFormData | null;
}

export default function AppointmentForm({
  redirectTo,
  onSuccess,
  initialData,
}: AppointmentFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [appointment_date, setAppointmentDate] = useState(initialData?.appointment_date ?? "");
  const [appointment_time, setAppointmentTime] = useState(initialData?.appointment_time ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [duration_minutes, setDurationMinutes] = useState(
    String(initialData?.duration_minutes ?? 60)
  );
  const [type, setType] = useState(initialData?.type ?? "Other");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) return;
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setName((user.user_metadata?.name as string) || "");
      }
    };
    loadUser();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("appointment_date", appointment_date);
    formData.append("appointment_time", appointment_time);
    formData.append("notes", notes);
    formData.append("duration_minutes", duration_minutes);
    formData.append("type", type);
    formData.append("location", location);

    try {
      const isEdit = !!initialData?.id;
      const result = isEdit && initialData.id
        ? await updateAppointment(initialData.id, formData)
        : await createAppointment(formData);
      if (result.error) throw new Error(result.error);

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      if (onSuccess) {
        toast.success(
          initialData?.id ? "Appointment updated!" : "Appointment created!"
        );
        onSuccess();
        return;
      }

      toast.success(
        initialData?.id ? "Appointment updated!" : "Appointment created successfully!"
      );
      setAppointmentDate("");
      setAppointmentTime("");

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setName((user.user_metadata?.name as string) || "");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={appointment_date}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={!initialData?.id ? new Date().toISOString().split("T")[0] : undefined}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={appointment_time}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                step={15}
                value={duration_minutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="Address or place"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="notes"
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? initialData?.id
                ? "Updating..."
                : "Creating..."
              : initialData?.id
                ? "Update Appointment"
                : "Create Appointment"}
          </Button>
        </form>
  );

  if (onSuccess) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Appointment</CardTitle>
        <CardDescription>
          Fill in the details below to book your appointment
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
