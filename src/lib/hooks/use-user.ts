"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [hasMesterProfile, setHasMesterProfile] = useState(false)
  const [mesterProfileId, setMesterProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchProfile(user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setHasMesterProfile(false)
        setMesterProfileId(null)
        setLoading(false)
      }
    })

    function handleProfileUpdate() {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) fetchProfile(user.id)
      })
    }
    window.addEventListener("profile-updated", handleProfileUpdate)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("profile-updated", handleProfileUpdate)
    }
  }, [])

  async function fetchProfile(userId: string) {
    const supabase = createClient()
    const [profileResult, mesterResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("mester_profiles").select("id").eq("user_id", userId).maybeSingle(),
    ])
    const profileData = (profileResult as unknown as { data: Profile | null }).data
    const mesterData = (mesterResult as unknown as { data: { id: string } | null }).data

    setProfile(profileData)
    setHasMesterProfile(!!mesterData)
    setMesterProfileId(mesterData?.id ?? null)
    setLoading(false)
  }

  return { user, profile, hasMesterProfile, mesterProfileId, loading }
}
