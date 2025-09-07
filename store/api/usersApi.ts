import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import { TopUsersResponse, User, UsersResponse, UserStatsResponse } from '../../app/types'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/admin',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// Wrap baseQuery to handle backend response messages via global modal
const baseQueryWithModal: typeof baseQuery = async (args: any, api: any, extra: any) => {
  const result: any = await baseQuery(args, api, extra)
  // If backend returns success:false or error structure, surface it via modal
  if (result?.error) {
    const err = result.error as any
    const message = err?.data?.message || err?.data?.error || 'Request failed'
    const errors = err?.data?.errors
    const { showModal } = await import('../slices/uiSlice')
    api.dispatch(showModal({ type: 'error', title: 'Request Error', message, errors }))
  } else if (result?.data && result.data.success === true && (args as any)?.method && (args as any)?.method !== 'GET') {
    // For non-GET successful mutations, show success modal with optional message
    const { showModal } = await import('../slices/uiSlice')
    const message = (result.data as any).message || 'Operation completed successfully'
    api.dispatch(showModal({ type: 'success', title: 'Success', message }))
  }
  return result
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithModal,
  tagTypes: ['Users', 'UserStats'],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, { 
      page?: number
      limit?: number
      search?: string
      role?: string
      status?: string
    }>({
      query: ({ page = 1, limit = 10, search, role, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        
        if (search) params.append('search', search)
        if (role && role !== 'all') params.append('role', role)
        if (status && status !== 'all') params.append('status', status)
        
        return `/users?${params.toString()}`
      },
      providesTags: ['Users'],
    }),
    
    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => '/users/stats',
      providesTags: ['UserStats'],
    }),
    
    getTopUsers: builder.query<TopUsersResponse, { limit?: number }>({
      query: ({ limit = 5 }) => `/users/top?limit=${limit}`,
      providesTags: ['Users'],
    }),
    
    getUserById: builder.query<{ success: boolean; data: User }, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    
    updateUserStatus: builder.mutation<
      { success: boolean; data: User },
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users', 'UserStats'],
    }),
    
    updateUserRole: builder.mutation<
      { success: boolean; data: User },
      { id: string; role: 'customer' | 'admin' }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users', 'UserStats'],
    }),
    
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'UserStats'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useGetTopUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = usersApi