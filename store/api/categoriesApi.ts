import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface Category {
  _id: string
  name: string
  description?: string
  isActive: boolean
  productType: string
  createdAt: string
  updatedAt: string
}

interface CategoriesResponse {
  success: boolean
  count: number
  data: Category[]
}

interface CategoryResponse {
  success: boolean
  data: Category
}

interface CreateCategoryRequest {
  name: string
  description?: string
  productType: string
}

interface UpdateCategoryRequest {
  name?: string
  description?: string
  isActive?: boolean
  productType?: string
}

const baseQuery = fetchBaseQuery({
  baseUrl: (process.env.NEXT_PUBLIC_API_URL as string) + '/categories',
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
  if (result?.error) {
    const err = result.error as any
    const message = err?.data?.message || err?.data?.error || 'Request failed'
    const errors = err?.data?.errors
    const { showModal } = await import('../slices/uiSlice')
    api.dispatch(showModal({ type: 'error', title: 'Request Error', message, errors }))
  } else if (result?.data && result.data.success === true && (args as any)?.method && (args as any)?.method !== 'GET') {
    const { showModal } = await import('../slices/uiSlice')
    const message = (result.data as any).message || 'Operation completed successfully'
    api.dispatch(showModal({ type: 'success', title: 'Success', message }))
  }
  return result
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: baseQueryWithModal as any,
  tagTypes: ['Categories', 'Category'],
  endpoints: (builder) => ({
    // Get all categories or filter by productType
    getCategories: builder.query<CategoriesResponse, { productType?: string } | void>({
      query: (args) => {
        const params = new URLSearchParams()
        if (args && typeof args === 'object' && 'productType' in args && args.productType) {
          params.set('productType', args.productType)
        }
        const qs = params.toString()
        return qs ? `?${qs}` : ''
      },
      providesTags: ['Categories'],
    }),
    
    // Get single category
    getCategory: builder.query<CategoryResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    
    // Create category (Admin only)
    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (categoryData) => ({
        url: '',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Categories'],
    }),
    
    // Update category (Admin only)
    updateCategory: builder.mutation<CategoryResponse, { id: string; data: UpdateCategoryRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        'Categories',
      ],
    }),
    
    // Delete category (Admin only)
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi