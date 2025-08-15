"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Calendar,
  RefreshCw,
  Bell,
  BellOff,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useOrderTracking, TrackingEvent } from '@/contexts/order-tracking-context'
import { useToast } from '@/hooks/use-toast'

interface OrderTrackingProps {
  orderId: string
  className?: string
}

export function OrderTracking({ orderId, className = '' }: OrderTrackingProps) {
  const { getOrderTracking, enableRealTimeTracking, disableRealTimeTracking, simulateStatusUpdate } = useOrderTracking()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const tracking = getOrderTracking(orderId)

  useEffect(() => {
    // Initialize tracking if it doesn't exist
    if (!tracking) {
      // This would typically be called when an order is created
      console.log('No tracking data found for order:', orderId)
    }
  }, [orderId, tracking])

  if (!tracking) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Tracking
          </CardTitle>
          <CardDescription>
            No tracking information available for this order.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    simulateStatusUpdate(orderId)
    setIsRefreshing(false)
    toast({
      title: "Tracking Updated",
      description: "Latest tracking information has been retrieved."
    })
  }

  const toggleRealTimeTracking = () => {
    if (tracking.isRealTimeEnabled) {
      disableRealTimeTracking(orderId)
      toast({
        title: "Real-time Tracking Disabled",
        description: "You will no longer receive automatic updates."
      })
    } else {
      enableRealTimeTracking(orderId)
      toast({
        title: "Real-time Tracking Enabled",
        description: "You will receive automatic updates as your order progresses."
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    const iconClass = `h-4 w-4 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className={iconClass} />
      case 'processing':
        return <Clock className={iconClass} />
      case 'shipped':
      case 'in_transit':
        return <Truck className={iconClass} />
      case 'out_for_delivery':
        return <MapPin className={iconClass} />
      case 'delivered':
        return <Package className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getProgressPercentage = () => {
    const statusOrder = ['confirmed', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered']
    const currentIndex = statusOrder.indexOf(tracking.currentStatus.toLowerCase())
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Tracking
            </CardTitle>
            <CardDescription>
              Track your order in real-time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRealTimeTracking}
              className="flex items-center gap-2"
            >
              {tracking.isRealTimeEnabled ? (
                <><Bell className="h-4 w-4" /> Live</>
              ) : (
                <><BellOff className="h-4 w-4" /> Manual</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div>
            <Badge className={`${getStatusColor(tracking.currentStatus)} border`}>
              {tracking.currentStatus.replace('_', ' ').toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {formatDate(tracking.lastUpdated)}
            </p>
          </div>
          {tracking.trackingNumber && (
            <div className="text-right">
              <p className="text-sm font-medium">Tracking Number</p>
              <p className="text-sm text-muted-foreground font-mono">
                {tracking.trackingNumber}
              </p>
            </div>
          )}
        </div>

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
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Calendar className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Estimated Delivery
            </p>
            <p className="text-sm text-blue-700">
              {tracking.estimatedDelivery.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <Separator />

        {/* Tracking Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Tracking History
          </h4>
          
          <div className="space-y-4">
            <AnimatePresence>
              {tracking.events
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(event.status, event.isCompleted)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm capitalize">
                          {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Carrier Information */}
        {tracking.carrier && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Carrier</p>
                <p className="text-sm text-muted-foreground">{tracking.carrier}</p>
              </div>
              {tracking.trackingNumber && (
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Track on {tracking.carrier}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Real-time Status */}
        {tracking.isRealTimeEnabled && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Real-time tracking enabled
          </div>
        )}
      </CardContent>
    </Card>
  )
}