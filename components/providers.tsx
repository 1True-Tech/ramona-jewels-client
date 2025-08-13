"use client"

import type React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
  )
}
