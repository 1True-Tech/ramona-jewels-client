"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { KeyRound } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVerifyResetCodeMutation } from '@/store/api/authApi'
import { useAppDispatch } from '@/store/hooks'
import { showModal } from '@/store/slices/uiSlice'

export default function VerifyResetPage() {
  const params = useSearchParams()
  const emailFromQuery = params.get('email') || ''
  const [email, setEmail] = useState(emailFromQuery)
  const [code, setCode] = useState('')
  const [verifyResetCode, { isLoading }] = useVerifyResetCodeMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery)
  }, [emailFromQuery])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await verifyResetCode({ email, code }).unwrap()
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`)
    } catch (error: any) {
      const message = error?.data?.message || error?.data?.error || 'Invalid or expired code'
      dispatch(showModal({ type: 'error', title: 'Verification failed', message }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-lg border shadow-lg p-8">
          <div className="text-center mb-8 mt-10">
            <h1 className="text-2xl font-bold font-playfair">Verify code</h1>
            <p className="text-muted-foreground">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">6-digit code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="code" type="text" inputMode="numeric" pattern="^[0-9]{6}$" placeholder="Enter code" className="pl-10" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify code'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Didn't receive the code?{' '}
            <Link href={process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/forgot-password?email=${encodeURIComponent(email)}` : `/auth/forgot-password?email=${encodeURIComponent(email)}`} className="text-primary hover:underline">
              Resend code
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}