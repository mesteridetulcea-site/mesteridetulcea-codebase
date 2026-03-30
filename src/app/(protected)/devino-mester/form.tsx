"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { applyAsMester } from "@/actions/mester"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  categories: { id: string; name: string }[]
}

/* ── Field wrapper (light bg editorial style) ── */
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#584528]/30 focus-within:border-primary/70 transition-colors duration-200">
      <div className="px-4 pt-2.5">
        <span className="block font-condensed tracking-[0.18em] uppercase text-[11px] font-semibold text-[#584528]/70">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

const inp = "h-11 px-4 pb-2 pt-0.5 bg-transparent border-0 text-[#1a1208] placeholder:text-[#584528]/40 font-sans text-[15px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full"

/* ── Category multi-select pills ── */
function CategoryPills({
  categories,
  selected,
  onChange,
}: {
  categories: { id: string; name: string }[]
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  }
  return (
    <div className="border border-[#584528]/30 transition-colors duration-200">
      <div className="px-4 pt-2.5 pb-3">
        <span className="block font-condensed tracking-[0.18em] uppercase text-[11px] font-semibold text-[#584528]/70 mb-3">
          Calificări / Categorii *
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selected.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className="font-condensed tracking-[0.1em] uppercase text-xs px-3 py-1.5 transition-all duration-150"
                style={{
                  border: `1px solid ${active ? "hsl(38 68% 44%)" : "rgba(88,69,40,0.22)"}`,
                  background: active ? "hsl(38 68% 44%)" : "transparent",
                  color: active ? "white" : "rgba(88,69,40,0.6)",
                }}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function BecomeMesterForm({ categories }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categoryIds, setCategoryIds] = useState<string[]>([])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    if (categoryIds.length === 0) {
      setError("Selectează cel puțin o categorie")
      setLoading(false)
      return
    }

    categoryIds.forEach((id) => formData.append("categoryId", id))

    const result = await applyAsMester(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success the server action redirects to /mester-cont
  }

  return (
    <div>

      {/* Section label */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-6 h-px bg-primary/60" />
        <span className="font-condensed text-[12px] tracking-[0.28em] uppercase text-[#584528]/75 font-semibold">
          Informații business
        </span>
      </div>

      <form action={handleSubmit}>
        <div className="space-y-px">

          {/* Business name */}
          <F label="Nume business *">
            <Input
              name="businessName"
              type="text"
              placeholder="ex. Instalații Ionescu"
              required
              className={inp}
            />
          </F>

          {/* Categories */}
          <CategoryPills
            categories={categories}
            selected={categoryIds}
            onChange={setCategoryIds}
          />

          {/* Description */}
          <div className="border border-[#584528]/30 focus-within:border-primary/70 transition-colors duration-200">
            <div className="px-4 pt-2.5">
              <span className="block font-condensed tracking-[0.18em] uppercase text-[11px] font-semibold text-[#584528]/70">
                Descriere (opțional)
              </span>
            </div>
            <Textarea
              name="description"
              placeholder="Descrie serviciile tale, experiența, tipuri de lucrări..."
              rows={3}
              className="px-4 pb-3 pt-1.5 bg-transparent border-0 text-[#1a1208] placeholder:text-[#584528]/40 font-sans text-[15px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none w-full"
            />
          </div>

          {/* Experience + WhatsApp */}
          <div className="grid grid-cols-2">
            <F label="Ani experiență">
              <Input
                name="experienceYears"
                type="number"
                placeholder="ex. 10"
                min={0}
                max={60}
                className={inp}
              />
            </F>
            <div className="border border-[#584528]/30 border-l-0 focus-within:border-primary/70 transition-colors duration-200">
              <div className="px-4 pt-2.5">
                <span className="block font-condensed tracking-[0.18em] uppercase text-[11px] font-semibold text-[#584528]/70">
                  WhatsApp (opțional)
                </span>
              </div>
              <Input
                name="whatsappNumber"
                type="tel"
                placeholder="0758 065 244"
                className={inp}
              />
            </div>
          </div>

          {/* Address */}
          <F label="Adresă / Zonă (opțional)">
            <Input
              name="address"
              type="text"
              placeholder="Strada, nr., Tulcea"
              className={inp}
            />
          </F>

        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-[#584528]/08" />

        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-red-700 text-xs font-condensed tracking-wide">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.24em] uppercase text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ height: "52px" }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Se creează profilul...
            </>
          ) : (
            "Trimite aplicația"
          )}
        </button>

        <p className="mt-5 text-center text-xs font-condensed tracking-wide text-[#584528]/38">
          Profilul tău va fi verificat de un administrator înainte de a fi publicat.{" "}
          <Link
            href="/termeni"
            className="text-primary/65 hover:text-primary transition-colors duration-150 underline underline-offset-2 decoration-primary/30"
          >
            Termeni și condiții
          </Link>
        </p>

      </form>
    </div>
  )
}
