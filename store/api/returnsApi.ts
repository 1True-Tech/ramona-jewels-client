import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/returns`,
  prepareHeaders: (headers, { getState }) => {
    try {
      const state: any = (getState() as any)
      const token = state.auth?.token || state.auth?.user?.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
    } catch {}
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithModal: typeof baseQuery = async (args: any, api: any, extra: any) => {
  const result: any = await baseQuery(args, api, extra)
  try {
    const { showModal } = await import('../slices/uiSlice')
    if (result?.error) {
      const err = result.error as any
      const message = err?.data?.message || err?.data?.error || 'Request failed'
      const errors = err?.data?.errors
      api.dispatch(showModal({ type: 'error', title: 'Returns', message, errors }))
    } else if (result?.data && result.data.success === true && (args as any)?.method && (args as any)?.method !== 'GET') {
      const message = (result.data as any).message || 'Operation completed successfully'
      api.dispatch(showModal({ type: 'success', title: 'Returns', message }))
    }
  } catch {}
  return result
}

export interface ReturnItem { orderItemId: string; productId?: string; name?: string; price?: number; quantity: number; reason?: string }
export interface ReturnRequest { _id: string; rmaNumber: string; orderId: string; userId: string; items: ReturnItem[]; status: 'requested'|'approved'|'in_transit'|'received'|'refunded'|'rejected'; reason?: string; comments?: string; refundAmount?: number; carrier?: string; trackingNumber?: string; createdAt: string; updatedAt: string }

export const returnsApi = createApi({
  reducerPath: 'returnsApi',
  baseQuery: baseQueryWithModal as any,
  tagTypes: ['Return'],
  endpoints: (builder) => ({
    createReturn: builder.mutation<{ success: boolean; data: ReturnRequest; message?: string }, { orderId: string; items?: ReturnItem[]; reason?: string; comments?: string }>({
      query: (body) => ({ url: '/', method: 'POST', body }),
    }),
    getMyReturns: builder.query<{ success: boolean; data: ReturnRequest[] }, void>({
      query: () => '/my',
      providesTags: ['Return'],
    }),
    getReturnById: builder.query<{ success: boolean; data: ReturnRequest }, string>({
      query: (id) => `/${id}`,
      providesTags: (r, e, id) => [{ type: 'Return', id }],
    }),
    updateReturnStatus: builder.mutation<{ success: boolean; data: ReturnRequest; message?: string }, { id: string; status?: string; refundAmount?: number; carrier?: string; trackingNumber?: string }>({
      query: ({ id, ...body }) => ({ url: `/${id}/status`, method: 'PATCH', body }),
      invalidatesTags: (r, e, { id }) => [{ type: 'Return', id }, 'Return'],
    }),
  })
})

export const { useCreateReturnMutation, useGetMyReturnsQuery, useGetReturnByIdQuery, useUpdateReturnStatusMutation } = returnsApi