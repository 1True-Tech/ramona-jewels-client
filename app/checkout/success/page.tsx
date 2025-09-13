"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar, 
  Download, 
  Mail,
  Home,
  ShoppingBag,
  Loader
} from "lucide-react"
import { Navbar } from "@/components/layouts/navbar"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { useOrderTracking } from "@/contexts/order-tracking-context"
import { io, Socket } from 'socket.io-client'
import { toast } from "@/hooks/use-toast"
import { toServerImageUrl } from "@/lib/utils/imageUtils"

interface Order {
  id: string
  items: any[]
  shipping: any
  payment: any
  shippingMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  estimatedDelivery: Date
  createdAt: Date
}

function OrderSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { initializeTracking } = useOrderTracking()
  const socketRef = useRef<Socket | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Join socket room for real-time payment/status updates
  useEffect(() => {
    if (!orderId) return
    const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || '')
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/$/, '')
    if (!serverUrl) return

    const socket = io(serverUrl, { transports: ['websocket'], autoConnect: true })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_order', orderId)
    })

    socket.on('order:payment_update', (payload: { orderId: string; paymentStatus?: string; status?: string }) => {
      setOrder((prev) => {
        if (!prev) return prev
        const nextStatus = payload.status ?? prev.status
        const nextPaymentStatus = payload.paymentStatus ?? prev.payment?.status
        const updated = {
          ...prev,
          status: nextStatus,
          payment: { ...(prev.payment || {}), status: nextPaymentStatus }
        }
        // Persist to localStorage
        try {
          const list = JSON.parse(localStorage.getItem('orders') || '[]')
          const idx = list.findIndex((o: any) => o.id === prev.id)
          if (idx >= 0) {
            list[idx] = { ...list[idx], status: updated.status, payment: { ...(list[idx].payment || {}), status: nextPaymentStatus } }
            localStorage.setItem('orders', JSON.stringify(list))
          }
        } catch {}
        return updated
      })

      // Notify user
      const fmt = (s?: string) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      const isBad = (payload.paymentStatus === 'failed') || (payload.status === 'cancelled')
      const desc = [
        payload.paymentStatus ? `Payment: ${fmt(payload.paymentStatus)}` : null,
        payload.status ? `Status: ${fmt(payload.status)}` : null,
      ].filter(Boolean).join(' • ')
      toast({ variant: isBad ? 'destructive' : 'success', title: 'Order Update', description: desc })
    })

    return () => {
      try { socket.emit('leave_order', orderId) } catch {}
      socket.disconnect()
      socketRef.current = null
    }
  }, [orderId])

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    // Get order from localStorage (in real app, this would be fetched from backend)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find((o: Order) => o.id === orderId)
    
    if (!foundOrder) {
      router.push('/')
      return
    }

    const orderData = {
      ...foundOrder,
      estimatedDelivery: new Date(foundOrder.estimatedDelivery),
      createdAt: new Date(foundOrder.createdAt)
    }
    
    setOrder(orderData)
    
    // Initialize order tracking
    initializeTracking(orderId, {
      trackingNumber: `TRK${orderId.slice(-8).toUpperCase()}`,
      carrier: 'Ramona Express',
      estimatedDelivery: orderData.estimatedDelivery
    })
    
    setIsLoading(false)
  }, [orderId, router, initializeTracking])

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getShippingMethodName = (method: string) => {
    switch (method) {
      case 'express': return 'Express Shipping'
      case 'overnight': return 'Overnight Shipping'
      default: return 'Standard Shipping'
    }
  }

  const getDeliveryTime = (method: string) => {
    switch (method) {
      case 'express': return '2-3 business days'
      case 'overnight': return '1 business day'
      default: return '5-7 business days'
    }
  }

  const formatStatus = (s: string) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const statusColor = (s: string) => {
    const x = (s || '').toLowerCase()
    if (x === 'failed' || x === 'cancelled') return 'bg-red-500 text-red-800 bg-red-100'
    if (x === 'processing' || x === 'in_transit' || x === 'out_for_delivery') return 'bg-yellow-500 text-yellow-800 bg-yellow-100'
    return 'bg-green-500 text-green-800 bg-green-100'
  }
  const statusSequence = ['confirmed','processing','in_transit','out_for_delivery','delivered']
  const currentIndex = Math.max(0, statusSequence.indexOf((order.status || 'confirmed').toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <span className="text-sm font-medium">Order ID:</span>
            <span className="text-sm font-mono font-bold">{order.id}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusColor(order.status).split(' ')[0]}`}></div>
                      <div>
                        <div className="font-medium text-green-800">{formatStatus(order.status || 'Confirmed')}</div>
                        <div className="text-sm text-green-600">
                          {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${statusColor(order.status).split(' ').slice(1).join(' ')}`}>
                      {formatStatus(order.status || 'Confirmed')}
                    </Badge>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      {statusSequence.map((s, idx) => {
                        const reached = idx <= currentIndex
                        const failed = (order.status || '').toLowerCase() === 'failed' || (order.status || '').toLowerCase() === 'cancelled'
                        return (
                          <div key={s} className="flex-1 flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${failed ? 'bg-red-500 text-white' : reached ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'}`}>{idx+1}</div>
                            {idx < statusSequence.length - 1 && (
                              <div className={`h-1 flex-1 mx-2 rounded ${failed ? 'bg-red-300' : idx < currentIndex ? 'bg-green-400' : 'bg-muted'}`}></div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      {statusSequence.map((s) => (
                        <span key={s} className="w-20 text-center truncate">{formatStatus(s)}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>{order.shipping.firstName} {order.shipping.lastName}</div>
                        <div>{order.shipping.address}</div>
                        <div>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</div>
                        <div>{order.shipping.phone}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Delivery Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Estimated delivery: {order.estimatedDelivery.toLocaleDateString()}</span>
                        </div>
                        <div>{getShippingMethodName(order.shippingMethod)}</div>
                        <div>{getDeliveryTime(order.shippingMethod)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>{order.items.length} item(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <Image 
                            src={toServerImageUrl(item.image || "/images/TestImage.jpg")} 
                            alt={item.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {item.color && <span>Color: {item.color} </span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                          <div className="text-sm">Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Confirmation Email</div>
                        <div className="text-sm text-muted-foreground">
                          We've sent a confirmation email to {order.shipping.email} with your order details.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Order Processing</div>
                        <div className="text-sm text-muted-foreground">
                          Your order is being prepared for shipment. You'll receive tracking information once it ships.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          Expected delivery: {order.estimatedDelivery.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Receipt
                </Button>
                
                <Separator />
                
                <Link href="/products" className="block">
                  <Button className="w-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>If you have any questions about your order, please contact our customer support:</p>
                  <div className="space-y-1">
                    <div>Email: support@ramonajewels.com</div>
                    <div>Phone: +1 (555) 123-4567</div>
                    <div>Hours: Mon-Fri 9AM-6PM EST</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}

export default function OrderSuccessPage(){
  return <Suspense fallback={<div className="w-full py-10 flex items-center justify-center mx-auto"><Loader className="animate-spin"/></div>}>
    <OrderSuccess/>
  </Suspense>
}