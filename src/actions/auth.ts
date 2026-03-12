"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { uploadAvatar } from "@/lib/utils/upload"

export async function signUpClient(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string | null
  const avatarFile = formData.get("avatar") as File | null

  if (password !== confirmPassword) {
    return { error: "Parolele nu coincid" }
  }
  if (password.length < 6) {
    return { error: "Parola trebuie să aibă minim 6 caractere" }
  }

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      data: { full_name: fullName, phone },
    },
  })

  if (authError) return { error: authError.message }

  if (authData.user) {
    const avatarUrl = avatarFile ? await uploadAvatar(authData.user.id, avatarFile) : null
    // Trigger already created the profile row — update it with additional fields
    const adminClient = await createAdminClient()
    await adminClient
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        avatar_url: avatarUrl,
        role: "client",
      } as never)
      .eq("id", authData.user.id)
  }

  revalidatePath("/", "layout")
  return { success: true, message: "Verifică-ți email-ul pentru a confirma contul." }
}

export async function signUpMester(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string | null
  const avatarFile = formData.get("avatar") as File | null
  const businessName = formData.get("businessName") as string
  const categoryId = formData.get("categoryId") as string
  const description = formData.get("description") as string
  const experienceYears = formData.get("experienceYears") as string
  const whatsappNumber = formData.get("whatsappNumber") as string
  const address = formData.get("address") as string

  if (password !== confirmPassword) {
    return { error: "Parolele nu coincid" }
  }
  if (password.length < 6) {
    return { error: "Parola trebuie să aibă minim 6 caractere" }
  }

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      data: { full_name: fullName, phone },
    },
  })

  if (authError) return { error: authError.message }

  if (authData.user) {
    const avatarUrl = avatarFile ? await uploadAvatar(authData.user.id, avatarFile) : null

    // Trigger already created the profile row — update it
    const adminClient = await createAdminClient()
    await adminClient
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        avatar_url: avatarUrl,
        role: "mester",
      } as never)
      .eq("id", authData.user.id)

    // Create mester profile
    const { data: newMester } = await adminClient
      .from("mester_profiles")
      .insert({
        user_id: authData.user.id,
        display_name: businessName,
        bio: description || null,
        years_experience: experienceYears ? parseInt(experienceYears) : null,
        whatsapp_number: whatsappNumber || null,
        neighborhood: address || null,
        city: "Tulcea",
        subscription_tier: "ucenic",
        approval_status: "pending",
        is_featured: false,
        avg_rating: 0,
        reviews_count: 0,
        views_count: 0,
      } as never)
      .select("id")
      .single()

    // Associate category
    if (newMester && categoryId) {
      await adminClient.from("mester_categories").insert({
        mester_id: (newMester as { id: string }).id,
        category_id: categoryId,
      } as never)
    }
  }

  revalidatePath("/", "layout")
  return { success: true, message: "Verifică-ți email-ul pentru a confirma contul." }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  const redirectTo = formData.get("redirectTo") as string | null
  return { success: true, redirectTo: redirectTo || "/" }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Link-ul de resetare a fost trimis pe email." }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get("password") as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/cont")
}
