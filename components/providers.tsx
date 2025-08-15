"use client"

import type React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { OrderTrackingProvider } from "@/contexts/order-tracking-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderTrackingProvider>
              {children}
            </OrderTrackingProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
  )
}
