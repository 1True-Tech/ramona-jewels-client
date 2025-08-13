"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Calendar,
  MapPin,
  CreditCard,
  Download,
  Mail,
  Phone,
  Copy,
  Check
} from "lucide-react"
import { Navbar } from "@/components/layouts/navbar"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { useToast } from "@/hooks/use-toast"

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

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) {
      router.push('/orders')
      return
    }

    // Get order from localStorage (in real app, this would be fetched from backend)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const foundOrder = orders.find((o: Order) => o.id === orderId)
    
    if (!foundOrder) {
      router.push('/orders')
      return
    }

    setOrder({
      ...foundOrder,
      estimatedDelivery: new Date(foundOrder.estimatedDelivery),
      createdAt: new Date(foundOrder.createdAt)
    })
    setIsLoading(false)
  }, [orderId, router])

  const copyOrderId = async () => {
    if (!order) return
    
    try {
      await navigator.clipboard.writeText(order.id)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Order ID copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy order ID to clipboard",
        // variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
        <MobileNav />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order not found</h1>
            <Link href="/orders">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">View your order information and status</p>
            </div>
          </div>

          {/* Order ID and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Order ID:</span>
                <span className="font-mono font-bold">{order.id}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyOrderId}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Placed on {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
              </div>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-sm`}>
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">{order.status}</span>
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
                            src={item.image || "/images/TestImage.jpg"} 
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

            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1 pl-6">
                        <div>{order.shipping.firstName} {order.shipping.lastName}</div>
                        <div>{order.shipping.address}</div>
                        <div>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.shipping.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {order.shipping.email}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Delivery Information
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-1 pl-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
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

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Credit Card</div>
                      <div className="text-sm text-muted-foreground">
                        {order.payment.cardNumber}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
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
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Invoice
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Questions about your order? Contact our support team:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      support@ramonajewels.com
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      +1 (555) 123-4567
                    </div>
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