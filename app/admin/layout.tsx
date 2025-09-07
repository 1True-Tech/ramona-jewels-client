"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/redux-auth-context"

export default function AdminRouteGuardLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (!user || user.role !== "admin") {
      router.replace("/auth/login")
    }
  }, [hydrated, user, router])

  if (!hydrated) {
    return null
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <>{children}</>
}