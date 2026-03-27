import { auth } from "@/auth"
import { updateSession } from "@/utils/supabase/middleware"

export default auth(async (req) => {
  return await updateSession(req)
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
