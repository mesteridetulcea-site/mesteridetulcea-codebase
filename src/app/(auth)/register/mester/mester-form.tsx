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
  Users,
  TrendingUp,
  Banknote,
} from "lucide-react"
import { signUpMester } from "@/actions/auth"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// ── Replace with your own image URL ──────────────────────────────
const BG_IMAGE = "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

interface Props {
  categories: { id: string; name: string }[]
}

const perks = [
  { icon: Users,      label: "Acces la sute de clienți locali" },
  { icon: TrendingUp, label: "Profil vizibil în căutări locale" },
  { icon: Banknote,   label: "Fără comisioane — contact direct WhatsApp" },
]

function SuccessScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0905] px-6 relative">
      <div className="absolute inset-0 opacity-[0.018]" style={{
        backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div className="relative z-10 text-center max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/35" />
          <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/35" />
        </div>
        <div className="w-14 h-14 border border-primary/35 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2.5">Cerere trimisă</p>
        <h2 className="font-display text-white mb-4" style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 500 }}>
          Cont creat!
        </h2>
        <p className="text-white/40 text-sm font-condensed tracking-wide mb-8 leading-relaxed">{message}</p>
        <Link href="/login" className="inline-flex items-center justify-center w-full h-13 bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.22em] uppercase text-sm transition-colors duration-200">
          Mergi la autentificare
        </Link>
      </div>
    </div>
  )
}

