"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  RefreshCw,
  Bell,
  BellOff,
  Filter,
  Search,
  TrendingUp,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOrderTracking } from '@/contexts/order-tracking-context'

interface RealTimeTrackingProps {
  className?: string
}

export function RealTimeTracking({ className = '' }: RealTimeTrackingProps) {
  const { state } = useOrderTracking()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const trackings = Object.values(state.trackings)
  
  const filteredTrackings = trackings.filter(tracking => {
    const matchesSearch = tracking.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracking.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tracking.currentStatus.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'shipped':
      case 'in_transit': return <Truck className="h-4 w-4" />
      case 'out_for_delivery': return <MapPin className="h-4 w-4" />
      case 'delivered': return <Package className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
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

  const getStatusStats = () => {
    const stats = trackings.reduce((acc, tracking) => {
      const status = tracking.currentStatus.toLowerCase()
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { label: 'Confirmed', value: stats.confirmed || 0, color: 'text-blue-600' },
      { label: 'Processing', value: stats.processing || 0, color: 'text-yellow-600' },
      { label: 'Shipped', value: stats.shipped || 0, color: 'text-purple-600' },
      { label: 'In Transit', value: stats.in_transit || 0, color: 'text-indigo-600' },
      { label: 'Out for Delivery', value: stats.out_for_delivery || 0, color: 'text-orange-600' },
      { label: 'Delivered', value: stats.delivered || 0, color: 'text-green-600' }
    ]
  }

  const activeTrackings = trackings.filter(t => t.isRealTimeEnabled).length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Real-Time Order Tracking
          </h2>
          <p className="text-muted-foreground">
            Monitor all orders with live tracking updates
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {getStatusStats().map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Tracking Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Real-Time Tracking Active</span>
              </div>
              <Badge variant="secondary">
                {activeTrackings} of {trackings.length} orders
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {formatDate(new Date())}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID or Tracking Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tracking List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTrackings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tracking data found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Orders will appear here once tracking is initialized'
                }
              </p>
            </motion.div>
          ) : (
            filteredTrackings.map((tracking, index) => (
              <motion.div
                key={tracking.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tracking.currentStatus)}
                          <span className="font-medium">Order {tracking.orderId}</span>
                        </div>
                        <Badge className={`${getStatusColor(tracking.currentStatus)} border`}>
                          {tracking.currentStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {tracking.isRealTimeEnabled && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Bell className="h-3 w-3" />
                            Live
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated: {formatDate(tracking.lastUpdated)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tracking Number:</span>
                        <div className="font-mono font-medium">
                          {tracking.trackingNumber || 'Not assigned'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Carrier:</span>
                        <div className="font-medium">
                          {tracking.carrier || 'Not assigned'}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Delivery:</span>
                        <div className="font-medium">
                          {tracking.estimatedDelivery.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {tracking.events.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm font-medium mb-2">Latest Update:</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{tracking.events[tracking.events.length - 1].description}</span>
                          {tracking.events[tracking.events.length - 1].location && (
                            <span>• {tracking.events[tracking.events.length - 1].location}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}