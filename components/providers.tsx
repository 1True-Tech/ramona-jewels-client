"use client"

import type React from "react"

import { ReduxProvider } from "@/components/providers/redux-provider"
import { ReduxAuthProvider } from "@/contexts/redux-auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { OrderTrackingProvider } from "@/contexts/order-tracking-context"
import UIResponseModalProvider from "@/components/providers/ui-response-modal-provider"
import { GoogleOAuthProvider } from "@react-oauth/google"

export function Providers({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const content = (
    <>
      {children}
      <UIResponseModalProvider />
    </>
  )

  return (
    <ReduxProvider>
      <ReduxAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderTrackingProvider>
              {googleClientId ? (
                <GoogleOAuthProvider clientId={googleClientId}>
                  {content}
                </GoogleOAuthProvider>
              ) : (
                content
              )}
            </OrderTrackingProvider>
          </WishlistProvider>
        </CartProvider>
      </ReduxAuthProvider>
    </ReduxProvider>
  )
}
