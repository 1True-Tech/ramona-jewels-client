"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPasswordMutation } from '@/store/api/authApi'
import { useAppDispatch } from '@/store/hooks'
import { showModal } from '@/store/slices/uiSlice'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPassword({ email }).unwrap()
      // Move to verification step, the backend response is generic to avoid email enumeration
      router.push(`/auth/verify-reset?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      const message = error?.data?.message || error?.data?.error || 'Failed to initiate password reset'
      dispatch(showModal({ type: 'error', title: 'Request failed', message }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-lg border shadow-lg p-8">
          <div className="text-center mb-8 mt-10">
            <h1 className="text-2xl font-bold font-playfair">Forgot password</h1>
            <p className="text-muted-foreground">Enter your email and we will send you a 6-digit code</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending code...' : 'Send 6-digit code'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}