import { createClient } from "@/lib/supabase/server"
import MesterRegisterForm from "./mester-form"

export default async function RegisterMesterPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order")

  return <MesterRegisterForm categories={categories ?? []} />
}
