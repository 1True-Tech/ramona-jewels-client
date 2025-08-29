"use client"

import type React from "react"

import { ReduxProvider } from "@/components/providers/redux-provider"
import { ReduxAuthProvider } from "@/contexts/redux-auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { OrderTrackingProvider } from "@/contexts/order-tracking-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReduxAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderTrackingProvider>
              {children}
            </OrderTrackingProvider>
          </WishlistProvider>
        </CartProvider>
      </ReduxAuthProvider>
    </ReduxProvider>
  )
}
