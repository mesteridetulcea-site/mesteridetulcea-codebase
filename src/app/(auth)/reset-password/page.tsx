"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Hammer, ArrowLeft } from "lucide-react"
import { updatePassword } from "@/actions/auth"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  // Exchange the code from URL for a session
  useEffect(() => {
    const supabase = createClient()
    // Listen for auth state — Supabase auto-exchanges the code from the URL hash/params
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true)
      }
    })
    // Also check if there's already a session (user navigated back)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Timeout — if no PASSWORD_RECOVERY event after 5s, show error
  useEffect(() => {
    const t = setTimeout(() => {
      if (!sessionReady) setSessionError(true)
    }, 5000)
    return () => clearTimeout(t)
  }, [sessionReady])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirm = formData.get("confirmPassword") as string
    if (password !== confirm) { setError("Parolele nu coincid"); return }
    if (password.length < 6) { setError("Parola trebuie să aibă minim 6 caractere"); return }
    setLoading(true)
    setError(null)
    const result = await updatePassword(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // on success, updatePassword() calls redirect("/cont") automatically
  }

  return (
    <div className="flex flex-col bg-[#0f0c07] relative overflow-y-auto min-h-screen lg:overflow-hidden lg:h-screen lg:flex-row [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {/* ── LEFT PANEL — desktop only ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.18]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/92 via-[#0d0905]/52 to-[#0d0905]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/88 via-transparent to-[#0d0905]/88" />
        <div
          className="absolute inset-0 opacity-[0.038]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 flex flex-col h-full px-14 py-11">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <Hammer className="h-5 w-5 text-primary" />
            <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75 group-hover:text-white/95 transition-colors duration-200">
              Meșteri de Tulcea
            </span>
          </Link>
          <div className="flex-1 flex flex-col justify-center max-w-[400px]">
            <div className="flex items-center gap-5 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/35" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/35" />
            </div>
            <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-4">
              Parolă nouă
            </p>
            <h1
              className="font-display text-white leading-[1.06]"
              style={{ fontSize: "clamp(28px, 2.8vw, 46px)", fontWeight: 600 }}
            >
              Setează o parolă<br />
              <em className="text-primary" style={{ fontStyle: "italic" }}>nouă</em>
            </h1>
            <p className="mt-5 text-white/38 text-sm leading-relaxed" style={{ fontFamily: "var(--font-barlow)" }}>
              Alege o parolă sigură de minim 6 caractere pentru contul tău.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT / MOBILE FULL ── */}
      <div className="flex-1 flex flex-col">

        {/* ── MOBILE HERO BAND ── */}
        <div className="lg:hidden relative h-[38vh] min-h-[210px] max-h-[270px] shrink-0 bg-[#0d0905]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=60&w=600&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover object-center opacity-[0.28]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/75 via-[#0d0905]/20 to-[#0d0905]/88" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5">
            <Link href="/" className="flex items-center gap-2 group">
              <Hammer className="h-4 w-4 text-primary" />
              <span className="font-condensed tracking-[0.18em] uppercase text-xs font-semibold text-white/70 group-hover:text-white/90 transition-colors">
                Meșteri de Tulcea
              </span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1 font-condensed tracking-[0.12em] uppercase text-[11px] text-white/45 hover:text-white/80 transition-colors duration-150"
            >
              <ArrowLeft className="h-3 w-3" />
              Login
            </Link>
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-4 pointer-events-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-7 bg-gradient-to-r from-transparent to-primary/40" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/80 rotate-45" />
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
              </div>
              <div className="h-px w-7 bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <p className="font-condensed tracking-[0.26em] uppercase text-primary text-[10px] mb-2">
              Parolă nouă
            </p>
            <h1
              className="font-display text-white text-center leading-[1.1]"
              style={{ fontSize: "clamp(22px, 7vw, 32px)", fontWeight: 600 }}
            >
              Setează o parolă{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>nouă</em>
            </h1>
          </div>
        </div>

        {/* ── MOBILE BOTTOM SHEET + DESKTOP FORM ── */}
        <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">

          <div
            className="hidden lg:block absolute inset-0 opacity-[0.016]"
            style={{
              backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Mobile bottom sheet */}
          <div className="lg:hidden w-full -mt-10 relative z-10 flex-1 flex flex-col">
            <div className="flex justify-center pt-3 pb-0">
              <div style={{ width: "40px", height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.22)" }} />
            </div>
            <div
              className="w-full mt-2 flex-1"
              style={{ borderRadius: "28px 28px 0 0", background: "#17130d", border: "1px solid rgba(160,112,32,0.22)", borderBottom: "none", boxShadow: "0 -8px 32px rgba(0,0,0,0.6)" }}
            >
              <div className="mx-6 mt-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="px-5 pt-5 pb-12">
                {!sessionReady ? (
                  <MobileWaiting error={sessionError} />
                ) : (
                  <MobileForm loading={loading} error={error} onSubmit={handleSubmit} />
                )}
              </div>
            </div>
          </div>

          {/* Desktop form */}
          <div className="hidden lg:block relative z-10 w-full max-w-[380px] px-8 py-12">
            <div className="flex flex-col items-center mb-9">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-10 bg-primary/35" />
                <span className="text-primary/65 text-sm">★</span>
                <div className="h-px w-10 bg-primary/35" />
              </div>
              <Link href="/" className="flex items-center gap-2.5 group">
                <Hammer className="h-5 w-5 text-primary" />
                <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75 group-hover:text-white/95 transition-colors duration-200">
                  Meșteri de Tulcea
                </span>
              </Link>
            </div>

            {!sessionReady ? (
              <DesktopWaiting error={sessionError} />
            ) : (
              <>
                <div className="text-center mb-7">
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/35" />
                    <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/35" />
                  </div>
                  <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2.5">
                    Parolă nouă
                  </p>
                  <h2
                    className="font-display text-white"
                    style={{ fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 500 }}
                  >
                    Setează parola
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
                    <div className="px-4 pt-2.5">
                      <span className="font-condensed tracking-[0.18em] uppercase text-[10px] text-white/32">Parolă nouă</span>
                    </div>
                    <Input name="password" type="password" placeholder="Min. 6 caractere" required autoComplete="new-password"
                      className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                  <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
                    <div className="px-4 pt-2.5">
                      <span className="font-condensed tracking-[0.18em] uppercase text-[10px] text-white/32">Confirmă parola</span>
                    </div>
                    <Input name="confirmPassword" type="password" placeholder="Repetă parola" required autoComplete="new-password"
                      className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>

                  {error && (
                    <div className="border border-destructive/30 bg-destructive/[0.08] px-4 py-2.5">
                      <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading}
                    className="w-full h-14 bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0 !mt-5">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvează parola nouă"}
                  </Button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function MobileWaiting({ error }: { error: boolean }) {
  if (error) return (
    <div className="text-center py-4">
      <p className="font-condensed tracking-[0.26em] uppercase text-destructive/70 text-xs mb-2">Link invalid</p>
      <h2 className="font-display text-white mb-3" style={{ fontSize: "22px", fontWeight: 600 }}>Link-ul a expirat</h2>
      <p className="text-sm text-white/38 font-condensed tracking-wide mb-6">Solicită un nou link de resetare.</p>
      <Link href="/recuperare-parola" className="inline-flex items-center justify-center w-full h-12 bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.2em] uppercase text-sm transition-colors duration-200">
        Solicită link nou
      </Link>
    </div>
  )
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <Loader2 className="h-7 w-7 text-primary animate-spin" />
      <p className="font-condensed tracking-[0.18em] uppercase text-xs text-white/35">Se verifică link-ul...</p>
    </div>
  )
}

function MobileForm({ loading, error, onSubmit }: { loading: boolean; error: string | null; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <>
      <div className="text-center mb-6">
        <p className="font-condensed tracking-[0.26em] uppercase text-primary text-xs mb-1.5">Parolă nouă</p>
        <h2 className="font-display text-white" style={{ fontSize: "clamp(18px, 5.5vw, 24px)", fontWeight: 600 }}>
          Setează parola
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block font-condensed tracking-[0.16em] uppercase text-[11px] font-semibold text-white/55 mb-2">Parolă nouă</label>
          <div className="border border-[#3a2c12] bg-[#0d0a06] focus-within:border-primary/55 transition-all duration-200">
            <Input name="password" type="password" placeholder="Min. 6 caractere" required autoComplete="new-password"
              className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        </div>
        <div>
          <label className="block font-condensed tracking-[0.16em] uppercase text-[11px] font-semibold text-white/55 mb-2">Confirmă parola</label>
          <div className="border border-[#3a2c12] bg-[#0d0a06] focus-within:border-primary/55 transition-all duration-200">
            <Input name="confirmPassword" type="password" placeholder="Repetă parola" required autoComplete="new-password"
              className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        </div>

        {error && (
          <div className="border-l-2 border-destructive bg-destructive/[0.06] px-4 py-3">
            <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
          </div>
        )}

        <Button type="submit" disabled={loading}
          className="w-full h-14 bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0 !mt-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvează parola nouă"}
        </Button>
      </form>
    </>
  )
}

function DesktopWaiting({ error }: { error: boolean }) {
  if (error) return (
    <div className="text-center">
      <p className="font-condensed tracking-[0.26em] uppercase text-destructive/70 text-xs mb-2">Link invalid</p>
      <h2 className="font-display text-white mb-3" style={{ fontSize: "26px", fontWeight: 500 }}>Link-ul a expirat</h2>
      <p className="text-sm text-white/35 font-condensed tracking-wide mb-7">Solicită un nou link de resetare a parolei.</p>
      <Link href="/recuperare-parola" className="inline-flex items-center justify-center w-full h-12 bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.2em] uppercase text-sm transition-colors duration-200">
        Solicită link nou
      </Link>
    </div>
  )
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-7 w-7 text-primary animate-spin" />
      <p className="font-condensed tracking-[0.18em] uppercase text-xs text-white/35">Se verifică link-ul...</p>
    </div>
  )
}


