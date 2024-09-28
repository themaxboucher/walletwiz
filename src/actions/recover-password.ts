"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function recoverPassword(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;

  let { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message }; // Return the error message
  }
}
