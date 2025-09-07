"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth token and validate
    const token = localStorage.getItem("token")
    if (token) {
      // In a real app, validate token with backend
      const mockUser = {
        id: "1",
        email: "user@example.com",
        name: "John Doe",
        role: "user" as const,
      }
      setUser(mockUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock login - replace with actual API call
      if (email === "admin@example.com" && password === "admin123") {
        const adminUser = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin" as const,
        }
        setUser(adminUser)
        localStorage.setItem("token", "mock-admin-token")
      } else if (email === "user@example.com" && password === "user123") {
        const regularUser = {
          id: "2",
          email: "user@example.com",
          name: "John Doe",
          role: "user" as const,
        }
        setUser(regularUser)
        localStorage.setItem("token", "mock-user-token")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Mock registration - replace with actual API call
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        role: "user" as const,
      }
      setUser(newUser)
      localStorage.setItem("token", "mock-token")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
