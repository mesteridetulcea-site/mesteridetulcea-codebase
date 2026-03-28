"use client"

import { useState, useEffect } from "react"
import {
  Loader2, Plus, Pencil, Trash2, X,
  Info, Zap, Droplets, Hammer, PaintBucket, Wrench, Truck, Cog, Home, Copy, Check as CheckIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

const panel = {
  background: "white",
  border: "1px solid #e0c99a",
  borderRadius: "6px",
} as const

const inputCls =
  "bg-[#faf6ed] border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/60 rounded-[4px] h-11 text-sm"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-condensed tracking-[0.14em] uppercase text-xs text-[#8a6848] mb-1.5 font-medium">
      {children}
    </p>
  )
}

const AVAILABLE_ICONS = [
  { slug: "electrician", icon: Zap,         label: "Electrician",  description: "Instalații electrice, tablouri, prize" },
  { slug: "instalator",  icon: Droplets,    label: "Instalator",   description: "Instalații sanitare, apă, canalizare" },
  { slug: "zidar",       icon: Hammer,      label: "Zidar",        description: "Zidărie, construcție, renovare" },
  { slug: "zugrav",      icon: PaintBucket, label: "Zugrav",       description: "Zugrăveli, vopsitorie, decorațiuni" },
  { slug: "tamplar",     icon: Wrench,      label: "Tâmplar",      description: "Tâmplărie, uși, ferestre, mobilier" },
  { slug: "transport",   icon: Truck,       label: "Transport",    description: "Transport marfă, mutări, livrări" },
  { slug: "mecanica",    icon: Cog,         label: "Mecanică",     description: "Service auto, reparații mecanice" },
  { slug: "constructii", icon: Home,        label: "Construcții",  description: "Construcții generale, amenajări" },
]

