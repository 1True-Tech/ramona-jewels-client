export interface Product {
    _id: string
    name: string
    description: string
    price: number
    category: string
    originalPrice: number
    brand: string
    images: string[]
    stock: number
    isActive: boolean
    specifications?: Record<string, any>
    createdAt: string
    updatedAt: string
    // add optional type to support UI filters between jewelry/perfume
    type?: string
  }
  
  export interface ProductsResponse {
    success: boolean
    count: number
    pagination?: {
      page: number
      limit: number
      total: number
      pages: number
    }
    data: Product[]
  }
  
  export interface ProductResponse {
    success: boolean
    data: Product
  }
  
  export interface CreateProductRequest {
    name: string
    description: string
    price: number
    category: string
    brand: string
    images?: string[]
    // support both client "stock" and server "stockCount" for flexibility
    stock?: number
    stockCount?: number
    specifications?: Record<string, any>
    // optional perfume-specific fields
    size?: string
    concentration?: string
    gender?: string
    image?: string
    originalPrice?: number
    inStock?: boolean
    topNotes?: string[]
    middleNotes?: string[]
    baseNotes?: string[]
  }
  
  export interface UpdateProductRequest {
    name?: string
    description?: string
    price?: number
    category?: string
    brand?: string
    images?: string[]
    stock?: number
    isActive?: boolean
    specifications?: Record<string, any>
  }
  
  export interface ProductQueryParams {
    page?: number
    limit?: number
    search?: string
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    isActive?: boolean
  }

export interface OrderItem {
    id: string
    productId: string
    name: string
    price: number
    quantity: number
    color?: string
    size?: string
    image: string
  }
  
  export interface ShippingAddress {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  
  export interface Order {
    id: string
    userId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    items: OrderItem[]
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
    paymentMethod: string
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
    shippingAddress: ShippingAddress
    billingAddress: ShippingAddress
    trackingNumber?: string
    notes?: string
    createdAt: string
    updatedAt: string
  }
  
  export interface OrdersResponse {
    success: boolean
    data: Order[]
    total: number
    page: number
    pages: number
  }
  
  export interface OrderStats {
    total: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    totalRevenue: number
    averageOrderValue: number
  }
  
  export interface OrderStatsResponse {
    success: boolean
    data: OrderStats
  }
  
  export interface OrderQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: string
    startDate?: string
    endDate?: string
  }
  
  export interface UpdateOrderStatusRequest {
    id: string
    status: string
    trackingNumber?: string
    notes?: string
  }