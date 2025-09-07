import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

export interface ProductTypeDTO {
  _id: string
  name: string
  description?: string
  icon?: string
  isActive?: boolean
  createdAt: string
}

export interface ProductTypesResponse {
  success: boolean
  count: number
  data: ProductTypeDTO[]
}

export interface ProductTypeResponse {
  success: boolean
  data: ProductTypeDTO
}

export interface CreateProductTypeRequest {
  name: string
  description?: string
  icon?: string
  isActive?: boolean
}

export interface UpdateProductTypeRequest {
  name?: string
  description?: string
  icon?: string
  isActive?: boolean
}

const baseQuery = fetchBaseQuery({
  baseUrl: (process.env.NEXT_PUBLIC_API_URL as string) + '/product-types',
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

export const productTypesApi = createApi({
  reducerPath: 'productTypesApi',
  baseQuery: baseQueryWithModal as any,
  tagTypes: ['ProductTypes', 'ProductType'],
  endpoints: (builder) => ({
    getProductTypes: builder.query<ProductTypesResponse, void>({
      query: () => '',
      providesTags: ['ProductTypes'],
    }),
    getProductType: builder.query<ProductTypeResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (r, e, id) => [{ type: 'ProductType', id }],
    }),
    createProductType: builder.mutation<ProductTypeResponse, CreateProductTypeRequest>({
      query: (body) => ({ url: '', method: 'POST', body }),
      invalidatesTags: ['ProductTypes'],
    }),
    updateProductType: builder.mutation<ProductTypeResponse, { id: string; data: UpdateProductTypeRequest }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (r, e, { id }) => [{ type: 'ProductType', id }, 'ProductTypes'],
    }),
    deleteProductType: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ProductTypes'],
    }),
  }),
})

export const {
  useGetProductTypesQuery,
  useGetProductTypeQuery,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} = productTypesApi