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
  avatar: string
  status: 'active' | 'inactive'
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

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithModal,
  tagTypes: ['AdminUsers', 'AdminUser', 'UserStats', 'TopUsers'],
  endpoints: (builder) => ({
    // Get all users with pagination and filtering
    getAdminUsers: builder.query<AdminUsersResponse, UserQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params ?? {}).forEach(([key, value]) => {
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
        body: { status: isActive ? 'active' : 'inactive' },
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