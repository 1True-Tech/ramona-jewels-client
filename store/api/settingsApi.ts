import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

export interface SettingsDoc {
  payments?: {
    stripe?: { enabled?: boolean }
  }
  _id?: string
  updatedAt?: string
  createdAt?: string
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL + '/admin',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

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
    const message = (result.data as any).message || 'Settings updated'
    api.dispatch(showModal({ type: 'success', title: 'Success', message }))
  }
  return result
}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithModal,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<{ success: boolean; data: SettingsDoc }, void>({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<{ success: boolean; data: SettingsDoc }, Partial<SettingsDoc>>({
      query: (body) => ({ url: 'settings', method: 'PATCH', body }),
      invalidatesTags: ['Settings'],
    }),
  }),
})

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi