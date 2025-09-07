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

const baseQuery = fetchBaseQuery({

  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/auth',
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
          // Update user data in store if needed
        } catch (error) {
          // If getMe fails, user might be unauthorized
          dispatch(logout())
        }
      },
    }),
    
    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(refreshToken({ 
            token: data.token, 
            expiresIn: data.expiresIn 
          }))
        } catch (error) {
          dispatch(logout())
        }
      },
    }),
    
    updateProfile: builder.mutation<{ success: boolean; data: User }, Partial<User>>({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
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
} = authApi