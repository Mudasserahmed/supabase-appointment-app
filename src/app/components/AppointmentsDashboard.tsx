"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, CalendarDays, Clock, TrendingUp, Download, List, Calendar as CalendarIcon } from "lucide-react";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";
import AppointmentCalendar from "./AppointmentCalendar";
import { toast } from "sonner";
import { exportAppointmentsCSV } from "../appointments/actions";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
}

interface AppointmentsDashboardProps {
  appointments: Appointment[];
  todayCount: number;
  weekCount: number;
}

const statsConfig = [
  {
    label: "Total Appointments",
    valueKey: "total" as const,
    sub: "All time",
    icon: CalendarDays,
  },
  {
    label: "Today",
    valueKey: "today" as const,
    sub: "Scheduled for today",
    icon: Clock,
  },
  {
    label: "This Week",
    valueKey: "week" as const,
    sub: "Next 7 days",
    icon: TrendingUp,
  },
];

export default function AppointmentsDashboard({
  appointments,
  todayCount,
  weekCount,
}: AppointmentsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    if (searchParams.get("new") === "true") {
      router.replace("/appointments");
    }
  };

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const handleFormSuccess = () => {
    closeModal();
    router.refresh();
  };

  const handleExportCSV = async () => {
    const result = await exportAppointmentsCSV();
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    const blob = new Blob([result.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Appointments exported");
  };

  const stats = statsConfig.map(({ label, valueKey, sub, icon: Icon }) => ({
    label,
    value:
      valueKey === "total"
        ? appointments.length
        : valueKey === "today"
          ? todayCount
          : weekCount,
    sub,
    icon: Icon,
  }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" className="gap-2" onClick={openModal}>
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
          List
        </Button>
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setViewMode("calendar")}
        >
          <CalendarIcon className="h-4 w-4" />
          Calendar
        </Button>
      </div>

      {/* Appointment list or calendar */}
      {viewMode === "list" ? (
        <AppointmentList appointments={appointments} onNewClick={openModal} />
      ) : (
        <AppointmentCalendar appointments={appointments} />
      )}

      {/* New Appointment Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details below to schedule an appointment
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
