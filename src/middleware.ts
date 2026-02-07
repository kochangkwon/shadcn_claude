import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // 보호된 경로 (로그인 필요)
  const protectedPaths = ["/dashboard"]
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // 로그인되지 않은 상태에서 보호된 경로 접근 시 홈으로 리다이렉트
  if (isProtectedPath && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

// middleware가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
