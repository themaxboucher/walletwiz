"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message }; // Return the error message
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message }; // Return the error message
  }

  revalidatePath("/", "layout");
  redirect("/auth/verify");
}

export async function logout() {
  const supabase = createClient();

  let { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  redirect("/");
}

export async function recoverPassword(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  let { data, error } = await supabase.auth.resetPasswordForEmail(email);
}
