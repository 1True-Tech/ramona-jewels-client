"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

// Simple cookie helpers
function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null
  return null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show banner only if no prior decision
    const choice = getCookie("cookie_consent")
    if (!choice) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setCookie("cookie_consent", "accepted", 365)
    setVisible(false)
    // Place to initialize analytics/trackers conditionally in the future
  }

  const handleDecline = () => {
    setCookie("cookie_consent", "declined", 365)
    setVisible(false)
    // If you add analytics later, ensure they only load when consent === "accepted"
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed inset-x-0 bottom-0 z-50"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
        >
          <div className="mx-auto max-w-5xl p-4">
            <div className="rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm leading-relaxed text-muted-foreground">
                  We use cookies to improve your experience, provide essential site functionality, and analyze traffic. You can accept or decline. For more details, see our
                  {" "}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</Link>.
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Button variant="secondary" onClick={handleDecline} className="min-w-[100px]">Decline</Button>
                  <Button onClick={handleAccept} className="min-w-[120px]">Accept all</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent