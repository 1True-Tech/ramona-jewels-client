"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/store/api/authApi'
import { useAppDispatch } from '@/store/hooks'
import { showModal } from '@/store/slices/uiSlice'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const emailFromQuery = params.get('email') || ''
  const codeFromQuery = params.get('code') || ''
  const [email, setEmail] = useState(emailFromQuery)
  const [code, setCode] = useState(codeFromQuery)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery)
    if (codeFromQuery) setCode(codeFromQuery)
  }, [emailFromQuery, codeFromQuery])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      dispatch(showModal({ type: 'error', title: 'Passwords do not match', message: 'Please ensure both passwords are the same.' }))
      return
    }
    try {
      await resetPassword({ email, code, newPassword: password }).unwrap()
      dispatch(showModal({ type: 'success', title: 'Password updated', message: 'You can now log in with your new password.' }))
      router.push('/auth/login')
    } catch (error: any) {
      const message = error?.data?.message || error?.data?.error || 'Failed to reset password'
      dispatch(showModal({ type: 'error', title: 'Reset failed', message }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-lg border shadow-lg p-8">
          <div className="text-center mb-8 mt-10">
            <h1 className="text-2xl font-bold font-playfair">Reset password</h1>
            <p className="text-muted-foreground">Enter a new password for your account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">6-digit code</Label>
                <Input id="code" type="text" inputMode="numeric" pattern="^[0-9]{6}$" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Back to{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}