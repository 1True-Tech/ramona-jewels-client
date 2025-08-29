"use client"

import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { restoreAuth, updateLastActivity } from '@/store/slices/authSlice'
import { store } from '@/store'

interface ReduxProviderProps {
  children: React.ReactNode
}

function AuthRestorer() {
  useEffect(() => {
    // Restore authentication state from localStorage on app start
    store.dispatch(restoreAuth())
    
    // Set up activity tracking
    const handleActivity = () => {
      store.dispatch(updateLastActivity())
    }
    
    // Track user activity for session management
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })
    
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
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
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