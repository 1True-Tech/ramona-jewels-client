"use client"

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery } from '@/store/api/authApi'
import { setError, updateLastActivity, updateUser as updateUserAction } from '@/store/slices/authSlice'
import { useRealTimeAuth } from '@/hooks/use-real-time-auth'
import type { User } from '@/store/slices/authSlice'
import { store } from '@/store'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  refetch: () => void
  updateUser: (user: Partial<User>) => void
  hydrated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ReduxAuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading, error, token, hydrated } = useAppSelector((state) => state.auth)
  
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation()
  const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation()
  const [logoutMutation] = useLogoutMutation()
  
  // Auto-fetch user data if token exists but no user data
  const { refetch, data: meData } = useGetMeQuery(undefined, {
    skip: !token || !!user,
    refetchOnMountOrArgChange: true,
  })

  // Use real-time authentication hook
  const { isRefreshing } = useRealTimeAuth({
    autoRefresh: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes
  })

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginMutation({ email, password }).unwrap()
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed'
      dispatch(setError(errorMessage))
      throw new Error(errorMessage)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      await registerMutation({ name, email, password }).unwrap()
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Registration failed'
      dispatch(setError(errorMessage))
      throw new Error(errorMessage)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation().unwrap()
    } catch (error) {
      // Even if server logout fails, we still clear local state
      console.warn('Server logout failed, but clearing local state')
    }
  }

  const clearError = () => {
    dispatch(setError(null))
  }

  const updateUser = (partial: Partial<User>) => {
    dispatch(updateUserAction(partial))
  }

  // Optionally hydrate the auth user with richer /me data when available
  useEffect(() => {
    if (meData?.data) {
      dispatch(updateUserAction(meData.data))
    }
  }, [meData?.data, dispatch])

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || loginLoading || registerLoading || isRefreshing,
    error,
    login,
    register,
    logout,
    clearError,
    refetch,
    updateUser,
    hydrated,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useReduxAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useReduxAuth must be used within a ReduxAuthProvider')
  }
  return context
}

// Export for backward compatibility
export { useReduxAuth as useAuth }