import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  // Extended optional fields to align with profile page usage and server responses
  _id?: string
  phone?: string
  avatar?: string
  bio?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  preferences?: {
    notifications?: boolean
    newsletter?: boolean
    twoFactorAuth?: boolean
  }
  stats?: {
    totalOrders?: number
    wishlistItems?: number
    reviewsCount?: number
    totalSpent?: number
  }
  createdAt?: string
  isActive?: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastActivity: number
  tokenExpiry: number | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: Date.now(),
  tokenExpiry: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; expiresIn?: number }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      state.lastActivity = Date.now()
      
      // Calculate token expiry (default 30 days if not provided)
      const expiresIn = action.payload.expiresIn || 30 * 24 * 60 * 60 * 1000 // 30 days in ms
      state.tokenExpiry = Date.now() + expiresIn
      
      // Store in localStorage
      localStorage.setItem('auth-token', action.payload.token)
      localStorage.setItem('auth-user', JSON.stringify(action.payload.user))
      localStorage.setItem('token-expiry', state.tokenExpiry.toString())
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      state.tokenExpiry = null
      
      // Clear localStorage
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      localStorage.removeItem('token-expiry')
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now()
    },
    refreshToken: (state, action: PayloadAction<{ token: string; expiresIn?: number }>) => {
      state.token = action.payload.token
      state.lastActivity = Date.now()
      
      const expiresIn = action.payload.expiresIn || 30 * 24 * 60 * 60 * 1000
      state.tokenExpiry = Date.now() + expiresIn
      
      localStorage.setItem('auth-token', action.payload.token)
      localStorage.setItem('token-expiry', state.tokenExpiry.toString())
    },
    restoreAuth: (state) => {
      const token = localStorage.getItem('auth-token')
      const userStr = localStorage.getItem('auth-user')
      const tokenExpiry = localStorage.getItem('token-expiry')
      
      if (token && userStr && tokenExpiry) {
        const expiry = parseInt(tokenExpiry)
        
        // Check if token is still valid
        if (Date.now() < expiry) {
          state.token = token
          state.user = JSON.parse(userStr)
          state.isAuthenticated = true
          state.tokenExpiry = expiry
        } else {
          // Token expired, clear everything
          localStorage.removeItem('auth-token')
          localStorage.removeItem('auth-user')
          localStorage.removeItem('token-expiry')
        }
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('auth-user', JSON.stringify(state.user))
      }
    },
  },
})

export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  updateLastActivity,
  refreshToken,
  restoreAuth,
  updateUser,
} = authSlice.actions

export default authSlice.reducer