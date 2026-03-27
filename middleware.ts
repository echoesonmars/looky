export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    /*
     * Match all except static assets and similar.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
