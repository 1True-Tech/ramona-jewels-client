"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle, TrendingUp, Gem, Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/redux-auth-context"
import { useToast } from "@/hooks/use-toast"
import { useGetProductsQuery, useUpdateProductStockMutation, useDeleteProductMutation, useToggleProductStatusMutation } from "@/store/api/productsApi"
import Image from "next/image"
import Link from "next/link"

export default function AdminInventoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  // RTK Query hooks
  const { data: productsResponse, isLoading, error } = useGetProductsQuery()
  const products = productsResponse?.data || []
  const [updateProductStock] = useUpdateProductStockMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [toggleProductStatus] = useToggleProductStatusMutation()
  
  // Local state for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "jewelry" | "perfume">("all")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((product) => product.type === selectedType)
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by stock status
    if (stockFilter === "low") {
      filtered = filtered.filter((product) => product.stock <= 10 && product.stock > 0)
    } else if (stockFilter === "out") {
      filtered = filtered.filter((product) => product.stock === 0)
    }

    return filtered
  }, [products, searchQuery, selectedType, selectedCategory, stockFilter])

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await updateProductStock({ id: productId, stock: newStock }).unwrap()
      toast({
        title: "Stock updated",
        description: "Product stock has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product stock.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      await deleteProduct(productId).unwrap()
      toast({
        title: "Product deleted",
        description: `${productName} has been removed from inventory.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await toggleProductStatus(productId).unwrap()
      toast({
        title: "Status updated",
        description: `Product ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      })
    }
  }

  // Calculate stats
  const lowStockCount = products.filter((p) => p.stock <= 10 && p.stock > 0).length
  const outOfStockCount = products.filter((p) => p.stock === 0).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  if (!user || user.role !== "admin") {
    return null
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-2">Failed to load inventory</p>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-playfair gradient-text">Inventory Management</h1>
              <p className="text-muted-foreground">Manage your jewelry and perfume inventory</p>
            </div>
            <Link href="/admin/inventory/add">
              <Button className="gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold gradient-text">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold gradient-text">${totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20"
            />
          </div>

          <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
            <SelectTrigger className="w-48 border-primary/20">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="jewelry">
                <div className="flex items-center">
                  <Gem className="h-4 w-4 mr-2" />
                  Jewelry
                </div>
              </SelectItem>
              <SelectItem value="perfume">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Perfumes
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={(value: any) => setStockFilter(value)}>
            <SelectTrigger className="w-48 border-primary/20">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock (≤10)</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-card rounded-lg border border-primary/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Inventory Items</h2>
              <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full rounded-t-xl overflow-hidden">
                <thead className="border-b border-primary/20 gradient-primary text-white">
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Stock</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Value</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="border-b border-amber-300 hover:bg-muted/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative min-w-9 h-9 rounded-lg overflow-hidden bg-muted jewelry-sparkle">
                            <Image
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium whitespace-nowrap">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand || 'No brand'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="border-primary/20">
                          {product.type === "jewelry" ? (
                            <>
                              <Gem className="h-3 w-3 mr-1" />
                              Jewelry
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 mr-1" />
                              Perfume
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm capitalize">{product.category || 'Uncategorized'}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => handleUpdateStock(product._id, Number.parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-center border-primary/20"
                            min="0"
                          />
                          <span className="text-xs text-muted-foreground">units</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              product.stock === 0
                                ? "destructive"
                                : product.stock <= 10
                                  ? "secondary"
                                  : "default"
                            }
                            className={
                              product.stock === 0
                                ? ""
                                : product.stock <= 10
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock <= 10
                                ? "Low Stock"
                                : "In Stock"}
                          </Badge>
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium gradient-text">
                          ${(product.price * product.stock).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product._id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/inventory/edit/${product._id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(product._id, product.isActive)}
                            className={product.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                            title={product.isActive ? "Deactivate product" : "Activate product"}
                          >
                            {product.isActive ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Package className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
