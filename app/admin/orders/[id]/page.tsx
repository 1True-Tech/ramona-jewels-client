"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/redux-auth-context"
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
import { useGetOrderQuery, useUpdateOrderStatusMutation } from "@/store/api/ordersApi"
import { io, Socket } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toServerImageUrl } from "@/lib/utils/imageUtils"



export default function AdminOrderDetailPage() {
  const { user, hydrated } = useAuth()
   const router = useRouter()
  const params = useParams()
  const orderId = (params as any)?.id as string
  const isAdmin = !!user && user.role === "admin"

  const { data, isLoading, error, refetch } = useGetOrderQuery(orderId, {
    skip: !hydrated || !isAdmin || !orderId,
    refetchOnMountOrArgChange: true,
  })
  const order: any = (data as any)?.data

  console.log(order)

  const [showStatusForm, setShowStatusForm] = useState(false)
  const [statusValue, setStatusValue] = useState<string>(order?.status || 'pending')
  const [trackingValue, setTrackingValue] = useState<string>(order?.trackingNumber || '')
  const [notesValue, setNotesValue] = useState<string>(order?.notes || '')
  const [updateOrderStatus, { isLoading: updating }] = useUpdateOrderStatusMutation()

  useEffect(() => {
    setStatusValue(order?.status || 'pending')
    setTrackingValue(order?.trackingNumber || '')
    setNotesValue(order?.notes || '')
  }, [order?.status, order?.trackingNumber, order?.notes])

  const socketRef = useRef<Socket | null>(null)

   useEffect(() => {
    if (!hydrated) return
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, hydrated, router])

  // Realtime subscription for this order
  useEffect(() => {
    if (!orderId) return
    const base = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || '')
      .replace(/\/api\/v1\/?$/, '')
      .replace(/\/$/, '')
    if (!base) return

    const socket = io(base, { transports: ['websocket'], autoConnect: true })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_order', orderId)
    })

    const onUpdate = () => {
      try { refetch() } catch {}
    }

    socket.on('order_payment_update', onUpdate)
    socket.on('order:payment_update', onUpdate)

    return () => {
      try { socket.emit('leave_order', orderId) } catch {}
      socket.off('order_payment_update', onUpdate)
      socket.off('order:payment_update', onUpdate)
      socket.disconnect()
      socketRef.current = null
    }
  }, [orderId, refetch])

  const onSubmitStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    try {
      await updateOrderStatus({
        id: order.id,
        status: statusValue,
        ...(trackingValue ? { trackingNumber: trackingValue } : {}),
        ...(notesValue ? { notes: notesValue } : {}),
      }).unwrap()
      setShowStatusForm(false)
      refetch()
    } catch (_) {
      // handled globally by baseQueryWithModal
    }
  }
 
  if (!hydrated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!user || user.role !== "admin") {
    router.push("/auth/login")
    return null
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !order) {
    const err: any = error as any
    const message = err?.data?.message || err?.error || 'Order not found or failed to load.'
    return (
      <AdminLayout>
        <div className="text-center text-red-600 p-8">{message}</div>
      </AdminLayout>
    )
  }
 
   const getStatusColor = (status: string) => {
     switch (status) {
        case "delivered": return "text-green-500 bg-green-50"
        case "shipped": return "text-blue-500 bg-blue-50"
        case "processing": return "text-yellow-500 bg-yellow-50"
        case "pending": return "text-orange-300 bg-orange-50 border-none"
        case "cancelled": return "text-red-500 bg-red-50"
        default: return "text-gray-500 bg-gray-50"
     }
   }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "pending":
        return <Clock className="h-5 w-5" />
      case "cancelled":
        return <XCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
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
              <h1 className="text-md md:text-2xl font-bold line-clamp-1">Order {order.id}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </Badge>
                <span className="text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
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
              <Button onClick={() => setShowStatusForm((v) => !v)}>
                 <Edit className="h-4 w-4 mr-2" />
                 Update Status
               </Button>
            </div>
          </div>
        </motion.div>
 
        {showStatusForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
            <form onSubmit={onSubmitStatus} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tracking Number</label>
                <Input
                  placeholder="Tracking number (optional)"
                  value={trackingValue}
                  onChange={(e) => setTrackingValue(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  placeholder="Notes (optional)"
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className="min-h-24"
                />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button type="submit" disabled={updating}>Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowStatusForm(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}

         {/* Order Content */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
         >
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <Image src={toServerImageUrl(item.image || "/placeholder.svg")} alt={item.name} fill className="object-cover" loading="lazy"/>
                          </div>
                          <div className="flex-1">
                            <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary">
                              {item.name}
                            </Link>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping and Billing */}
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {order.shippingAddress.street}</div>
                      <div className="flex items-center gap-2"><User className="h-4 w-4" /> {order.shippingAddress.name}</div>
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {order.customerEmail}</div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {order.customerPhone}</div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {order.billingAddress.street}</div>
                      <div className="flex items-center gap-2"><User className="h-4 w-4" /> {order.billingAddress.name}</div>
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {order.customerEmail}</div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {order.customerPhone}</div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> {order.paymentMethod}</div>
                      <div className="flex items-center gap-2"><Package className="h-4 w-4" /> Payment Status: <span className="capitalize">{order.paymentStatus}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Placed on {new Date(order.createdAt).toLocaleString()}</div>
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2"><Truck className="h-4 w-4" /> Tracking: {order.trackingNumber}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><User className="h-4 w-4" /> {order.customerName}</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {order.customerEmail}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {order.customerPhone}</div>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  )
}