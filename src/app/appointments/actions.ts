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
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true };
}
