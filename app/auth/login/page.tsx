'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation, useGoogleSignInMutation } from '@/store/api/authApi'
import { useAppDispatch } from '@/store/hooks'
import { showModal } from '@/store/slices/uiSlice'
import { Separator } from '@radix-ui/react-select'
import { GoogleLogin } from '@react-oauth/google'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const [googleSignIn] = useGoogleSignInMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login({ email, password }).unwrap()
      if (result.success) {
        // dispatch(showModal({ type: 'success', title: 'Welcome Back!', message: 'You have been successfully logged in.' }))
        router.push('/')
      }
    } catch (error: any) {
      const errData = error?.data
      const message = errData?.message || errData?.error || error?.error || 'Email or password is incorrect'
      dispatch(showModal({ type: 'error', title: 'Login failed', message }))
    }
  }

  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse?.credential
      if (!idToken) throw new Error('No Google id token')
      const res = await googleSignIn({ idToken, mode: 'login' }).unwrap()
      if (res.success) {
        dispatch(showModal({ type: 'success', title: 'Welcome!', message: 'Signed in with Google.' }))
        router.push('/')
      }
    } catch (e: any) {
      const errData = e?.data
      const message = errData?.message || errData?.error || 'Google sign-in failed. Please try again.'
      dispatch(showModal({ type: 'error', title: 'Google Sign-in failed', message }))
    }
  }

  const onGoogleError = () => {
    dispatch(showModal({ type: 'error', title: 'Google Sign-in failed', message: 'Please try again.' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-lg border shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8 mt-10">
            <h1 className="text-2xl font-bold font-playfair">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Enter your email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href={process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/forgot-password` : "/auth/forgot-password"} className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {googleClientId ? (
                <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} useOneTap auto_select={false} />
              ) : (
                <Button variant="outline" disabled>
                  Google (Unavailable)
                </Button>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
