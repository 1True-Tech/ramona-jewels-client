import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface AdminUser {
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
  lastActivity: string
}

interface AdminUsersResponse {
  success: boolean
  data: AdminUser[]
  total: number
  page: number
  pages: number
}

interface UserStats {
  total: number
  active: number
  inactive: number
  customers: number
  admins: number
}

interface UserStatsResponse {
  success: boolean
  data: UserStats
}

interface TopUser {
  id: string
  name: string
  email: string
  totalSpent: number
  orders: number
}

interface TopUsersResponse {
  success: boolean
  data: TopUser[]
}

interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

interface UpdateUserStatusRequest {
  id: string
  isActive: boolean
}

interface UpdateUserRoleRequest {
  id: string
  role: string
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

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['AdminUsers', 'AdminUser', 'UserStats', 'TopUsers'],
  endpoints: (builder) => ({
    // Get all users with pagination and filtering
    getAdminUsers: builder.query<AdminUsersResponse, UserQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `users?${searchParams.toString()}`
      },
      providesTags: ['AdminUsers'],
    }),
    
    // Get user statistics
    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => 'users/stats',
      providesTags: ['UserStats'],
    }),
    
    // Get top users
    getTopUsers: builder.query<TopUsersResponse, void>({
      query: () => 'users/top',
      providesTags: ['TopUsers'],
    }),
    
    // Get single user
    getAdminUser: builder.query<{ success: boolean; data: AdminUser }, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminUser', id }],
    }),
    
    // Update user status
    updateUserStatus: builder.mutation<{ success: boolean }, UpdateUserStatusRequest>({
      query: ({ id, isActive }) => ({
        url: `users/${id}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUser', id },
        'AdminUsers',
        'UserStats',
      ],
    }),
    
    // Update user role
    updateUserRole: builder.mutation<{ success: boolean }, UpdateUserRoleRequest>({
      query: ({ id, role }) => ({
        url: `users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminUser', id },
        'AdminUsers',
        'UserStats',
      ],
    }),
    
    // Delete user
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers', 'UserStats'],
    }),
  }),
})

export const {
  useGetAdminUsersQuery,
  useGetUserStatsQuery,
  useGetTopUsersQuery,
  useGetAdminUserQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApi