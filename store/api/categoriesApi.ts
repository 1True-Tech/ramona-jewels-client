import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

interface Category {
  _id: string
  name: string
  description?: string
  isActive: boolean
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
}

interface UpdateCategoryRequest {
  name?: string
  description?: string
  isActive?: boolean
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/categories',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery,
  tagTypes: ['Categories', 'Category'],
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => '',
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