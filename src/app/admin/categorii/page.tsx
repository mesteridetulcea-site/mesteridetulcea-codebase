"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const supabase = createClient()
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("order_index")

    setCategories(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)

    let result
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, formData)
    } else {
      result = await createCategory(formData)
    }

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

  async function handleDelete(categoryId: string) {
    const result = await deleteCategory(categoryId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Categorie ștearsă" })
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
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorii</h1>
          <p className="text-muted-foreground">
            Gestionează categoriile de servicii
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă categorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editează categorie" : "Categorie nouă"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (slug)</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={editingCategory?.icon || ""}
                  placeholder="electrician, instalator, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Cuvinte cheie (separate prin virgulă)</Label>
                <Input
                  id="keywords"
                  name="keywords"
                  defaultValue={editingCategory?.keywords?.join(", ") || ""}
                  placeholder="priză, cablu, tablou electric"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Anulează
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingCategory ? "Salvează" : "Creează"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nu există categorii. Adaugă prima categorie.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {category.name}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Această acțiune nu poate fi anulată. Categoria va fi
                            ștearsă permanent.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anulează</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                          >
                            Șterge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Slug: {category.slug}
                </p>
                {category.description && (
                  <p className="text-sm mt-2">{category.description}</p>
                )}
                {category.keywords && category.keywords.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Cuvinte cheie: {category.keywords.join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
