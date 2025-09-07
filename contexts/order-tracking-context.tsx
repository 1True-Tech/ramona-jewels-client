"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useAuth } from '@/contexts/redux-auth-context'

export interface TrackingEvent {
  id: string
  timestamp: Date
  status: string
  location: string
  description: string
  isCompleted: boolean
}

export interface OrderTracking {
  orderId: string
  currentStatus: string
  trackingNumber?: string
  carrier?: string
  estimatedDelivery: Date
  events: TrackingEvent[]
  lastUpdated: Date
  isRealTimeEnabled: boolean
}

interface OrderTrackingState {
  trackings: { [orderId: string]: OrderTracking }
  isLoading: boolean
  error: string | null
}

type OrderTrackingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TRACKING'; payload: OrderTracking }
  | { type: 'ADD_TRACKING_EVENT'; payload: { orderId: string; event: TrackingEvent } }
  | { type: 'LOAD_TRACKINGS'; payload: { [orderId: string]: OrderTracking } }
  | { type: 'CLEAR_TRACKINGS' }

interface OrderTrackingContextType {
  state: OrderTrackingState
  getOrderTracking: (orderId: string) => OrderTracking | null
  updateOrderStatus: (orderId: string, status: string, location?: string, description?: string) => void
  addTrackingEvent: (orderId: string, event: Omit<TrackingEvent, 'id'>) => void
  initializeTracking: (orderId: string, initialData: Partial<OrderTracking>) => void
  enableRealTimeTracking: (orderId: string) => void
  disableRealTimeTracking: (orderId: string) => void
  simulateStatusUpdate: (orderId: string) => void
}

const OrderTrackingContext = createContext<OrderTrackingContextType | undefined>(undefined)

const initialState: OrderTrackingState = {
  trackings: {},
  isLoading: false,
  error: null
}

function orderTrackingReducer(state: OrderTrackingState, action: OrderTrackingAction): OrderTrackingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'UPDATE_TRACKING':
      return {
        ...state,
        trackings: {
          ...state.trackings,
          [action.payload.orderId]: action.payload
        }
      }
    case 'ADD_TRACKING_EVENT':
      const { orderId, event } = action.payload
      const existingTracking = state.trackings[orderId]
      if (!existingTracking) return state
      
      return {
        ...state,
        trackings: {
          ...state.trackings,
          [orderId]: {
            ...existingTracking,
            events: [...existingTracking.events, event],
            lastUpdated: new Date()
          }
        }
      }
    case 'LOAD_TRACKINGS':
      return { ...state, trackings: action.payload }
    case 'CLEAR_TRACKINGS':
      return { ...state, trackings: {} }
    default:
      return state
  }
}

