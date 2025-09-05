export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  status: 'active' | 'inactive'
  createdAt: string
  orders: number
  totalSpent: number
  avatar: string
  lastActivity?: string
  isActive: boolean
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

// Match the actual API
export interface UserProfile {
  _id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: "admin" | "user"
  bio: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences: {
    notifications: boolean
    newsletter: boolean
    twoFactorAuth: boolean 
  }
  stats: {
    totalOrders: number 
    wishlistItems: number
    reviewsCount: number 
    totalSpent: number 
  }
  createdAt: string 
  isActive: boolean 
}