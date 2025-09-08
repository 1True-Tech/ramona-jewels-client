"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ShoppingCart, User, ShoppingBasket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/redux-auth-context"
import { useCart } from "@/contexts/cart-context"

export function MobileNav() {
  const pathname = usePathname()
  const { state } = useCart()
  const { user } = useAuth()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: ShoppingBasket },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: state.itemCount > 0 ? state.itemCount : null }, // Only show if > 0 },
    {
      name: "Profile",
      href: user ? (user.role === "admin" ? "/admin" : "/profile") : "/auth/login",
      icon: User,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-primary/20 lg:hidden px-5">
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center space-y-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative">
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs gradient-primary text-white border-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
