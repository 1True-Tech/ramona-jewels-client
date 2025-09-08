"use client"

import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { restoreAuth } from '@/store/slices/authSlice'
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
      const state = store.getState().auth
      if (state.tokenExpiry && Date.now() > state.tokenExpiry) {
        store.dispatch({ type: 'auth/logout' })
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