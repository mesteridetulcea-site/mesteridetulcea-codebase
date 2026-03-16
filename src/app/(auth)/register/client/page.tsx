"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Camera,
  CheckCircle,
  Loader2,
  User,
  Hammer,
  Shield,
  Star,
  MessageCircle,
  ArrowLeft,
} from "lucide-react"
import { signUpClient } from "@/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

const BG_IMAGE =
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=60&w=600&auto=format&fit=crop"

const perks = [
  { icon: Shield, label: "Meșteri verificați de echipă noastră" },
  { icon: Star, label: "Recenzii autentice de la clienți reali" },
  { icon: MessageCircle, label: "Contact direct, fără intermediari" },
]

function SuccessScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0905] px-6">
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 text-center max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/35" />
          <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/35" />
        </div>
        <div className="w-14 h-14 border border-primary/35 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2.5">
          Succes
        </p>
        <h2
          className="font-display text-white mb-4"
          style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 500 }}
        >
          Cont creat!
        </h2>
        <p className="text-white/40 text-sm font-condensed tracking-wide mb-8">
          {message}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-13 bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.22em] uppercase text-sm transition-colors duration-200"
        >
          Mergi la autentificare
        </Link>
      </div>
    </div>
  )
}

export default function RegisterClientPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    if (password !== confirmPassword) {
      setError("Parolele nu coincid")
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere")
      setLoading(false)
      return
    }

    const result = await signUpClient(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message ?? null)
    }
    setLoading(false)
  }

  if (success) return <SuccessScreen message={success} />

  return (
    <div className="flex flex-col bg-[#0f0c07] relative overflow-y-auto min-h-screen lg:overflow-hidden lg:h-screen lg:flex-row [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {/* ── LEFT PANEL — desktop only ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1200&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.20]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/92 via-[#0d0905]/52 to-[#0d0905]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/88 via-transparent to-[#0d0905]/88" />
        <div
          className="absolute inset-0 opacity-[0.038]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 flex flex-col h-full px-12 py-11">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <Hammer className="h-5 w-5 text-primary" />
            <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/72 group-hover:text-white/95 transition-colors duration-200">
              Meșteri de Tulcea
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[380px]">
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
              Cont client
            </p>
            <h1
              className="font-display text-white leading-[1.06]"
              style={{ fontSize: "clamp(28px, 2.8vw, 48px)", fontWeight: 600 }}
            >
              Găsește meșteri<br />
              pentru orice{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                lucrare
              </em>
            </h1>
            <p className="mt-5 text-white/38 text-sm leading-relaxed" style={{ fontFamily: "var(--font-barlow)" }}>
              Conectează-te cu meșteri locali verificați din Tulcea.<br />
              Rapid, direct, fără comisioane.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {perks.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-xs text-white/28 font-condensed tracking-[0.1em]">
                <div className="w-6 h-6 border border-primary/22 flex items-center justify-center shrink-0">
                  <Icon className="h-3 w-3 text-primary/50" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT / MOBILE FULL ── */}
      <div className="flex-1 flex flex-col">

        {/* ── MOBILE HERO BAND ── */}
        <div className="lg:hidden relative h-[38vh] min-h-[210px] max-h-[270px] shrink-0 bg-[#0d0905]">

          {/* Photo */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={BG_IMAGE}
              alt=""
              fill
              className="object-cover object-center opacity-[0.28]"
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/75 via-[#0d0905]/20 to-[#0d0905]/88" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5">
            <Link href="/" className="flex items-center gap-2 group">
              <Hammer className="h-4 w-4 text-primary" />
              <span className="font-condensed tracking-[0.18em] uppercase text-xs font-semibold text-white/70 group-hover:text-white/90 transition-colors">
                Meșteri de Tulcea
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 font-condensed tracking-[0.12em] uppercase text-[11px] text-white/45 hover:text-white/80 transition-colors duration-150"
            >
              <ArrowLeft className="h-3 w-3" />
              Acasă
            </Link>
          </div>

          {/* Center text */}
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
              Cont client
            </p>
            <h1
              className="font-display text-white text-center leading-[1.1]"
              style={{ fontSize: "clamp(22px, 7vw, 32px)", fontWeight: 600 }}
            >
              Creează contul{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                tău
              </em>
            </h1>
          </div>
        </div>

        {/* ── MOBILE BOTTOM SHEET + DESKTOP FORM ── */}
        <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">

          {/* Desktop gold grid */}
          <div
            className="hidden lg:block absolute inset-0 opacity-[0.016]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Mobile bottom sheet */}
          <div className="lg:hidden w-full -mt-10 relative z-10 flex-1 flex flex-col">

            {/* Pill */}
            <div className="flex justify-center pt-3 pb-0">
              <div style={{ width: "40px", height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.22)" }} />
            </div>

            {/* Sheet card */}
            <div
              className="w-full mt-2 flex-1"
              style={{ borderRadius: "28px 28px 0 0", background: "#17130d", border: "1px solid rgba(160,112,32,0.22)", borderBottom: "none", boxShadow: "0 -8px 32px rgba(0,0,0,0.6)" }}
            >
              <div className="mx-6 mt-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="px-5 pt-5 pb-12">

                {/* Header */}
                <div className="text-center mb-5">
                  <p className="font-condensed tracking-[0.26em] uppercase text-primary text-xs mb-1.5">
                    Înregistrare client
                  </p>
                  <h2
                    className="font-display text-white"
                    style={{ fontSize: "clamp(18px, 5.5vw, 24px)", fontWeight: 600 }}
                  >
                    Completează datele tale
                  </h2>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-1.5 mb-5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group overflow-hidden border-2 border-[#3d2e14] hover:border-primary/55 transition-colors focus:outline-none"
                    style={{ width: "72px", height: "72px", borderRadius: "50%" }}
                    aria-label="Încarcă poza de profil"
                  >
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-white/[0.04] text-white/25">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </button>
                  <p className="text-[10px] text-white/25 font-condensed tracking-wide">
                    Poza de profil (opțional)
                  </p>
                </div>

                {/* Form */}
                <form action={handleSubmit} className="space-y-2">
                  <input ref={fileInputRef} type="file" name="avatar" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />

                  <MobileFieldBox label="Nume complet">
                    <Input name="fullName" type="text" placeholder="Ion Popescu" required autoComplete="name"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </MobileFieldBox>

                  <MobileFieldBox label="Email">
                    <Input name="email" type="email" placeholder="email@exemplu.ro" required autoComplete="email"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </MobileFieldBox>

                  <MobileFieldBox label="Telefon (opțional)">
                    <Input name="phone" type="tel" placeholder="0712 345 678" autoComplete="tel"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </MobileFieldBox>

                  <MobileFieldBox label="Parolă">
                    <Input name="password" type="password" placeholder="Min. 6 caractere" required autoComplete="new-password"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </MobileFieldBox>

                  <MobileFieldBox label="Confirmă parola">
                    <Input name="confirmPassword" type="password" placeholder="Repetă parola" required autoComplete="new-password"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </MobileFieldBox>

                  {error && (
                    <div className="border border-destructive/30 bg-destructive/[0.08] px-4 py-2.5">
                      <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading}
                    className="w-full h-14 bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0 !mt-5">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Creează cont"}
                  </Button>
                </form>

                {/* Divider + Google */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/[0.07]" />
                  <span className="font-condensed tracking-[0.2em] uppercase text-[11px] text-white/22">sau</span>
                  <div className="flex-1 h-px bg-white/[0.07]" />
                </div>
                <GoogleSignInButton />

                {/* Links */}
                <div className="mt-6 flex flex-col gap-2 text-center">
                  <p className="font-condensed tracking-[0.1em] text-sm text-white/32">
                    Ești meșter?{" "}
                    <Link href="/register/mester" className="text-primary/75 hover:text-primary transition-colors duration-150 underline underline-offset-2 decoration-primary/30">
                      Înregistrează-te ca meșter
                    </Link>
                  </p>
                  <p className="font-condensed tracking-[0.1em] text-sm text-white/32">
                    Ai deja cont?{" "}
                    <Link href="/login" className="text-primary/75 hover:text-primary transition-colors duration-150 underline underline-offset-2 decoration-primary/30">
                      Autentifică-te
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Desktop form */}
          <div className="hidden lg:block relative z-10 w-full max-w-[400px] px-8 py-12">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
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

            {/* Header */}
            <div className="text-center mb-7">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/35" />
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/35" />
              </div>
              <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2.5">
                Înregistrare client
              </p>
              <h1
                className="font-display text-white"
                style={{ fontSize: "clamp(22px, 2.6vw, 32px)", fontWeight: 500 }}
              >
                Creează contul tău
              </h1>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group overflow-hidden border-2 border-[#3d2e14] hover:border-primary/55 transition-colors focus:outline-none"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                aria-label="Încarcă poza de profil"
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-white/[0.04] text-white/25">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </button>
              <p className="text-[10px] text-white/25 font-condensed tracking-wide">
                Poza de profil (opțional)
              </p>
            </div>

            {/* Form */}
            <form action={handleSubmit} className="space-y-2.5">
              <input ref={fileInputRef} type="file" name="avatar" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />

              <DesktopFieldBox label="Nume complet">
                <Input name="fullName" type="text" placeholder="Ion Popescu" required autoComplete="name"
                  className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              </DesktopFieldBox>

              <DesktopFieldBox label="Email">
                <Input name="email" type="email" placeholder="email@exemplu.ro" required autoComplete="email"
                  className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              </DesktopFieldBox>

              <DesktopFieldBox label="Telefon (opțional)">
                <Input name="phone" type="tel" placeholder="0712 345 678" autoComplete="tel"
                  className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              </DesktopFieldBox>

              <div className="grid grid-cols-2 gap-2.5">
                <DesktopFieldBox label="Parolă">
                  <Input name="password" type="password" placeholder="Min. 6 caractere" required autoComplete="new-password"
                    className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                </DesktopFieldBox>
                <DesktopFieldBox label="Confirmă parola">
                  <Input name="confirmPassword" type="password" placeholder="Repetă parola" required autoComplete="new-password"
                    className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                </DesktopFieldBox>
              </div>

              {error && (
                <div className="border border-destructive/30 bg-destructive/[0.08] px-4 py-2.5">
                  <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0 !mt-5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Creează cont"}
              </Button>
            </form>

            {/* Divider + Google */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="font-condensed tracking-[0.22em] uppercase text-[10px] text-white/22">sau</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>
            <GoogleSignInButton />

            {/* Links */}
            <div className="mt-7 flex flex-col gap-2 text-center">
              <p className="font-condensed tracking-[0.1em] text-xs text-white/28">
                Ești meșter?{" "}
                <Link href="/register/mester" className="text-primary/65 hover:text-primary transition-colors duration-150">
                  Înregistrează-te ca meșter
                </Link>
              </p>
              <p className="font-condensed tracking-[0.1em] text-xs text-white/28">
                Ai deja cont?{" "}
                <Link href="/login" className="text-primary/65 hover:text-primary transition-colors duration-150">
                  Autentifică-te
                </Link>
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

/* ── Field wrappers ── */
function MobileFieldBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200" style={{ borderRadius: "8px" }}>
      <div className="px-4 pt-2.5">
        <span className="block font-condensed tracking-[0.16em] uppercase text-[11px] font-semibold text-white/55">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function DesktopFieldBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
      <div className="px-4 pt-2.5">
        <span className="font-condensed tracking-[0.18em] uppercase text-[10px] text-white/32">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}
