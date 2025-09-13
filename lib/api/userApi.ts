import axios from 'axios'
import { store } from '@/store'

const baseUrl = process.env.NEXT_PUBLIC_API_URL

// Create axios instance for user-related API calls
const userApi = axios.create({
  baseURL: `${baseUrl}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token to requests
userApi.interceptors.request.use((config) => {
  const state = store.getState() as any
  const token = state?.auth?.token
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Handle errors consistently
userApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const err = error?.response?.data || {
      success: false,
      message: 'Request failed',
    }

    // Normalize validation errors if present
    if (error?.response?.status === 400 && error?.response?.data?.errors) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            success: false,
            message: error.response.data.message || 'Validation failed',
            errors: error.response.data.errors,
          },
        },
      })
    }

    return Promise.reject(error)
  }
)

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
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
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export const userApiService = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse> => {
    const response = await userApi.get('/profile')
    return response.data
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse> => {
    const response = await userApi.put('/profile', data)
    return response.data
  },

  // Change password (server expects POST)
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    const response = await userApi.post('/change-password', data)
    return response.data
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatar: string }>> => {
    // Validate file type (only images, no SVG or video)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }
    
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await userApi.post('/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Server returns { success, data: "/uploads/avatars/..", message }
    const raw = response.data as ApiResponse<string>
    const normalized: ApiResponse<{ avatar: string }> = {
      success: raw.success,
      message: raw.message,
      data: raw.data ? { avatar: raw.data } : undefined,
      errors: (raw as any).errors,
    }
    return normalized
  },

  // Get user statistics
  getStats: async (): Promise<ApiResponse> => {
    const response = await userApi.get('/stats')
    return response.data
  },
}

export default userApiService