export function OrderTrackingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderTrackingReducer, initialState)
  const { user } = useAuth()

  // Load tracking data from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedTrackings = localStorage.getItem(`order_trackings_${user.id}`)
      if (savedTrackings) {
        try {
          const trackings = JSON.parse(savedTrackings)
          // Convert date strings back to Date objects
          Object.keys(trackings).forEach(orderId => {
            trackings[orderId].estimatedDelivery = new Date(trackings[orderId].estimatedDelivery)
            trackings[orderId].lastUpdated = new Date(trackings[orderId].lastUpdated)
            trackings[orderId].events = trackings[orderId].events.map((event: any) => ({
              ...event,
              timestamp: new Date(event.timestamp)
            }))
          })
          dispatch({ type: 'LOAD_TRACKINGS', payload: trackings })
        } catch (error) {
          console.error('Failed to load tracking data:', error)
        }
      }
    } else {
      dispatch({ type: 'CLEAR_TRACKINGS' })
    }
  }, [user])

  // Save tracking data to localStorage whenever it changes
  useEffect(() => {
    if (user && Object.keys(state.trackings).length > 0) {
      localStorage.setItem(`order_trackings_${user.id}`, JSON.stringify(state.trackings))
    }
  }, [state.trackings, user])

  // Real-time tracking simulation (in production, this would be WebSocket or polling)
  useEffect(() => {
    const activeTrackings = Object.values(state.trackings).filter(tracking => 
      tracking.isRealTimeEnabled && !['delivered', 'cancelled'].includes(tracking.currentStatus.toLowerCase())
    )

    if (activeTrackings.length === 0) return

    const interval = setInterval(() => {
      activeTrackings.forEach(tracking => {
        // Simulate random status updates (30% chance every 30 seconds)
        if (Math.random() < 0.3) {
          simulateStatusUpdate(tracking.orderId)
        }
      })
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [state.trackings])

  const getOrderTracking = (orderId: string): OrderTracking | null => {
    return state.trackings[orderId] || null
  }

  const updateOrderStatus = (orderId: string, status: string, location = '', description = '') => {
    const tracking = state.trackings[orderId]
    if (!tracking) return

    const newEvent: TrackingEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status,
      location,
      description: description || getDefaultStatusDescription(status),
      isCompleted: true
    }

    const updatedTracking: OrderTracking = {
      ...tracking,
      currentStatus: status,
      events: [...tracking.events, newEvent],
      lastUpdated: new Date()
    }

    dispatch({ type: 'UPDATE_TRACKING', payload: updatedTracking })
  }

  const addTrackingEvent = (orderId: string, eventData: Omit<TrackingEvent, 'id'>) => {
    const event: TrackingEvent = {
      ...eventData,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    dispatch({ type: 'ADD_TRACKING_EVENT', payload: { orderId, event } })
  }

  const initializeTracking = (orderId: string, initialData: Partial<OrderTracking>) => {
    const defaultTracking: OrderTracking = {
      orderId,
      currentStatus: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      events: [
        {
          id: `event_${Date.now()}_init`,
          timestamp: new Date(),
          status: 'confirmed',
          location: 'Order Processing Center',
          description: 'Order confirmed and payment received',
          isCompleted: true
        }
      ],
      lastUpdated: new Date(),
      isRealTimeEnabled: true,
      ...initialData
    }

    dispatch({ type: 'UPDATE_TRACKING', payload: defaultTracking })
  }

  const enableRealTimeTracking = (orderId: string) => {
    const tracking = state.trackings[orderId]
    if (tracking) {
      dispatch({ 
        type: 'UPDATE_TRACKING', 
        payload: { ...tracking, isRealTimeEnabled: true } 
      })
    }
  }

  const disableRealTimeTracking = (orderId: string) => {
    const tracking = state.trackings[orderId]
    if (tracking) {
      dispatch({ 
        type: 'UPDATE_TRACKING', 
        payload: { ...tracking, isRealTimeEnabled: false } 
      })
    }
  }

  const simulateStatusUpdate = (orderId: string) => {
    const tracking = state.trackings[orderId]
    if (!tracking) return

    const statusProgression = [
      'confirmed',
      'processing', 
      'shipped',
      'in_transit',
      'out_for_delivery',
      'delivered'
    ]

    const currentIndex = statusProgression.indexOf(tracking.currentStatus.toLowerCase())
    if (currentIndex < statusProgression.length - 1) {
      const nextStatus = statusProgression[currentIndex + 1]
      updateOrderStatus(orderId, nextStatus, getRandomLocation(), getDefaultStatusDescription(nextStatus))
    }
  }

  const getDefaultStatusDescription = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'Order confirmed and payment received'
      case 'processing': return 'Order is being prepared for shipment'
      case 'shipped': return 'Order has been shipped'
      case 'in_transit': return 'Package is in transit to destination'
      case 'out_for_delivery': return 'Package is out for delivery'
      case 'delivered': return 'Package has been delivered'
      case 'cancelled': return 'Order has been cancelled'
      default: return 'Status updated'
    }
  }

  const getRandomLocation = (): string => {
    const locations = [
      'Distribution Center - New York',
      'Sorting Facility - Chicago',
      'Transit Hub - Los Angeles',
      'Local Delivery Center',
      'Regional Processing Center',
      'Final Mile Facility'
    ]
    return locations[Math.floor(Math.random() * locations.length)]
  }

  return (
    <OrderTrackingContext.Provider value={{
      state,
      getOrderTracking,
      updateOrderStatus,
      addTrackingEvent,
      initializeTracking,
      enableRealTimeTracking,
      disableRealTimeTracking,
      simulateStatusUpdate
    }}>
      {children}
    </OrderTrackingContext.Provider>
  )
}

export function useOrderTracking() {
  const context = useContext(OrderTrackingContext)
  if (context === undefined) {
    throw new Error('useOrderTracking must be used within an OrderTrackingProvider')
  }
  return context
}