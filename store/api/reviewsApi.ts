import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

export interface Review {
  _id: string
  productId: string
  userId?: string
  name: string
  rating: number
  comment: string
  createdAt: string
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

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: baseQueryWithModal,
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getReviewsByProduct: builder.query<Review[], string>({
      query: (productId) => `/${productId}/reviews`,
      providesTags: (result, error, arg) => [{ type: 'Reviews', id: arg }],
      transformResponse: (res: { success: boolean; data: Review[] }) => res.data,
    }),
    createReview: builder.mutation<Review, { productId: string; rating: number; comment: string; name?: string }>({
      query: ({ productId, ...body }) => ({
        url: `/${productId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (res, err, arg) => [{ type: 'Reviews', id: arg.productId }],
      transformResponse: (res: { success: boolean; data: Review }) => res.data,
    }),
  }),
})

export const { useGetReviewsByProductQuery, useCreateReviewMutation } = reviewsApi