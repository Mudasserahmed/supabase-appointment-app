"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAppointment(formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const appointment_date = formData.get("appointment_date") as string;
    const appointment_time = formData.get("appointment_time") as string;
    const notes = (formData.get("notes") as string) || null;
    const duration_minutes = parseInt(formData.get("duration_minutes") as string, 10) || 60;
    const type = (formData.get("type") as string) || "Other";
    const location = (formData.get("location") as string) || null;
    const recurrence_rule = (formData.get("recurrence_rule") as string) || null;

    if (!name || !email || !appointment_date || !appointment_time) {
        return { error: "Missing required fields" };
    }

    const { error } = await supabase
        .from("appointments")
        .insert([{
            name,
            email,
            appointment_date,
            appointment_time,
            notes,
            duration_minutes,
            type,
            location,
            status: "confirmed",
            recurrence_rule: recurrence_rule || null,
            user_id: user.id
        }]);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true };
}

export async function updateAppointment(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const appointment_date = formData.get("appointment_date") as string;
    const appointment_time = formData.get("appointment_time") as string;
    const notes = (formData.get("notes") as string) || null;
    const duration_minutes = parseInt(formData.get("duration_minutes") as string, 10) || 60;
    const type = (formData.get("type") as string) || "Other";
    const location = (formData.get("location") as string) || null;
    const status = (formData.get("status") as string) || "confirmed";
    const recurrence_rule = (formData.get("recurrence_rule") as string) || null;

    if (!name || !email || !appointment_date || !appointment_time) {
        return { error: "Missing required fields" };
    }

    const { error } = await supabase
        .from("appointments")
        .update({
            name,
            email,
            appointment_date,
            appointment_time,
            notes,
            duration_minutes,
            type,
            location,
            status,
            recurrence_rule: recurrence_rule || null,
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true };
}

export async function deleteAppointment(id: string) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true };
}

export async function exportAppointmentsCSV(): Promise<{ csv: string } | { error: string }> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Unauthorized" };
    }

    const { data: appointments, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .or("status.neq.cancelled,status.is.null")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

    if (error) return { error: error.message };
    if (!appointments?.length) return { csv: "name,email,date,time,duration,type,location,notes,status\n" };

    const headers = ["name", "email", "date", "time", "duration", "type", "location", "notes", "status"];
    const escape = (v: unknown) => {
        const s = String(v ?? "");
        return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
    };

    const rows = appointments.map((a) =>
        headers
            .map((h) => {
                const key = h === "date" ? "appointment_date" : h === "time" ? "appointment_time" : h === "duration" ? "duration_minutes" : h;
                return escape((a as Record<string, unknown>)[key]);
            })
            .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    return { csv };
}
