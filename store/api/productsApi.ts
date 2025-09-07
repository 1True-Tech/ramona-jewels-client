import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import { CreateProductRequest, Product, ProductQueryParams, ProductResponse, ProductsResponse, UpdateProductRequest } from '../apiTypes'

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

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithModal,
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    // Get all products with filtering and pagination
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        
        return `?${searchParams.toString()}`
      },
      providesTags: ['Products'],
      transformResponse: (response: any) => {
        // Map server Perfume fields to client Product shape
        const mapItem = (item: any): Product => {
          const imagesArr = Array.isArray(item.images) && item.images.length
            ? item.images
            : (item.image ? [item.image] : [])
          return {
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            originalPrice: item.originalPrice,
            brand: item.brand,
            images: imagesArr,
            stock: item.stockCount ?? item.stock ?? 0,
            isActive: item.inStock ?? true,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: item.type,
          }
        }

        if (Array.isArray(response?.data)) {
          return {
            ...response,
            data: response.data.map(mapItem),
          } as ProductsResponse
        }
        return response as ProductsResponse
      },
    }),
    
    // Get single product
    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      transformResponse: (response: any) => {
        const item = response?.data
        if (!item) return response as ProductResponse
        const imagesArr = Array.isArray(item.images) && item.images.length
          ? item.images
          : (item.image ? [item.image] : [])
        const mapped: Product = {
          _id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          originalPrice: item.originalPrice,
          brand: item.brand,
          images: imagesArr,
          stock: item.stockCount ?? item.stock ?? 0,
          isActive: item.inStock ?? true,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          type: item.type,
        }
        return { success: true, data: mapped } as ProductResponse
      },
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

    // Upload product images (Admin only)
    uploadProductImages: builder.mutation<{ success: boolean; data: { urls: string[] } }, FormData>({
      query: (formData) => ({
        url: '/upload-images',
        method: 'POST',
        body: formData,
      }),
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
        url: `/${id}`,
        method: 'PUT',
        body: { stockCount: stock },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Products',
      ],
    }),
    
    // Toggle product status (Admin only) -> maps to "inStock"
    toggleProductStatus: builder.mutation<ProductResponse, { id: string; inStock: boolean }>({
      query: ({ id, inStock }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: { inStock },
      }),
      invalidatesTags: (result, error, { id }) => [
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
  useUploadProductImagesMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStockMutation,
  useToggleProductStatusMutation,
} = productsApi