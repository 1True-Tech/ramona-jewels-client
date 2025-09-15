import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import { loginSuccess, logout, refreshToken } from '../slices/authSlice'
import type { User } from '../slices/authSlice'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  success: boolean
  token: string
  data: User
}

interface RefreshTokenResponse {
  success: boolean
  token: string
  expiresIn?: number
}

interface GoogleLoginRequest {
  idToken: string
  mode?: 'signup' | 'login'
  clientId?: string
}

interface FacebookLoginRequest {
  accessToken: string
}

// New types for password reset flow
interface ForgotPasswordRequest { email: string }
interface VerifyResetCodeRequest { email: string; code: string }
interface ResetPasswordRequest { email: string; code: string; newPassword: string }
interface BasicResponse { success: boolean; message?: string }

// Helper to robustly resolve API base URL
const resolveApiBase = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || '').trim()
  if (!raw) return 'http://localhost:5000/api/v1'
  const noTrailing = raw.replace(/\/+$/, '')
  // If env already ends with /api or /api/v{n}, keep as is; otherwise append /api/v1
  const hasApiSuffix = /\/api(\/v\d+)?$/i.test(noTrailing)
  return hasApiSuffix ? noTrailing : `${noTrailing}/api/v1`
}

const baseQuery = fetchBaseQuery({

  baseUrl: resolveApiBase() + '/auth',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Enhanced base query with automatic token refresh and modal integration
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      {
        url: '/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    )
    
    if (refreshResult.data) {
      const refreshData = refreshResult.data as RefreshTokenResponse
      if (refreshData.success && refreshData.token) {
        // Store the new token
        api.dispatch(refreshToken({ token: refreshData.token }))
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions)
      } else {
        // Refresh failed, logout user
        api.dispatch(logout())
      }
    } else {
      // Refresh failed, logout user
      api.dispatch(logout())
    }
  }
  
  // Handle backend response messages via global modal (except for auth endpoints)
  const isAuthEndpoint = typeof args === 'string' ? 
    ['/login', '/register', '/logout', '/me', '/refresh'].some(endpoint => args.includes(endpoint)) :
    ['/login', '/register', '/logout', '/me', '/refresh'].some(endpoint => args?.url?.includes(endpoint))
  
  if (!isAuthEndpoint) {
    if (result?.error) {
      const err = result.error as any
      const message = err?.data?.message || err?.data?.error || 'Request failed'
      const errors = err?.data?.errors
      const { showModal } = await import('../slices/uiSlice')
      api.dispatch(showModal({ type: 'error', title: 'Request Error', message, errors }))
    } else if (result?.data && (result.data as any).success === true && (args as any)?.method && (args as any)?.method !== 'GET') {
      // For non-GET successful mutations, show success modal with optional message
      const { showModal } = await import('../slices/uiSlice')
      const message = ((result.data as any).message) || 'Operation completed successfully'
      api.dispatch(showModal({ type: 'success', title: 'Success', message }))
    }
  }
  
  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(loginSuccess({ 
            user: data.data, 
            token: data.token 
          }))
        } catch (error) {
          // Error handling is done by RTK Query
        }
      },
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(loginSuccess({ 
            user: data.data, 
            token: data.token 
          }))
        } catch (error) {
          // Error handling is done by RTK Query
        }
      },
    }),
    
    // Social: Google Sign-In
    googleSignIn: builder.mutation<AuthResponse, GoogleLoginRequest>({
      query: (payload) => ({
        url: '/google',
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(loginSuccess({ user: data.data, token: data.token }))
        } catch (error) {
          // handled by baseQueryWithReauth
        }
      },
    }),

    // Social: Facebook Sign-In
    facebookSignIn: builder.mutation<AuthResponse, FacebookLoginRequest>({
      query: (payload) => ({
        url: '/facebook',
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(loginSuccess({ user: data.data, token: data.token }))
        } catch (error) {
          // handled by baseQueryWithReauth
        }
      },
    }),
    
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logout())
        } catch (error) {
          // Even if logout fails on server, clear local state
          dispatch(logout())
        }
      },
    }),
    
    getMe: builder.query<{ success: boolean; data: User }, void>({
      query: () => '/me',
      providesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data?.success && data?.data) {
            // Optionally sync user on getMe
          }
        } catch (error) {
          // ignore
        }
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),

    updateProfile: builder.mutation<{ success: boolean; data: User }, Partial<User>>({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Forgot password flow
    forgotPassword: builder.mutation<BasicResponse, ForgotPasswordRequest>({
      query: (payload) => ({
        url: '/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),

    verifyResetCode: builder.mutation<BasicResponse, VerifyResetCodeRequest>({
      query: (payload) => ({
        url: '/verify-reset-code',
        method: 'POST',
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<BasicResponse, ResetPasswordRequest>({
      query: (payload) => ({
        url: '/reset-password',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useGoogleSignInMutation,
  useFacebookSignInMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi