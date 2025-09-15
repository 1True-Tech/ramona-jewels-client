"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 py-10 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-playfair">Cookies Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last updated: 2025-01-01</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm sm:prose md:prose-lg dark:prose-invert max-w-none">
              <p>
                We use cookies to enhance your experience, analyze traffic, and personalize content. By continuing to use our site, you consent to our use of cookies.
              </p>
              <h2 id="what-are-cookies" className="scroll-mt-24 mt-3 font-bold">What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device by your browser.</p>
              <h2 id="types" className="scroll-mt-24 mt-3 font-bold">Types of Cookies We Use</h2>
              <ul>
                <li>Essential cookies for site functionality.</li>
                <li>Analytics cookies to understand usage.</li>
                <li>Preference cookies to remember your settings.</li>
              </ul>
              <h2 id="managing" className="scroll-mt-24 mt-3 font-bold">Managing Cookies</h2>
              <p>You can manage or disable cookies in your browser settings. You can also review our{' '}
                <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> for more details about how we handle data.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}