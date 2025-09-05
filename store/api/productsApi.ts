import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  images: string[]
  stock: number
  isActive: boolean
  specifications?: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
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

interface ProductResponse {
  success: boolean
  data: Product
}

interface CreateProductRequest {
  name: string
  description: string
  price: number
  category: string
  brand: string
  images?: string[]
  stock: number
  specifications?: Record<string, any>
}

interface UpdateProductRequest {
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

interface ProductQueryParams {
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

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/perfumes',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery,
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    // Get all products with filtering and pagination
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        
        return `?${searchParams.toString()}`
      },
      providesTags: ['Products'],
    }),
    
    // Get single product
    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    
    // Create product (Admin only)
    createProduct: builder.mutation<ProductResponse, CreateProductRequest>({
      query: (productData) => ({
        url: '',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Products'],
    }),
    
    // Update product (Admin only)
    updateProduct: builder.mutation<ProductResponse, { id: string; data: UpdateProductRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Products',
      ],
    }),
    
    // Delete product (Admin only)
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    
    // Update product stock (Admin only)
    updateProductStock: builder.mutation<ProductResponse, { id: string; stock: number }>({
      query: ({ id, stock }) => ({
        url: `/${id}/stock`,
        method: 'PATCH',
        body: { stock },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Products',
      ],
    }),
    
    // Toggle product status (Admin only)
    toggleProductStatus: builder.mutation<ProductResponse, string>({
      query: (id) => ({
        url: `/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        'Products',
      ],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStockMutation,
  useToggleProductStatusMutation,
} = productsApi