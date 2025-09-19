"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/redux-auth-context"
import { UserAvatar } from "@/components/ui/user-avatar"
import { 
  useGetAdminUsersQuery,
  useGetUserStatsQuery,
  useGetTopUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation
} from "@/store/api/adminApi"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CircleUserRound,
  Shield,
  User,
  Crown,
  TrendingUp
} from "lucide-react"
import { Loader } from "@/components/ui/loader"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // API queries
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAdminUsersQuery({
    page: currentPage,
    limit: 20,
    search: searchQuery || undefined,
    role: selectedRole !== "all" ? selectedRole : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  })

  const { data: statsData, isLoading: statsLoading } = useGetUserStatsQuery()
  const { data: topUsersData, isLoading: topUsersLoading } = useGetTopUsersQuery()

  const [updateUserStatus] = useUpdateUserStatusMutation()
  const [deleteUser] = useDeleteUserMutation()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  const users = usersData?.data || []
  const stats = statsData?.data || {
    total: 0,
    active: 0,
    inactive: 0,
    customers: 0,
    admins: 0,
  }
  const topUsers = topUsersData?.data || []

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      await updateUserStatus({ id: userId, isActive: newStatus === 'active' }).unwrap()
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap()
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (usersLoading || statsLoading) {
    return (
      <AdminLayout>
        <Loader message="Loading users..."/>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
        >
          <div>
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Manage customer accounts and administrators</p>
          </div>
          <Button className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-red-600 rounded-full" />
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{stats.customers}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Top 5 Most Active Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.15 }}
          className="bg-card rounded-lg border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">Top 5 Most Active Users</h2>
          </div>
          {topUsersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {topUsers.map((topUser, index) => (
                <div key={topUser.id} className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted mx-auto mb-2">
                    <Image
                      src={topUser.avatar || "/placeholder.svg"}
                      alt={topUser.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-lg font-bold text-yellow-600">#{index + 1}</span>
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
                  </div>
                  <p className="font-medium text-sm truncate">{topUser.name}</p>
                  <p className="text-xs text-muted-foreground">{topUser.orders} orders</p>
                  <p className="text-xs font-medium text-green-600">${topUser.totalSpent.toFixed(2)}</p>
                  <Badge 
                    variant={topUser.status === "active" ? "default" : "secondary"}
                    className="mt-1 text-xs"
                  >
                    {topUser.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background !text-black"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background !text-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </motion.div>

        {/* Users Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b gradient-primary text-white rounded-t-xl overflow-hidden">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Contact</th>
                  <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Role</th>
                  <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Orders</th>
                  <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {usersError ? 'Error loading users' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className={`border-l-2 border-r-2 border-gray-100 ${index % 2=== 0 ? "bg-gray-50" : "bg-white"}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar 
                            user={user} 
                            size="sm" 
                            className="flex-shrink-0"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground sm:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
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
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="font-medium">{user.orders}</span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="font-medium">${user.totalSpent.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}