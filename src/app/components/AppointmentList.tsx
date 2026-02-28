"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Mail,
  Trash2,
  CalendarX,
  Plus,
  Pencil,
  Search,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DeleteAppointmentDialog from "./DeleteAppointmentDialog";
import EditAppointmentDialog from "./EditAppointmentDialog";

interface Appointment {
  id: string;
  name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string | null;
  duration_minutes?: number;
  type?: string;
  location?: string | null;
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

type DateFilter = "all" | "today" | "week" | "month";
type SortOption = "date-asc" | "date-desc" | "name-asc" | "name-desc";

function getDateRange(filter: DateFilter) {
  const today = new Date().toISOString().split("T")[0];
  if (filter === "all") return { start: "", end: "" };
  if (filter === "today") return { start: today, end: today };
  const d = new Date();
  if (filter === "week") {
    const end = new Date(d);
    end.setDate(end.getDate() + 7);
    return { start: today, end: end.toISOString().split("T")[0] };
  }
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start: today, end: end.toISOString().split("T")[0] };
}

export default function AppointmentList({
  appointments = [],
  onNewClick,
}: AppointmentListProps) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sort, setSort] = useState<SortOption>("date-asc");

  const filteredAppointments = useMemo(() => {
    let result = appointments;
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter((a) => {
        const name = String(a.name ?? "").toLowerCase();
        const email = String(a.email ?? "").toLowerCase();
        const notes = String(a.notes ?? "").toLowerCase();
        const location = String(a.location ?? "").toLowerCase();
        const type = String(a.type ?? "").toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          notes.includes(q) ||
          location.includes(q) ||
          type.includes(q)
        );
      });
    }
    const { start, end } = getDateRange(dateFilter);
    if (start && end) {
      result = result.filter(
        (a) => a.appointment_date >= start && a.appointment_date <= end
      );
    }
    result = [...result].sort((a, b) => {
      if (sort === "date-asc") {
        const d = a.appointment_date.localeCompare(b.appointment_date);
        return d !== 0 ? d : a.appointment_time.localeCompare(b.appointment_time);
      }
      if (sort === "date-desc") {
        const d = b.appointment_date.localeCompare(a.appointment_date);
        return d !== 0 ? d : b.appointment_time.localeCompare(a.appointment_time);
      }
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    return result;
  }, [appointments, search, dateFilter, sort]);

  const appointmentToDelete = confirmDeleteId
    ? appointments.find((a) => a.id === confirmDeleteId) ?? null
    : null;

  const openDeleteConfirm = (id: string) => setConfirmDeleteId(id);
  const closeDeleteConfirm = () => setConfirmDeleteId(null);
  const appointmentToEdit = editId
    ? appointments.find((a) => a.id === editId) ?? null
    : null;

  const dateFilterChips: { value: DateFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "date-asc", label: "Date (earliest)" },
    { value: "date-desc", label: "Date (latest)" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ];

  return (
    <Card>
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-row items-center justify-between space-y-0">
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
        </div>

        {appointments.length > 0 && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, notes, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search appointments"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {dateFilterChips.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDateFilter(value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      dateFilter === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm cursor-pointer"
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Sort: {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {appointments.length === 0
                ? "No appointments yet"
                : "No matching appointments"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {appointments.length === 0
                ? "You haven&apos;t scheduled any appointments. Create your first one to get started."
                : "Try adjusting your search or date filter."}
            </p>
            {appointments.length === 0 &&
              (onNewClick ? (
                <Button size="sm" className="gap-2" onClick={onNewClick}>
                  <Plus className="h-4 w-4" />
                  New Appointment
                </Button>
              ) : (
                <Link href="/appointments?new=true">
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Appointment
                  </Button>
                </Link>
              ))}
          </div>
        ) : (
          <div className="divide-y divide-border -mx-2">
            {filteredAppointments.map((appointment) => {
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
                    {appointment.type && appointment.type !== "Other" && (
                      <span className="inline-block mt-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {appointment.type}
                      </span>
                    )}
                    {appointment.notes && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(appointment.appointment_date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {formatTime(appointment.appointment_time)}
                        {appointment.duration_minutes
                          ? ` (${appointment.duration_minutes} min)`
                          : ""}
                      </span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="max-w-[120px] truncate">
                          {appointment.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mobile: date below name */}
                  <div className="sm:hidden flex flex-col gap-0.5 shrink-0 text-xs text-muted-foreground">
                    <span>{formatDate(appointment.appointment_date)}</span>
                    <span>{formatTime(appointment.appointment_time)}</span>
                  </div>

                  {/* Edit & Delete buttons */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => setEditId(appointment.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteConfirm(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

      <EditAppointmentDialog
        open={!!editId}
        onOpenChange={(open) => !open && setEditId(null)}
        appointment={
          appointmentToEdit
            ? {
                id: appointmentToEdit.id,
                name: appointmentToEdit.name,
                email: appointmentToEdit.email,
                appointment_date: appointmentToEdit.appointment_date,
                appointment_time: appointmentToEdit.appointment_time,
                notes: appointmentToEdit.notes,
                duration_minutes: appointmentToEdit.duration_minutes,
                type: appointmentToEdit.type,
                location: appointmentToEdit.location,
              }
            : null
        }
        onSaved={() => router.refresh()}
      />
    </Card>
  );
}
