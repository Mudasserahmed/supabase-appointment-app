"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteAppointment } from "../appointments/actions";

interface Appointment {
  id: string;
  name: string;
  appointment_date: string;
  appointment_time: string;
}

interface DeleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onDeleted?: () => void;
}

function formatDate(dateStr: string) {
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

export default function DeleteAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onDeleted,
}: DeleteAppointmentDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!deleting) {
      setError(null);
      onOpenChange(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!appointment) return;
    setError(null);
    setDeleting(true);
    const result = await deleteAppointment(appointment.id);
    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      toast.success("Appointment deleted");
      onDeleted?.();
      handleClose();
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete appointment</DialogTitle>
          <DialogDescription>
            {appointment ? (
              <>
                Are you sure you want to delete the appointment for{" "}
                <span className="font-medium text-foreground">
                  {appointment.name}
                </span>
                {" "}on {formatDate(appointment.appointment_date)} at{" "}
                {formatTime(appointment.appointment_time)}? This action cannot
                be undone.
              </>
            ) : (
              "Are you sure you want to delete this appointment? This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter className="space-x-3 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
