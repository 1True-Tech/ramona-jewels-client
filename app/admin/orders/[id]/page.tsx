"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Edit,
  Printer,
  Download
} from "lucide-react"

// Mock order data
const mockOrder = {
  id: "ORD-001",
  customerName: "Alice Johnson",
  customerEmail: "alice@example.com",
  customerPhone: "+1 (555) 123-4567",
  date: "2024-03-15",
  status: "delivered",
  total: 299.99,
  subtotal: 299.99,
  shipping: 0,
  tax: 0,
  discount: 0,
  items: 2,
  products: [
    { 
      id: "1",
      name: "Midnight Rose", 
      image: "/placeholder.svg", 
      quantity: 1, 
      price: 149.99,
      type: "perfume",
      category: "Floral"
    },
    { 
      id: "2",
      name: "Ocean Breeze", 
      image: "/placeholder.svg", 
      quantity: 1, 
      price: 150.00,
      type: "perfume",
      category: "Aquatic"
    }
  ],
  shippingAddress: {
    name: "Alice Johnson",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  billingAddress: {
    name: "Alice Johnson",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  paymentMethod: "Credit Card ending in 4242",
  trackingNumber: "1Z999AA1234567890",
  notes: "Please handle with care"
}

// Mock order timeline
const orderTimeline = [
  {
    status: "Order Placed",
    date: "2024-03-15 10:30 AM",
    description: "Order was successfully placed",
    completed: true
  },
  {
    status: "Payment Confirmed",
    date: "2024-03-15 10:32 AM",
    description: "Payment processed successfully",
    completed: true
  },
  {
    status: "Processing",
    date: "2024-03-15 2:00 PM",
    description: "Order is being prepared",
    completed: true
  },
  {
    status: "Shipped",
    date: "2024-03-16 9:00 AM",
    description: "Order has been shipped",
    completed: true
  },
  {
    status: "Delivered",
    date: "2024-03-18 3:45 PM",
    description: "Order delivered successfully",
    completed: true
  }
]

export default function AdminOrderDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState(mockOrder)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "shipped": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
      case "processing": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "pending": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
      case "cancelled": return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-5 w-5" />
      case "shipped": return <Truck className="h-5 w-5" />
      case "processing": return <Package className="h-5 w-5" />
      case "pending": return <Clock className="h-5 w-5" />
      case "cancelled": return <XCircle className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </motion.div>

        {/* Order Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order {order.id}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
                <span className="text-muted-foreground">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Order Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Link 
                              href={`/products/${product.id}`}
                              className="font-medium hover:text-primary"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {product.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">{order.shippingAddress.name}</p>
                        <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                        <p className="text-muted-foreground">
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{order.paymentMethod}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Tracking: {order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-card rounded-lg border p-6">
                      <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
                      <p className="text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">Customer Name</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.customerEmail}</p>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{order.customerPhone}</p>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href={`/admin/users/1`}>
                      <Button variant="outline" className="w-full">
                        View Customer Profile
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">{order.billingAddress.name}</p>
                      <p className="text-muted-foreground">{order.billingAddress.street}</p>
                      <p className="text-muted-foreground">
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                      </p>
                      <p className="text-muted-foreground">{order.billingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
                <div className="space-y-6">
                  {orderTimeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.status}</h4>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  )
}