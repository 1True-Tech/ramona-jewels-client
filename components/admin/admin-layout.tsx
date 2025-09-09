"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Warehouse,
  CreditCard,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/redux-auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { AdminErrorFallback } from "@/components/admin/admin-error-boundary"
import { UserAvatar } from "@/components/ui/user-avatar"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Detect large screens
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <ErrorBoundary fallback={AdminErrorFallback}>
      <div className="h-screen bg-background">
        {/* Overlay for mobile */}
        {sidebarOpen && !isLargeScreen && (
          <div
            className="fixed inset-0 z-40 bg-background/30 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{
            x: isLargeScreen ? 0 : sidebarOpen ? 0 : "-100%",
          }}
          transition={{ type: "tween" }}
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 flex flex-col bg-white shadow-none ${sidebarOpen ? "border-r-none" : ""}`}
        >
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200 shrink-0">
            <div className="!h-8 min-w-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg md:text-xl font-bold">Admin Panel</span>
            {!isLargeScreen && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-r-lg px-3 py-2 my-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "gradient-primary text-white"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4 shrink-0 flex items-center justify-between w-full">
            <Link href={user ? "/profile" : "/auth/login"} className="flex items-center gap-3 mb-3">
              <UserAvatar 
                user={user} 
                size="sm" 
                className="flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="justify-start"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div
          className={`flex flex-col h-screen transition-all ${
            isLargeScreen ? "lg:ml-64" : ""
          }`}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-background px-6">
            {!isLargeScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <div className="flex-1" />

            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to Store
            </Link>
          </div>

          {/* Page content */}
          <main className="p-6 overflow-y-auto flex-1">
            <ErrorBoundary fallback={AdminErrorFallback}>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
