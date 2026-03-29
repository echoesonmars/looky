"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isPrismaConnectionError } from "@/lib/prisma-db-error"
import { isWardrobeCategoryId } from "@/lib/wardrobe-categories"

export type CreateWardrobeState = { error?: string }

export async function createWardrobeItemAction(
  _prev: CreateWardrobeState | undefined,
  formData: FormData,
): Promise<CreateWardrobeState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Войдите, чтобы добавить вещь." }
  }

  const title = String(formData.get("title") ?? "").trim()
  const category = String(formData.get("category") ?? "")

  if (title.length < 1 || title.length > 120) {
    return { error: "Название: от 1 до 120 символов." }
  }
  if (!isWardrobeCategoryId(category)) {
    return { error: "Выберите категорию из списка." }
  }

  try {
    await prisma.wardrobeItem.create({
      data: {
        userId: session.user.id,
        title,
        category,
        source: "manual",
      },
    })
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      return {
        error:
          "Не удаётся подключиться к базе. Проверьте DATABASE_URL и доступ к Supabase (пулер, сеть).",
      }
    }
    throw e
  }

  revalidatePath("/home")
  revalidatePath("/wardrobe")
  redirect("/wardrobe")
}
