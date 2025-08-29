import axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const userApi = axios.create({
  baseURL: `${baseUrl}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
    twoFactor?: boolean
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
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await userApi.post('/avatar', formData, {
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