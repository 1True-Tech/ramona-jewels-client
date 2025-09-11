"use client"

import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { restoreAuth, logout } from '@/store/slices/authSlice'
import type { RootState } from '@/store'
import { store } from '@/store'

interface ReduxProviderProps {
  children: React.ReactNode
}

function AuthRestorer() {
  useEffect(() => {
    // Restore authentication state from localStorage on app start
    store.dispatch(restoreAuth())
    
    // Set up token expiry check
    const checkTokenExpiry = () => {
      const state = store.getState() as RootState
      const tokenExpiry = state.auth.tokenExpiry
      if (tokenExpiry && Date.now() > tokenExpiry) {
        store.dispatch(logout())
      }
    }
    
    // Check token expiry every minute
    const tokenCheckInterval = setInterval(checkTokenExpiry, 60000)
    
    return () => {
      clearInterval(tokenCheckInterval)
    }
  }, [])
  
  return null
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthRestorer />
      {children}
    </Provider>
  )
}