"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-10 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-playfair">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Last updated: 2025-01-01</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm sm:prose md:prose-lg dark:prose-invert max-w-none">
              <p>
                Your privacy is important to us. This Privacy Policy explains how Ramona Jewels collects, uses, and protects your personal information.
              </p>

              <h2 id="information-we-collect" className="scroll-mt-24 mt-2 font-bold">Information We Collect</h2>
              <ul>
                <li>Account information you provide (name, email, etc.).</li>
                <li>Order and payment details when you make purchases.</li>
                <li>Usage data to improve our services.</li>
              </ul>

              <h2 id="how-we-use" className="scroll-mt-24 mt-3 font-bold">How We Use Information</h2>
              <ul>
                <li>To provide and improve our services.</li>
                <li>To process orders and payments.</li>
                <li>To communicate with you about your account and orders.</li>
              </ul>

              <h2 id="data-protection" className="scroll-mt-24 mt-3 font-bold">Data Protection</h2>
              <p>
                We implement security measures to protect your data from unauthorized access and follow industry best practices to keep your personal information safe.
              </p>

              <h2 id="your-rights" className="scroll-mt-24 mt-3 font-bold">Your Rights</h2>
              <ul>
                <li>Access, update, or delete your personal information.</li>
                <li>Opt out of marketing communications at any time.</li>
                <li>Request data portability where applicable.</li>
              </ul>

              <h2 id="third-parties" className="scroll-mt-24 mt-3 font-bold">Third-Party Services</h2>
              <p>
                We may use trusted third-party services (e.g., payment processors and analytics providers) that handle your data in accordance with their own privacy policies.
              </p>

              <h2 id="contact" className="scroll-mt-24 mt-3 font-bold">Contact</h2>
              <p>
                If you have questions about this policy, please contact support. For related information, see our{' '}
                <Link href="/cookies" className="text-primary underline">Cookies Policy</Link> and{' '}
                <Link href="/terms" className="text-primary underline">Terms & Conditions</Link>.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}