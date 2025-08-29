import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  status: 'active' | 'inactive'
  joinDate: string
  orders: number
  totalSpent: number
  avatar: string
  lastActivity?: string
}

export interface UsersResponse {
  success: boolean
  data: User[]
  total: number
}

export interface UserStatsResponse {
  success: boolean
  data: {
    total: number
    active: number
    inactive: number
    customers: number
    admins: number
  }
}

export interface TopUsersResponse {
  success: boolean
  data: User[]
}

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

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery,
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