export default function MesterRegisterForm({ categories }: Props) {
  const [error, setError]         = useState<string | null>(null)
  const [success, setSuccess]     = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const password        = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    if (password !== confirmPassword) { setError("Parolele nu coincid"); setLoading(false); return }
    if (password.length < 6)          { setError("Parola trebuie să aibă minim 6 caractere"); setLoading(false); return }
    if (!categoryId)                  { setError("Selectează o categorie"); setLoading(false); return }
    formData.set("categoryId", categoryId)
    const result = await signUpMester(formData)
    if (result?.error)        setError(result.error)
    else if (result?.success) setSuccess(result.message ?? null)
    setLoading(false)
  }

  if (success) return <SuccessScreen message={success} />

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col overflow-hidden">
        <div className="absolute inset-0">
          <Image src={BG_IMAGE} alt="" fill priority className="object-cover object-center opacity-[0.18]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/94 via-[#0d0905]/55 to-[#0d0905]/94" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/88 via-transparent to-[#0d0905]/88" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(13,9,5,0.85) 100%)" }} />
        <div className="absolute inset-0 opacity-[0.038]" style={{
          backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 68% 72% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 68% 72% at 50% 50%, black 20%, transparent 100%)",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(196,146,30,0.07) 0%, transparent 70%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 flex flex-col h-full px-11 py-11">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <Hammer className="h-5 w-5 text-primary" />
            <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/72 group-hover:text-white/95 transition-colors duration-200">
              Meșteri de Tulcea
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[360px]">
            <div className="flex items-center gap-5 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/35" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/35" />
            </div>
            <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-4">Cont meșter</p>
            <h1 className="font-display text-white leading-[1.06]" style={{ fontSize: "clamp(26px, 2.6vw, 46px)", fontWeight: 600 }}>
              Crește-ți afacerea<br />
              în{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>Tulcea</em>
            </h1>
            <p className="mt-5 text-white/38 text-sm leading-relaxed" style={{ fontFamily: "var(--font-barlow)" }}>
              Înregistrează-ți serviciile și fii descoperit de clienți locali care au nevoie de tine.
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

      {/* ── RIGHT PANEL — compact, no scroll ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 bg-[#0f0c07] relative">
        <div className="absolute inset-0 opacity-[0.016] pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8 flex items-center gap-2.5">
          <Hammer className="h-5 w-5 text-primary" />
          <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75">Meșteri de Tulcea</span>
        </Link>

        <div className="relative z-10 w-full max-w-[400px]">

          {/* ── Compact header: avatar inline cu titlul ── */}
          <div className="flex items-center gap-4 mb-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group h-12 w-12 rounded-full overflow-hidden border border-[#3d2e14] hover:border-primary/55 shrink-0 transition-colors focus:outline-none"
              aria-label="Încarcă poza de profil"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-white/[0.04] text-white/22">
                  <User className="h-5 w-5" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-white" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" name="avatar" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
            <div>
              <p className="font-condensed tracking-[0.26em] uppercase text-primary text-[10px] mb-0.5">
                Înregistrare meșter
              </p>
              <h2 className="font-display text-white leading-tight" style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 500 }}>
                Creează-ți profilul
              </h2>
              <p className="text-[9px] text-white/20 font-condensed tracking-wide mt-0.5">
                {avatarPreview ? "✓ Fotografie selectată" : "Fotografie de profil · opțional · click pe cerc"}
              </p>
            </div>
          </div>

          {/* ── Form ── */}
          <form action={handleSubmit} className="space-y-2">

            {/* Datele personale */}
            <div className="grid grid-cols-2 gap-2">
              <F label="Nume complet *">
                <Input name="fullName" type="text" placeholder="Ion Popescu" required autoComplete="name" className={inp} />
              </F>
              <F label="Telefon">
                <Input name="phone" type="tel" placeholder="0712 345 678" autoComplete="tel" className={inp} />
              </F>
            </div>

            <F label="Email *">
              <Input name="email" type="email" placeholder="email@exemplu.ro" required autoComplete="email" className={inp} />
            </F>

            <div className="grid grid-cols-2 gap-2">
              <F label="Parolă *">
                <Input name="password" type="password" placeholder="Min. 6 caractere" required autoComplete="new-password" className={inp} />
              </F>
              <F label="Confirmă parola *">
                <Input name="confirmPassword" type="password" placeholder="Repetă" required autoComplete="new-password" className={inp} />
              </F>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 !mt-4 !mb-1">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="font-condensed tracking-[0.22em] uppercase text-[9px] text-white/20">Informații business</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <F label="Nume firmă / Business *">
                <Input name="businessName" type="text" placeholder="ex. Instalații Ion" required className={inp} />
              </F>
              {/* Category — native select */}
              <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
                <div className="px-3 pt-1.5">
                  <span className="font-condensed tracking-[0.16em] uppercase text-[9px] text-white/28">Categorie *</span>
                </div>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-8 px-3 pb-1.5 pt-0 bg-transparent border-0 text-white font-sans text-[13px] focus:outline-none appearance-none cursor-pointer"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" disabled style={{ background: "#1a1208", color: "rgba(255,255,255,0.3)" }}>Selectează</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} style={{ background: "#1a1208", color: "white" }}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Textarea */}
            <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
              <div className="px-3 pt-1.5">
                <span className="font-condensed tracking-[0.16em] uppercase text-[9px] text-white/28">Descriere (opțional)</span>
              </div>
              <Textarea
                name="description"
                placeholder="Descrie serviciile tale, experiența, tipuri de lucrări..."
                rows={2}
                className="px-3 pb-2 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-[13px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <F label="Ani experiență">
                <Input name="experienceYears" type="number" placeholder="ex. 10" min={0} max={60} className={inp} />
              </F>
              <F label="WhatsApp">
                <Input name="whatsappNumber" type="tel" placeholder="0712 345 678" className={inp} />
              </F>
            </div>

            <F label="Adresă / Zonă (opțional)">
              <Input name="address" type="text" placeholder="Strada, nr., Tulcea" className={inp} />
            </F>

            {error && (
              <div className="border border-destructive/30 bg-destructive/[0.08] px-3 py-2">
                <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0 !mt-4">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Creează cont meșter"}
            </Button>

          </form>

          {/* Links */}
          <div className="mt-5 flex items-center justify-center gap-5">
            <p className="font-condensed tracking-[0.1em] text-[10px] text-white/25">
              Ești client?{" "}
              <Link href="/register/client" className="text-primary/60 hover:text-primary transition-colors duration-150">Înregistrare client</Link>
            </p>
            <div className="w-px h-3 bg-white/10" />
            <p className="font-condensed tracking-[0.1em] text-[10px] text-white/25">
              Ai cont?{" "}
              <Link href="/login" className="text-primary/60 hover:text-primary transition-colors duration-150">Autentifică-te</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

/* ── Helpers ── */
const inp = "h-8 px-3 pb-1.5 pt-0 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-[13px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
      <div className="px-3 pt-1.5">
        <span className="font-condensed tracking-[0.16em] uppercase text-[9px] text-white/28">{label}</span>
      </div>
      {children}
    </div>
  )
}
