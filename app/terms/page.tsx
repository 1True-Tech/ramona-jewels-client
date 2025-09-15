"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/redux-auth-context"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { useGoogleSignInMutation } from "@/store/api/authApi"

export default function TermsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { register: registerUser } = useAuth()
  const [googleSignIn] = useGoogleSignInMutation()
  const [pending, setPending] = useState<{ name: string; email: string; password: string } | null>(null)
  const [pendingSocial, setPendingSocial] = useState<{ provider: 'google'; idToken: string; clientId?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load pending registration data from sessionStorage
    try {
      const raw = sessionStorage.getItem("pending_registration")
      if (raw) setPending(JSON.parse(raw))
      const rawSocial = sessionStorage.getItem('pending_social_signup')
      if (rawSocial) setPendingSocial(JSON.parse(rawSocial))
    } catch {}
  }, [])

  const handleAccept = async () => {
    if (!pending && !pendingSocial) {
      dispatch(showModal({ type: 'error', title: 'No Registration Data', message: 'Please start registration again.' }))
      router.push('/auth/register')
      return
    }
    setIsSubmitting(true)
    try {
      if (pendingSocial && pendingSocial.provider === 'google') {
        const res = await googleSignIn({ idToken: pendingSocial.idToken, mode: 'signup', clientId: pendingSocial.clientId }).unwrap()
        if (!res?.success) throw new Error('Google sign-up failed')
        sessionStorage.removeItem('pending_social_signup')
        sessionStorage.removeItem('pending_registration')
      } else if (pending) {
        await registerUser(pending.name, pending.email, pending.password)
        sessionStorage.removeItem("pending_registration")
      }
      // Redirect to home/dashboard
      router.push('/')
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Registration failed'
      dispatch(showModal({ type: 'error', title: 'Registration failed', message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecline = () => {
    // Do not create the user; clear pending data and go back to register
    sessionStorage.removeItem("pending_registration")
    sessionStorage.removeItem('pending_social_signup')
    dispatch(showModal({ type: 'warning', title: 'Terms not accepted', message: 'You must accept the Terms to create an account.' }))
    router.push('/auth/register')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-10 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Card className="border md:shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-playfair">Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please read and accept our Terms to complete your registration. For more information, see our{' '}
              <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> and{' '}
              <Link href="/cookies" className="text-primary underline">Cookies Policy</Link>.
            </p>


            <div className="h-[50vh] overflow-y-auto rounded-md md:border border-gray-300 p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h2 className="font-bold">1. Introduction</h2>
                <p>
                  Welcome to Ramona Jewels. By creating an account and using our services, you agree to be bound by these terms.
                </p>
                <h2 className="mt-3 font-bold">2. User Responsibilities</h2>
                <ul>
                  <li>Provide accurate registration information.</li>
                  <li>Maintain the confidentiality of your account credentials.</li>
                  <li>Use the platform lawfully and respectfully.</li>
                </ul>
                <h2 className="mt-3 font-bold">3. Purchases and Payments</h2>
                <p>All purchases are subject to our policies and applicable laws.</p>
                <h2 className="mt-3 font-bold">4. Privacy</h2>
                <p>We handle your data as described in our Privacy Policy.</p>
                <h2 className="mt-3 font-bold">5. Cookies</h2>
                <p>We use cookies as described in our Cookies Policy.</p>
                <h2 className="mt-3 font-bold">6. Modifications</h2>
                <p>We may update these terms from time to time. Continued use constitutes acceptance of the revised terms.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
              <Button variant="outline" onClick={handleDecline} disabled={isSubmitting}>Decline</Button>
              <Button className="gradient-primary text-white" onClick={handleAccept} disabled={isSubmitting}>
                {isSubmitting ? 'Completing registration...' : 'I Accept the Terms'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}