export default function AdminCategoriesPage() {
  const [categories, setCategories]             = useState<Category[]>([])
  const [loading, setLoading]                   = useState(true)
  const [saving, setSaving]                     = useState(false)
  const [dialogOpen, setDialogOpen]             = useState(false)
  const [editingCategory, setEditingCategory]   = useState<Category | null>(null)
  const [deleteConfirm, setDeleteConfirm]       = useState<Category | null>(null)
  const [infoOpen, setInfoOpen]                 = useState(false)
  const [copiedSlug, setCopiedSlug]             = useState<string | null>(null)

  useEffect(() => { loadCategories() }, [])

  function copySlug(slug: string) {
    navigator.clipboard.writeText(slug)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 1500)
  }

  async function loadCategories() {
    const supabase = createClient()
    const { data } = await supabase.from("categories").select("*").order("sort_order")
    setCategories(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const result = editingCategory
      ? await updateCategory(editingCategory.id, formData)
      : await createCategory(formData)

    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: editingCategory ? "Categorie actualizată!" : "Categorie creată!" })
      setDialogOpen(false)
      setEditingCategory(null)
      loadCategories()
    }
    setSaving(false)
  }

  async function handleDelete(category: Category) {
    const result = await deleteCategory(category.id)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Categorie ștearsă" })
      setDeleteConfirm(null)
      loadCategories()
    }
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  function openCreateDialog() {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10 flex items-start justify-between gap-4"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <div>
          <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
            Panou admin
          </p>
          <h1
            className="font-condensed text-[#1a0f05] leading-[1.1]"
            style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
          >
            Categorii
          </h1>
          <p className="text-sm text-[#8a6848] mt-2">
            Gestionează categoriile de servicii
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 shrink-0">
          <button
            onClick={() => setInfoOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 font-condensed tracking-[0.14em] uppercase text-sm font-semibold transition-all duration-200"
            style={{
              border: "1px solid #e0c99a",
              color: "#8a6848",
              borderRadius: "6px",
            }}
            title="Iconuri disponibile"
          >
            <Info className="h-4 w-4" />
            Iconuri
          </button>
          <button
            onClick={openCreateDialog}
            className="flex items-center gap-2 px-5 py-2.5 font-condensed tracking-[0.14em] uppercase text-sm font-semibold transition-all duration-200"
            style={{
              border: "1px solid hsl(38 68% 44% / 0.5)",
              color: "hsl(38 68% 44%)",
              borderRadius: "6px",
            }}
          >
            <Plus className="h-4 w-4" />
            Adaugă
          </button>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10">
        {categories.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3" style={panel}>
            <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
              Nu există categorii. Adaugă prima categorie.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category.id} style={panel}>
                <div
                  className="px-5 py-4 flex items-start justify-between gap-3"
                  style={{ borderBottom: "1px solid #e0c99a" }}
                >
                  <h3
                    className="font-condensed tracking-[0.08em] text-[#1a0f05] font-semibold"
                    style={{ fontSize: "15px" }}
                  >
                    {category.name}
                  </h3>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEditDialog(category)}
                      className="w-8 h-8 flex items-center justify-center text-[#8a6848] hover:text-primary transition-colors"
                      style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(category)}
                      className="w-8 h-8 flex items-center justify-center text-[#8a6848] hover:text-red-500 transition-colors"
                      style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="px-5 py-3 space-y-1.5">
                  <p className="text-xs text-[#8a6848]">
                    <span className="text-[#b8956a]">Slug:</span> {category.slug}
                  </p>
                  {category.icon && (
                    <p className="text-xs text-[#8a6848]">
                      <span className="text-[#b8956a]">Icon:</span> {category.icon}
                    </p>
                  )}
                  {category.keywords && category.keywords.length > 0 ? (
                    <p className="text-xs text-[#8a6848]">
                      <span className="text-[#b8956a]">Keywords:</span>{" "}
                      {category.keywords.slice(0, 4).join(", ")}
                      {category.keywords.length > 4 && (
                        <span className="text-[#b8956a]"> +{category.keywords.length - 4}</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-xs text-[#d4b896] italic">Fără cuvinte cheie</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(10,6,2,0.6)" }}
        >
          <div
            className="w-full max-w-md"
            style={{ background: "white", border: "1px solid #e0c99a", borderRadius: "8px" }}
          >
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ borderBottom: "1px solid #e0c99a" }}
            >
              <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
                {editingCategory ? "Editează categorie" : "Categorie nouă"}
              </p>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-[#8a6848] hover:text-[#3d2810] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <FieldLabel>Nume *</FieldLabel>
                <Input
                  className={inputCls}
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                />
              </div>
              <div>
                <FieldLabel>Icon (slug)</FieldLabel>
                <Input
                  className={inputCls}
                  name="icon"
                  defaultValue={editingCategory?.icon || ""}
                  placeholder="electrician, instalator, etc."
                />
              </div>
              <div>
                <FieldLabel>Cuvinte cheie pentru căutare</FieldLabel>
                <textarea
                  name="keywords"
                  defaultValue={editingCategory?.keywords?.join(", ") || ""}
                  placeholder="prize, curent, tablou, sigurante, cablu..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-[#faf6ed] border border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus:outline-none focus:border-primary/60 rounded-[4px] resize-none"
                />
                <p className="mt-1 text-xs text-[#b8956a]">
                  Separate prin virgulă. Ex: prize, curent, tablou, bec
                </p>
              </div>
              <div
                className="flex gap-3 justify-end pt-2"
                style={{ borderTop: "1px solid #e0c99a" }}
              >
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-5 h-10 font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] hover:text-[#3d2810] transition-colors"
                  style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 h-10 font-condensed tracking-[0.12em] uppercase text-xs font-semibold bg-primary hover:bg-primary/85 text-white transition-all duration-200 disabled:opacity-60"
                  style={{ borderRadius: "4px" }}
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingCategory ? "Salvează" : "Creează"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Icons info modal */}
      {infoOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(10,6,2,0.6)" }}
          onClick={() => setInfoOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] flex flex-col"
            style={{ background: "white", border: "1px solid #e0c99a", borderRadius: "8px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-5 flex items-center justify-between shrink-0"
              style={{ borderBottom: "1px solid #e0c99a" }}
            >
              <div>
                <p className="font-condensed tracking-[0.18em] uppercase text-sm font-semibold text-[#3d2810]">
                  Iconuri disponibile
                </p>
                <p className="text-xs text-[#8a6848] mt-0.5">
                  Apasă pe un slug pentru a-l copia
                </p>
              </div>
              <button
                onClick={() => setInfoOpen(false)}
                className="text-[#8a6848] hover:text-[#3d2810] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Icon list */}
            <div className="overflow-y-auto flex-1 px-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_ICONS.map(({ slug, icon: Icon, label, description }) => {
                  const isCopied = copiedSlug === slug
                  return (
                    <div
                      key={slug}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        background: "#faf6ed",
                        border: "1px solid #e0c99a",
                        borderRadius: "6px",
                      }}
                    >
                      {/* Icon preview */}
                      <div
                        className="w-9 h-9 flex items-center justify-center shrink-0"
                        style={{
                          background: "white",
                          border: "1px solid #e0c99a",
                          borderRadius: "6px",
                        }}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="font-condensed tracking-[0.06em] text-sm font-semibold text-[#1a0f05] leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-xs text-[#8a6848] leading-snug">
                          {description}
                        </p>
                      </div>

                      {/* Copy slug button */}
                      <button
                        onClick={() => copySlug(slug)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 shrink-0 transition-all duration-200"
                        style={{
                          background: isCopied ? "hsl(142 55% 42% / 0.1)" : "white",
                          border: isCopied ? "1px solid hsl(142 55% 42% / 0.4)" : "1px solid #d4c0a0",
                          borderRadius: "4px",
                          color: isCopied ? "hsl(142 55% 42%)" : "#8a6848",
                        }}
                        title={`Copiază „${slug}"`}
                      >
                        {isCopied
                          ? <CheckIcon className="h-3 w-3" />
                          : <Copy className="h-3 w-3" />}
                        <span className="font-condensed tracking-[0.08em] text-[10px] uppercase font-semibold">
                          {slug}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer note */}
            <div
              className="px-6 py-3 shrink-0"
              style={{ borderTop: "1px solid #e0c99a" }}
            >
              <p className="text-xs text-[#b8956a]">
                Dacă niciun slug nu se potrivește, iconul implicit va fi <span className="font-semibold text-[#8a6848]">zidar</span> (ciocan).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(10,6,2,0.6)" }}
        >
          <div
            className="w-full max-w-sm"
            style={{ background: "white", border: "1px solid #e0c99a", borderRadius: "8px" }}
          >
            <div className="px-6 py-5" style={{ borderBottom: "1px solid #e0c99a" }}>
              <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
                Confirmare ștergere
              </p>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-[#8a6848]">
                Ești sigur că vrei să ștergi categoria{" "}
                <span className="font-semibold text-[#3d2810]">{deleteConfirm.name}</span>?
                Această acțiune nu poate fi anulată.
              </p>
            </div>
            <div
              className="px-6 py-4 flex gap-3 justify-end"
              style={{ borderTop: "1px solid #e0c99a" }}
            >
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 h-10 font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] hover:text-[#3d2810] transition-colors"
                style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
              >
                Anulează
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 h-10 font-condensed tracking-[0.12em] uppercase text-xs font-semibold transition-all duration-200"
                style={{
                  background: "hsl(0 62% 52% / 0.1)",
                  border: "1px solid hsl(0 62% 52% / 0.4)",
                  color: "hsl(0 62% 52%)",
                  borderRadius: "4px",
                }}
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
