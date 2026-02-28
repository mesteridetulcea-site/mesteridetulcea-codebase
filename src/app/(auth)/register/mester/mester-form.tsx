"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Camera, CheckCircle, Loader2, User } from "lucide-react"
import { signUpMester } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  categories: { id: string; name: string }[]
}

export default function MesterRegisterForm({ categories }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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

    // Inject categoryId from controlled state into formData
    formData.set("categoryId", categoryId)

    const result = await signUpMester(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message ?? null)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="w-full max-w-xl">
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
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Cont meșter</CardTitle>
        <CardDescription>
          Înregistrează-te pentru a-ți prezenta serviciile în Tulcea
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          {/* ── Datele tale ── */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Datele tale
            </p>

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
                  <div className="flex flex-col items-center justify-center h-full w-full bg-muted text-muted-foreground">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </button>
              <p className="text-xs text-muted-foreground">Poza de profil (opțional)</p>
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
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Informații business
              </span>
            </div>
          </div>

          {/* ── Business info ── */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nume business</Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="ex. Instalații Ionescu"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Categorie</Label>
              <Select onValueChange={setCategoryId} required>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Selectează categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descriere (opțional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrie serviciile tale, experiența, etc."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Ani experiență</Label>
                <Input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  placeholder="ex. 10"
                  min={0}
                  max={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp (opțional)</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="tel"
                  placeholder="0712 345 678"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresă (opțional)</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Strada, nr., Tulcea"
              />
            </div>
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
              "Creează cont meșter"
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
          Ești client?{" "}
          <Link href="/register/client" className="text-primary hover:underline">
            Înregistrează-te ca client
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
