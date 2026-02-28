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
import { Calendar, Clock, Mail, User, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { createAppointment } from "../appointments/actions";

interface AppointmentFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

export default function AppointmentForm({
  redirectTo,
  onSuccess,
}: AppointmentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [appointment_date, setAppointmentDate] = useState("");
  const [appointment_time, setAppointmentTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("appointment_date", appointment_date);
    formData.append("appointment_time", appointment_time);

    try {
      const result = await createAppointment(formData);
      if (result.error) throw new Error(result.error);

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      if (onSuccess) {
        onSuccess();
        return;
      }

      setSuccess(true);
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

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 mr-2 inline" />
              <AlertDescription>Appointment created successfully!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Appointment"}
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
