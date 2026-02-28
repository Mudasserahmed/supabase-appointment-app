"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AppointmentForm, {
  type AppointmentFormData,
} from "./AppointmentForm";

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentFormData | null;
  onSaved?: () => void;
}

export default function EditAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onSaved,
}: EditAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>
            Update the appointment details below
          </DialogDescription>
        </DialogHeader>
        {appointment && (
          <AppointmentForm
            initialData={appointment}
            onSuccess={() => {
              onSaved?.();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
