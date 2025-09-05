import axios from 'axios'
import { store } from '@/store'

const baseUrl = process.env.NEXT_PUBLIC_API_URL

const userApi = axios.create({
  baseURL: `${baseUrl}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
userApi.interceptors.request.use((config) => {
  // Get token from Redux store instead of localStorage directly
  const state = store.getState()
  const token = state.auth.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle errors
userApi.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle server errors and format them properly
    if (error.response?.data) {
      const serverError = error.response.data
      
      // If server returns validation errors array, format them
      if (serverError.errors && Array.isArray(serverError.errors)) {
        const formattedErrors: Record<string, string[]> = {}
        
        serverError.errors.forEach((err: any) => {
          const field = err.field || 'general'
          if (!formattedErrors[field]) {
            formattedErrors[field] = []
          }
          formattedErrors[field].push(err.message)
        })
        
        // Create a structured error response
        const errorResponse = {
          success: false,
          message: serverError.message || 'Validation failed',
          errors: formattedErrors
        }
        
        // Reject with the formatted error
        return Promise.reject({
          ...error,
          response: {
            ...error.response,
            data: errorResponse
          }
        })
      }
      
      // For other server errors, ensure consistent format
      const errorResponse = {
        success: false,
        message: serverError.message || serverError.error || 'An error occurred',
        errors: serverError.errors || null
      }
      
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: errorResponse
        }
      })
    }
    
    // For network errors or other issues
    return Promise.reject({
      ...error,
      response: {
        data: {
          success: false,
          message: error.message || 'Network error occurred',
          errors: null
        }
      }
    })
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

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    const response = await userApi.put('/change-password', data)
    return response.data
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse> => {
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
    return response.data
  },

  // Get user statistics
  getStats: async (): Promise<ApiResponse> => {
    const response = await userApi.get('/stats')
    return response.data
  },
}

export default userApiService