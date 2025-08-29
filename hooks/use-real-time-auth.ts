"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useRefreshTokenMutation } from '@/store/api/authApi'
import { logout, updateLastActivity } from '@/store/slices/authSlice'
import { useToast } from '@/hooks/use-toast'

interface UseRealTimeAuthOptions {
  autoRefresh?: boolean
  sessionTimeout?: number // in milliseconds
  warningTime?: number // time before session expires to show warning
}

export function useRealTimeAuth(options: UseRealTimeAuthOptions = {}) {
  const {
    autoRefresh = true,
    sessionTimeout = 30 * 60 * 1000, // 30 minutes
    warningTime = 5 * 60 * 1000, // 5 minutes
  } = options

  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { isAuthenticated, token, tokenExpiry, lastActivity } = useAppSelector((state) => state.auth)
  const [refreshToken, { isLoading: isRefreshing }] = useRefreshTokenMutation()

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const warningShownRef = useRef(false)
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to refresh token
  const handleRefreshToken = useCallback(async () => {
    if (!isAuthenticated || !token) return

    try {
      await refreshToken().unwrap()
      warningShownRef.current = false
    } catch (error) {
      console.error('Token refresh failed:', error)
      dispatch(logout())
      toast({
        title: 'Session Expired',
        description: 'Please log in again to continue.',
        variant: 'destructive',
      })
    }
  }, [isAuthenticated, token, refreshToken, dispatch, toast])

  // Function to check if token needs refresh
  const checkTokenExpiry = useCallback(() => {
    if (!tokenExpiry || !isAuthenticated) return

    const now = Date.now()
    const timeUntilExpiry = tokenExpiry - now

    // If token is expired, logout
    if (timeUntilExpiry <= 0) {
      dispatch(logout())
      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
        variant: 'destructive',
      })
      return
    }

    // If token expires soon and auto-refresh is enabled, refresh it
    if (autoRefresh && timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
      handleRefreshToken()
    }

    // Show warning if token expires soon and warning hasn't been shown
    if (!warningShownRef.current && timeUntilExpiry <= warningTime && timeUntilExpiry > 60000) {
      warningShownRef.current = true
      toast({
        title: 'Session Expiring Soon',
        description: `Your session will expire in ${Math.ceil(timeUntilExpiry / 60000)} minutes.`,
        variant: 'default',
      })
    }
  }, [tokenExpiry, isAuthenticated, autoRefresh, warningTime, handleRefreshToken, dispatch, toast])

  // Function to check session timeout based on user activity
  const checkSessionTimeout = useCallback(() => {
    if (!isAuthenticated || !lastActivity) return

    const timeSinceLastActivity = Date.now() - lastActivity

    if (timeSinceLastActivity >= sessionTimeout) {
      dispatch(logout())
      toast({
        title: 'Session Timeout',
        description: 'You have been logged out due to inactivity.',
        variant: 'default',
      })
    }
  }, [isAuthenticated, lastActivity, sessionTimeout, dispatch, toast])

  // Function to handle user activity
  const handleUserActivity = useCallback(() => {
    if (isAuthenticated) {
      dispatch(updateLastActivity())
    }
  }, [isAuthenticated, dispatch])

  // Set up token expiry checking
  useEffect(() => {
    if (!isAuthenticated) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
      return
    }

    // Check immediately
    checkTokenExpiry()

    // Set up interval to check every minute
    refreshIntervalRef.current = setInterval(checkTokenExpiry, 60000)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }
  }, [isAuthenticated, checkTokenExpiry])

  // Set up session timeout checking
  useEffect(() => {
    if (!isAuthenticated) {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current)
        sessionTimeoutRef.current = null
      }
      return
    }

    // Check session timeout every 30 seconds
    const checkTimeout = () => {
      checkSessionTimeout()
      if (isAuthenticated) {
        sessionTimeoutRef.current = setTimeout(checkTimeout, 30000)
      }
    }

    sessionTimeoutRef.current = setTimeout(checkTimeout, 30000)

    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current)
        sessionTimeoutRef.current = null
      }
    }
  }, [isAuthenticated, checkSessionTimeout])

  // Set up activity tracking
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [isAuthenticated, handleUserActivity])

  return {
    isRefreshing,
    refreshToken: handleRefreshToken,
    checkTokenExpiry,
    checkSessionTimeout,
  }
}