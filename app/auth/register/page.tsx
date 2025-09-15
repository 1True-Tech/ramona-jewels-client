"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Store, Mail, Lock, User } from "lucide-react"
import { useAuth } from "@/contexts/redux-auth-context"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { GoogleLogin } from "@react-oauth/google"
import { useGoogleSignInMutation } from "@/store/api/authApi"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [googleSignIn] = useGoogleSignInMutation()
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  // Defer actual registration until Terms acceptance
  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const payload = { name: data.name, email: data.email, password: data.password }
      // Store pending registration in sessionStorage
      sessionStorage.setItem("pending_registration", JSON.stringify(payload))
      // Navigate to Terms page where user can accept/decline
      router.push("/terms")
    } catch (error: any) {
      const message = error?.message || 'Unable to proceed to Terms'
      dispatch(showModal({
        type: 'error',
        title: 'Registration blocked',
        message,
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // For Google sign-up, also gate behind Terms: store the idToken and proceed to /terms
  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse?.credential
      if (!idToken) throw new Error('No Google id token')
      // Save pending social signup to handle on Terms page
      const socialPayload = { provider: 'google' as const, idToken, clientId: googleClientId }
      sessionStorage.setItem('pending_social_signup', JSON.stringify(socialPayload))
      router.push('/terms')
    } catch (e: any) {
      const errData = e?.data
      const message = errData?.message || errData?.error || e?.message || 'Google sign-up failed. Please try again.'
      dispatch(showModal({ type: 'error', title: 'Google Sign-up failed', message }))
    }
  }

  const onGoogleError = () => {
    dispatch(showModal({ type: 'error', title: 'Google Sign-up failed', message: 'Please try again.' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-lg border shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-playfair">Ramona Jewels</span>
            </Link>
            <h1 className="text-2xl font-bold font-playfair">Create your account</h1>
            <p className="text-muted-foreground mt-2">Join us and discover luxury jewelry & fragrances</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  {...register("confirmPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full gradient-primary text-white border-0 hover:opacity-90" disabled={isLoading}>
              {isLoading ? "Proceeding to Terms..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
              {googleClientId ? (
                <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} useOneTap={false} auto_select={false} />
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 13.87a7.027 7.027 0 010-3.74V7.29H2.18a11.996 11.996 0 000 9.42l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.73c1.62 0 3.08.56 4.23 1.66l3.17-3.17C16.9 1.23 14.41.25 12 .25 7.7.25 3.99 2.72 2.18 6.29l3.66 2.84C6.71 6.66 9.14 4.73 12 4.73z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary underline">Terms</Link>,{' '}
            <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> and{' '}
            <Link href="/cookies" className="text-primary underline">Cookies Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}