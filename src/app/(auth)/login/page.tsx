"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Loader2, Hammer, Shield, Star, Users } from "lucide-react"
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
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL — atmospheric editorial ── */}
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
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-[#0f0c07] relative overflow-hidden">

        {/* Subtle gold grid texture */}
        <div
          className="absolute inset-0 opacity-[0.016]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-10 flex items-center gap-2.5">
          <Hammer className="h-5 w-5 text-primary" />
          <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75">
            Meșteri de Tulcea
          </span>
        </Link>

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
