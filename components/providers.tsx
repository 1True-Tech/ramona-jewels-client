"use client"

import type React from "react"

import { ReduxProvider } from "@/components/providers/redux-provider"
import { ReduxAuthProvider } from "@/contexts/redux-auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { OrderTrackingProvider } from "@/contexts/order-tracking-context"
import UIResponseModalProvider from "@/components/providers/ui-response-modal-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReduxAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderTrackingProvider>
              {children}
              <UIResponseModalProvider />
            </OrderTrackingProvider>
          </WishlistProvider>
        </CartProvider>
      </ReduxAuthProvider>
    </ReduxProvider>
  )
}
