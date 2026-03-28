"use client"

import { useActionState } from "react"

import { createWardrobeItemAction, type CreateWardrobeState } from "@/app/actions/wardrobe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WARDROBE_CATEGORIES } from "@/lib/wardrobe-categories"

const initial: CreateWardrobeState = {}

export function WardrobeAddForm() {
  const [state, formAction, pending] = useActionState(createWardrobeItemAction, initial)

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="title">Название</Label>
        <Input id="title" name="title" required maxLength={120} autoComplete="off" className="w-full" placeholder="Например, чёрный пиджак" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Категория</Label>
        <select
          id="category"
          name="category"
          required
          className="flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--grid-border)", color: "var(--grid-foreground)" }}
          defaultValue="top"
        >
          {WARDROBE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      {state?.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="min-h-11 w-full cursor-pointer" disabled={pending}>
        {pending ? "Сохранение…" : "Добавить в гардероб"}
      </Button>
    </form>
  )
}
