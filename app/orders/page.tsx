"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Search,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Eye
} from "lucide-react"
import { Navbar } from "@/components/layouts/navbar"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { useAuth } from "@/contexts/redux-auth-context"
import { useGetMyOrdersQuery } from "@/store/api/ordersApi"
import type { Order as ApiOrder } from "@/store/apiTypes"

export default function OrdersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const { data, isLoading, isError } = useGetMyOrdersQuery(undefined, {
    skip: !user, // don't fetch if not authenticated
  })

  const orders: ApiOrder[] = data?.data ?? []

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders
    const term = searchTerm.toLowerCase()
    return orders.filter((order) =>
      order.id.toLowerCase().includes(term) ||
      order.items.some((item) => item.name.toLowerCase().includes(term))
    )
  }, [orders, searchTerm])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Please sign in to view your orders</h2>
            <Link href="/auth/login">
              <Button size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
        <MobileNav />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
        <MobileNav />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Unable to load your orders</h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-xl md:text-3xl font-bold mb-2">Your Orders</h1>
          <p className="text-muted-foreground">
            {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length === 1 ? '' : 's'} found`}
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              When you place your first order, it will appear here.
            </p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Orders List */}
            <div className="space-y-6 pb-20">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <span>Order {order.id}</span>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span>${order.total.toFixed(2)}</span>
                            {order.trackingNumber && (
                              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                {order.trackingNumber}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Order Items Preview */}
                      <div className="space-y-3 mb-4">
                        {order.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                              <Image 
                                src={item.image || "/images/TestImage.jpg"} 
                                alt={item.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </div>
                            </div>
                            <div className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-sm text-muted-foreground text-center py-2">
                            +{order.items.length - 3} more item{order.items.length - 3 === 1 ? '' : 's'}
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium mb-1">Shipping Address</div>
                          <div className="text-muted-foreground">
                            {order.shippingAddress?.name || 'N/A'}<br />
                            {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || ''}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Payment Status</div>
                          <div className="text-muted-foreground capitalize">
                            {order.paymentStatus || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Payment Method</div>
                          <div className="text-muted-foreground capitalize">
                            {order.paymentMethod || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Estimated Delivery</div>
                          <div className="text-muted-foreground">
                            {order && (order as any).estimatedDelivery ? new Date((order as any).estimatedDelivery as any).toLocaleDateString() : (order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredOrders.length === 0 && searchTerm && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    Try searching with a different term or order ID.
                  </p>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>

      <MobileNav />
    </div>
  )
}