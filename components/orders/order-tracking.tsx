"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderTrackingProps {
  status: string
  trackingNumber?: string
  estimatedDelivery?: string | Date | null
  updatedAt?: string | Date | null
  className?: string
}

export function OrderTracking({ status, trackingNumber, estimatedDelivery, updatedAt, className = '' }: OrderTrackingProps) {
  const normalized = (status || '').toLowerCase()

  const getStatusColor = (s: string) => {
    switch ((s || '').toLowerCase()) {
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'shipped': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'in_transit': return 'text-indigo-600 bg-indigo-50 border-indigo-200'
      case 'out_for_delivery': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (s: string) => {
    const iconClass = 'h-4 w-4'
    switch ((s || '').toLowerCase()) {
      case 'confirmed': return <CheckCircle className={iconClass} />
      case 'processing': return <Clock className={iconClass} />
      case 'shipped':
      case 'in_transit': return <Truck className={iconClass} />
      case 'out_for_delivery': return <MapPin className={iconClass} />
      case 'delivered': return <Package className={iconClass} />
      default: return <Clock className={iconClass} />
    }
  }

  const asDate = (d?: string | Date | null) => {
    if (!d) return null
    const date = typeof d === 'string' ? new Date(d) : d
    return isNaN(date.getTime()) ? null : date
  }

  const lastUpdated = asDate(updatedAt)
  const eta = asDate(estimatedDelivery)

  const getProgressPercentage = () => {
    const order = ['confirmed', 'processing', 'shipped', 'delivered']
    const idx = order.indexOf(normalized)
    return idx >= 0 ? ((idx + 1) / order.length) * 100 : 0
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Tracking
        </CardTitle>
        <CardDescription>
          Current status and delivery estimate from our system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(normalized)} border`}>{(status || '').replace('_', ' ').toUpperCase()}</Badge>
            {getStatusIcon(normalized)}
          </div>
          {trackingNumber && (
            <div className="text-right">
              <p className="text-sm font-medium">Tracking Number</p>
              <p className="text-sm text-muted-foreground font-mono">{trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">Last updated: {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(lastUpdated)}</p>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Estimated Delivery */}
        {eta && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Estimated Delivery</p>
              <p className="text-sm text-blue-700">{eta.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        )}

        {/* No timeline since backend does not provide tracking events */}
      </CardContent>
    </Card>
  )
}