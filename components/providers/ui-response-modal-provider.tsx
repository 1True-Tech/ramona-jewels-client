"use client"

import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { hideModal } from '@/store/slices/uiSlice'
import { ResponseModal } from '@/components/ui/response-modal'

export default function UIResponseModalProvider() {
  const dispatch = useAppDispatch()
  const modal = useAppSelector((s) => s.ui.responseModal)

  return (
    <ResponseModal
      isOpen={modal.isOpen}
      onClose={() => dispatch(hideModal())}
      type={modal.type}
      title={modal.title}
      message={modal.message}
      errors={modal.errors}
      autoClose={modal.autoClose}
      autoCloseDelay={modal.autoCloseDelay}
    />
  )
}