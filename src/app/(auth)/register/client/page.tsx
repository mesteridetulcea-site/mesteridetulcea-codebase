"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Camera, CheckCircle, Loader2, User } from "lucide-react"
import { signUpClient } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterClientPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await signUpClient(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message ?? null)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Cont creat cu succes!</CardTitle>
          <CardDescription>{success}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link href="/login">
            <Button>Mergi la autentificare</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Cont client</CardTitle>
        <CardDescription>
          Înregistrează-te pentru a găsi meșteri în Tulcea
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group h-20 w-20 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Încarcă poza de profil"
            >
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Previzualizare profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full bg-muted text-muted-foreground gap-1">
                  <User className="h-7 w-7" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </button>
            <p className="text-xs text-muted-foreground">
              Poza de profil (opțional)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nume complet</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Ion Popescu"
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplu.ro"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon (opțional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0712 345 678"
              autoComplete="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Parolă</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minim 6 caractere"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmă parola</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repetați parola"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se creează contul...
              </>
            ) : (
              "Creează cont"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-center text-muted-foreground">
        <p>
          Ai deja cont?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Autentifică-te
          </Link>
        </p>
        <p>
          Ești meșter?{" "}
          <Link href="/register/mester" className="text-primary hover:underline">
            Înregistrează-te ca meșter
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
