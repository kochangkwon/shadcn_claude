"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LoginModal } from "@/components/auth/login-modal"
import { SignupModal } from "@/components/auth/signup-modal"
import * as React from "react"

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loginOpen, setLoginOpen] = React.useState(false)
  const [signupOpen, setSignupOpen] = React.useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      // 로그인되어 있으면 대시보드로 이동
      router.push("/dashboard")
    } else {
      // 로그인되어 있지 않으면 로그인 모달 열기
      setLoginOpen(true)
    }
  }, [session, status, router])

  const handleSwitchToSignup = () => {
    setLoginOpen(false)
    setTimeout(() => setSignupOpen(true), 150)
  }

  const handleSwitchToLogin = () => {
    setSignupOpen(false)
    setTimeout(() => setLoginOpen(true), 150)
  }

  // 로딩 중이거나 이미 로그인된 경우 빈 화면 표시
  if (status === "loading" || session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to AI SaaS Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Sign in to get started
          </p>
        </div>
      </div>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}