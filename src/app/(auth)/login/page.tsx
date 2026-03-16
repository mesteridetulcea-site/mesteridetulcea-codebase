"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Loader2, Hammer, Shield, Star, Users, ArrowLeft } from "lucide-react"
import { signIn } from "@/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (redirectTo) formData.append("redirectTo", redirectTo)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      window.location.href = result.redirectTo
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── LEFT PANEL — atmospheric editorial (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col overflow-hidden">

        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1685631188070-e5d4c9b2df6d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.20]"
          />
        </div>

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/92 via-[#0d0905]/52 to-[#0d0905]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/88 via-transparent to-[#0d0905]/88" />

        {/* Corner vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 32%, rgba(13,9,5,0.82) 100%)",
          }}
        />

        {/* Gold grid lines */}
        <div
          className="absolute inset-0 opacity-[0.038]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage:
              "radial-gradient(ellipse 68% 72% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 68% 72% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Gold center glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(196,146,30,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Right edge separator */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 py-11">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <Hammer className="h-5 w-5 text-primary" />
            <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75 group-hover:text-white/95 transition-colors duration-200">
              Meșteri de Tulcea
            </span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-[420px]">

            {/* Diamond ornament */}
            <div className="flex items-center gap-5 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/35" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/35" />
            </div>

            {/* Overline */}
            <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-4">
              Platforma meșterilor locali
            </p>

            {/* Headline */}
            <h1
              className="font-display text-white leading-[1.06]"
              style={{ fontSize: "clamp(30px, 3vw, 52px)", fontWeight: 600 }}
            >
              Conectăm oamenii<br />
              cu meșteri{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                de încredere
              </em>
            </h1>

            {/* Body */}
            <p
              className="mt-5 text-white/38 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              Descoperă cei mai buni meșteri din Tulcea.<br />
              Verificați, cu recenzii autentice, contactabili direct.
            </p>

          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { icon: Shield, label: "Meșteri verificați" },
              { icon: Star, label: "4.9★ rating" },
              { icon: Users, label: "200+ clienți" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs text-white/28 font-condensed tracking-[0.1em]"
              >
                <div className="w-6 h-6 border border-primary/22 flex items-center justify-center shrink-0">
                  <Icon className="h-3 w-3 text-primary/50" />
                </div>
                {label}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── RIGHT PANEL — login form ── */}
      <div className="flex-1 flex flex-col bg-[#0f0c07] relative overflow-y-auto lg:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ── MOBILE HERO BAND (hidden on desktop) ── */}
        <div className="lg:hidden relative h-[42vh] min-h-[240px] max-h-[300px] shrink-0 bg-[#0d0905]">

          {/* Background photo */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1685631188070-e5d4c9b2df6d?q=60&w=600&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover object-center opacity-[0.32]"
            />
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/75 via-[#0d0905]/25 to-[#0d0905]/90" />

          {/* Gold grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Bottom fade — transparent so card rounds show */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0d0905]" />

          {/* Top bar — logo + back */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-5">
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

          {/* Center hero text */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-6 pointer-events-none">

            {/* Ornament */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/80 rotate-45" />
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
              </div>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/40" />
            </div>

            <p className="font-condensed tracking-[0.26em] uppercase text-primary text-[10px] mb-2.5">
              Platforma meșterilor locali
            </p>

            <h1
              className="font-display text-white text-center leading-[1.1]"
              style={{ fontSize: "clamp(26px, 8vw, 36px)", fontWeight: 600 }}
            >
              Conectăm oamenii<br />
              cu meșteri{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                de încredere
              </em>
            </h1>
          </div>

          {/* Trust badges strip at bottom */}
          <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-4 px-5 pointer-events-none">
            {[
              { icon: Shield, label: "Verificați" },
              { icon: Star, label: "4.9★" },
              { icon: Users, label: "200+ clienți" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-white/30 font-condensed tracking-[0.1em] text-[9px] uppercase"
              >
                <Icon className="h-2.5 w-2.5 text-primary/45" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── FORM AREA — floats up over hero on mobile ── */}
        <div className="flex-1 flex flex-col items-center lg:justify-center relative lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">

          {/* Subtle gold grid texture (desktop only — mobile hero handles it) */}
          <div
            className="hidden lg:block absolute inset-0 opacity-[0.016]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Pill + card wrapper — mobile only */}
          <div className="lg:hidden w-full -mt-12 relative z-10" style={{ minHeight: "calc(100% + 48px)" }}>

            {/* Drag handle pill — sits above card on hero bg */}
            <div className="flex justify-center pt-3 pb-0">
              <div style={{ width: "40px", height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.22)" }} />
            </div>

          {/* Mobile card — bottom sheet style, full width, rounded top */}
          <div
            className="w-full mt-2"
            style={{ borderRadius: "28px 28px 0 0", background: "#17130d", border: "1px solid rgba(160,112,32,0.22)", borderBottom: "none", boxShadow: "0 -8px 32px rgba(0,0,0,0.6)", minHeight: "100%" }}
          >
            {/* Gold top accent */}
            <div className="mx-6 mt-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="px-6 pt-5 pb-12">

              {/* Form header */}
              <div className="text-center mb-7">
                <p className="font-condensed tracking-[0.26em] uppercase text-primary text-xs mb-2">
                  Autentificare
                </p>
                <h2
                  className="font-display text-white"
                  style={{ fontSize: "clamp(24px, 7vw, 32px)", fontWeight: 600 }}
                >
                  Bun venit înapoi
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="block font-condensed tracking-[0.16em] uppercase text-[11px] font-semibold text-white/55 mb-2">
                    Email
                  </label>
                  <div className="border border-[#3a2c12] bg-[#0d0a06] focus-within:border-primary/55 focus-within:bg-[#100e08] transition-all duration-200">
                    <Input
                      name="email"
                      type="email"
                      placeholder="email@exemplu.ro"
                      required
                      autoComplete="email"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-condensed tracking-[0.16em] uppercase text-[11px] font-semibold text-white/55">
                      Parolă
                    </label>
                    <Link
                      href="/recuperare-parola"
                      className="font-condensed tracking-[0.12em] uppercase text-[11px] text-primary/60 hover:text-primary transition-colors duration-150"
                    >
                      Ai uitat parola?
                    </Link>
                  </div>
                  <div className="border border-[#3a2c12] bg-[#0d0a06] focus-within:border-primary/55 focus-within:bg-[#100e08] transition-all duration-200">
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="h-12 px-4 bg-transparent border-0 text-white text-[15px] placeholder:text-white/22 font-sans rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="border-l-2 border-destructive bg-destructive/[0.06] px-4 py-3">
                    <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0"
                  style={{ height: "52px" }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Intră în cont"
                  )}
                </Button>

              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="font-condensed tracking-[0.2em] uppercase text-[11px] text-white/25">
                  sau continuă cu
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* Google */}
              <GoogleSignInButton />

              {/* Register link */}
              <p className="mt-7 text-center font-condensed tracking-[0.1em] text-sm text-white/35">
                Nu ai cont?{" "}
                <Link
                  href="/register"
                  className="text-primary/75 hover:text-primary transition-colors duration-150 underline underline-offset-2 decoration-primary/30"
                >
                  Înregistrează-te gratuit
                </Link>
              </p>

            </div>
          </div>
          </div>{/* end pill+card wrapper */}

          {/* Desktop form (unchanged layout, just hidden on mobile) */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center w-full px-8 py-12">

            {/* Desktop logo (shown only when no left panel, i.e. never now — kept for safety) */}
            <div className="relative z-10 w-full max-w-[340px]">

              {/* Form header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/35" />
                  <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                  <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/35" />
                </div>
                <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2.5">
                  Autentificare
                </p>
                <h2
                  className="font-display text-white"
                  style={{ fontSize: "clamp(24px, 2.8vw, 34px)", fontWeight: 500 }}
                >
                  Bun venit înapoi
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Email */}
                <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
                  <div className="px-4 pt-2.5">
                    <span className="font-condensed tracking-[0.18em] uppercase text-[10px] text-white/32">
                      Email
                    </span>
                  </div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="email@exemplu.ro"
                    required
                    autoComplete="email"
                    className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Password */}
                <div className="border border-[#3d2e14] focus-within:border-primary/55 transition-colors duration-200">
                  <div className="flex items-center justify-between px-4 pt-2.5">
                    <span className="font-condensed tracking-[0.18em] uppercase text-[10px] text-white/32">
                      Parolă
                    </span>
                    <Link
                      href="/recuperare-parola"
                      className="font-condensed tracking-[0.14em] uppercase text-[10px] text-primary/48 hover:text-primary transition-colors duration-150"
                    >
                      Ai uitat?
                    </Link>
                  </div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="h-10 px-4 pb-2.5 pt-0.5 bg-transparent border-0 text-white placeholder:text-white/16 font-sans text-sm rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="border border-destructive/30 bg-destructive/[0.08] px-4 py-2.5">
                    <p className="text-destructive text-xs font-condensed tracking-wide">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 border-0 !mt-5"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Intră în cont"
                  )}
                </Button>

              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="font-condensed tracking-[0.22em] uppercase text-[10px] text-white/22">
                  sau
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>

              {/* Google */}
              <GoogleSignInButton />

              {/* Register link */}
              <p className="mt-8 text-center font-condensed tracking-[0.1em] text-xs text-white/28">
                Nu ai cont?{" "}
                <Link
                  href="/register"
                  className="text-primary/65 hover:text-primary transition-colors duration-150"
                >
                  Înregistrează-te
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0905] flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
