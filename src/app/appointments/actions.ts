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
            user_id: user.id
        }]);

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
