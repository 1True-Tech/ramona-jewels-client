"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
// Removed unused Image import
// import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useAuth } from "@/contexts/redux-auth-context"
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  ShoppingBag,
  DollarSign,
  MapPin,
  Edit,
  Ban,
  CheckCircle,
  Package,
  Truck,
  Star
} from "lucide-react"
import { useGetAdminUserQuery } from "@/store/api/adminApi"
import { useGetOrdersQuery } from "@/store/api/ordersApi"

export default function AdminUserProfilePage() {
  const { user: currentUser, hydrated } = useAuth()
  const router = useRouter()
  const params = useParams()
  // Comment out legacy mock-based state to avoid duplicate identifiers with fetched data

  const id = (params?.id as string) || ""

  const skipAuth = !hydrated || !currentUser || currentUser.role !== "admin" || !id
  const { data: userResp, isLoading: userLoading, error: userError } = useGetAdminUserQuery(id, {
    skip: skipAuth,
    refetchOnMountOrArgChange: true,
  })
  const user = userResp?.data

  const { data: ordersResp, isLoading: ordersLoading } = useGetOrdersQuery(
    user?.email ? { search: user.email, limit: 100 } : undefined,
    { skip: skipAuth || !user?.email, refetchOnMountOrArgChange: true }
  )
  const allOrders = ordersResp?.data || []
  const orders = allOrders.filter((o: any) => o.userId === user?.id)

  useEffect(() => {
    if (!hydrated) return
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/auth/login")
    }
  }, [currentUser, hydrated, router])

  if (!hydrated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  if (userLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (userError || !user) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div className="text-red-600">{userError ? "Failed to load user details" : "User not found"}</div>
        </div>
      </AdminLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "shipped": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
      case "processing": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "cancelled": return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "processing": return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const totalOrders = typeof user.orders === "number" ? user.orders : orders.length
  const totalSpent = typeof user.totalSpent === "number" ? user.totalSpent : orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  const averageOrderValue = totalOrders ? totalSpent / totalOrders : 0
  const lastActiveDate = user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : "-"

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </motion.div>

        {/* User Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-center gap-4">
              <UserAvatar 
                user={user as any} 
                size="xl" 
                className="w-20 h-20"
              />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-1" />
                        Customer
                      </>
                    )}
                  </Badge>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold">{new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-center">
              <Button variant={user.status === "active" ? "destructive" : "secondary"} size="sm">
                {user.status === "active" ? (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend User
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate User
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-xl font-bold">{totalOrders}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Last Activity</p>
                <p className="text-xl font-bold">{lastActiveDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user.phone}</p>
                        <p className="text-sm text-muted-foreground">Phone Number</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{lastActiveDate}</p>
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">{user as any && (user as any).address ? (user as any).address.street || '-' : '-'}</p>
                      <p className="text-muted-foreground">
                        {(user as any && (user as any).address ? (user as any).address.city || '-' : '-')}, {(user as any && (user as any).address ? (user as any).address.state || '' : '')} {(user as any && (user as any).address ? (user as any).address.zipCode || '' : '')}
                      </p>
                      <p className="text-muted-foreground">{user as any && (user as any).address ? (user as any).address.country || '-' : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Order History</h3>
                  <p className="text-muted-foreground">All orders placed by this user</p>
                </div>
                {ordersLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium">Order ID</th>
                          <th className="text-left py-3 px-6 font-medium">Date</th>
                          <th className="text-left py-3 px-6 font-medium">Status</th>
                          <th className="text-left py-3 px-6 font-medium">Items</th>
                          <th className="text-left py-3 px-6 font-medium">Total</th>
                          <th className="text-left py-3 px-6 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-muted/50">
                            <td className="py-4 px-6">
                              <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                                {order.id}
                              </Link>
                            </td>
                            <td className="py-4 px-6">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium">{order.items.length} items</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.items.slice(0, 2).map((i: any) => i.name).join(", ")}
                                  {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-medium">${(order.total || 0).toFixed(2)}</span>
                            </td>
                            <td className="py-4 px-6">
                              <Link href={`/admin/orders/${order.id}`}>
                                <Button variant="ghost" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {orders.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">No orders found for this user.</div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Placed an order</p>
                      <p className="text-sm text-muted-foreground">{lastActiveDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Updated profile information</p>
                      <p className="text-sm text-muted-foreground">{lastActiveDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Left a review</p>
                      <p className="text-sm text-muted-foreground">{lastActiveDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  )
}