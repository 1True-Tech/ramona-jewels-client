"use client"
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useProductReviewsRealtime(productId: string, onNewReview: (payload: any) => void) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!productId) return
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
    if (!base) return
    const socket = io(base, { transports: ['websocket'], autoConnect: true })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_product', productId)
    })

    socket.on('review:new', (payload) => {
      onNewReview?.(payload)
    })

    return () => {
      socket.emit('leave_product', productId)
      socket.disconnect()
      socketRef.current = null
    }
  }, [productId, onNewReview])
}