"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Warehouse,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
// import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
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
    <div className="h-screen bg-background">
      {/* Overlay for mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 z-40 bg-background/90 backdrop-blur-sm"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col bg-white`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b shrink-0">
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
                className={`flex items-center gap-3 rounded-r-lg px-3 py-2 text-sm font-medium transition-colors ${
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
        <div className="border-t p-4 shrink-0 flex items-center justify-between w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <ThemeToggle /> */}
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
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
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
        <main className="p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  )
}
