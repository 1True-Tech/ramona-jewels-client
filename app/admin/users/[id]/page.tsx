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

// Mock user data
const mockUser = {
  id: "1",
  name: "Alice Johnson",
  email: "alice@example.com",
  phone: "+1 (555) 123-4567",
  role: "customer",
  status: "active",
  joinDate: "2024-01-15",
  lastLogin: "2024-03-15",
  avatar: "/placeholder.svg",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  },
  stats: {
    totalOrders: 12,
    totalSpent: 2450.00,
    averageOrderValue: 204.17,
    favoriteCategory: "Perfumes"
  }
}

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-03-10",
    status: "delivered",
    total: 299.99,
    items: 2,
    products: ["Midnight Rose", "Ocean Breeze"]
  },
  {
    id: "ORD-002",
    date: "2024-03-05",
    status: "shipped",
    total: 189.99,
    items: 1,
    products: ["Velvet Oud"]
  },
  {
    id: "ORD-003",
    date: "2024-02-28",
    status: "processing",
    total: 449.99,
    items: 3,
    products: ["Garden Party", "Citrus Burst", "Mystic Woods"]
  }
]

export default function AdminUserProfilePage() {
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(mockUser)
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/auth/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.role !== "admin") {
    return null
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
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
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
                <p className="text-2xl font-bold">{user.stats.totalOrders}</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${user.stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">${user.stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold">{new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button variant="outline" className="w-full">
                {user.status === "active" ? (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">Last Login</p>
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
                      <p className="font-medium">{user.address.street}</p>
                      <p className="text-muted-foreground">
                        {user.address.city}, {user.address.state} {user.address.zipCode}
                      </p>
                      <p className="text-muted-foreground">{user.address.country}</p>
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
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-6">
                            <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                              {order.id}
                            </Link>
                          </td>
                          <td className="py-4 px-6">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium">{order.items} items</p>
                              <p className="text-sm text-muted-foreground">
                                {order.products.slice(0, 2).join(", ")}
                                {order.products.length > 2 && ` +${order.products.length - 2} more`}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium">${order.total.toFixed(2)}</span>
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Placed order #ORD-001</p>
                      <p className="text-sm text-muted-foreground">March 10, 2024 at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Updated profile information</p>
                      <p className="text-sm text-muted-foreground">March 8, 2024 at 11:15 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Left a review for "Midnight Rose"</p>
                      <p className="text-sm text-muted-foreground">March 5, 2024 at 4:45 PM</p>
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