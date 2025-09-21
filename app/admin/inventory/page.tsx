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
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { useGetProductsQuery, useUpdateProductStockMutation, useDeleteProductMutation, useToggleProductStatusMutation } from "@/store/api/productsApi"
import Image from "next/image"
import Link from "next/link"
import { useGetProductTypesQuery } from "@/store/api/productTypesApi"
import { useGetCategoriesQuery } from "@/store/api/categoriesApi"
import { toServerImageUrl } from "@/lib/utils/imageUtils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu"
import { Loader } from "@/components/ui/loader"

export default function AdminInventoryPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // RTK Query hooks
  const { data: productsResponse, isLoading, error } = useGetProductsQuery()
  const products = productsResponse?.data || []
  const [updateProductStock] = useUpdateProductStockMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [toggleProductStatus] = useToggleProductStatusMutation()
  const { data: productTypesRes } = useGetProductTypesQuery()
  const productTypes = productTypesRes?.data ?? []
  const { data: categoriesRes } = useGetCategoriesQuery()
  const categories = categoriesRes?.data ?? []
  
  // Build maps to derive product type from category when product.type is absent
  const productTypesById = useMemo(() => {
    const map = new Map<string, any>()
    for (const pt of productTypes) map.set(pt._id, pt)
    return map
  }, [productTypes])

  const categoryToProductTypeName = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories) {
      const pt = productTypesById.get(c.productType)
      if (pt?.name) map.set((c.name ?? '').toLowerCase(), pt.name)
    }
    return map
  }, [categories, productTypesById])

  const getTypeNameForProduct = (p: any): string | undefined => {
    const direct = (p?.type ?? '').trim()
    if (direct) return direct
    const cat = (p?.category ?? '').toLowerCase()
    return categoryToProductTypeName.get(cat)
  }

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory] = useState("")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])
  useEffect(() => {
    if (!hydrated) return
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [hydrated, user, router])

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
      const st = selectedType.toLowerCase()
      filtered = filtered.filter((product) => (getTypeNameForProduct(product) ?? "").toLowerCase() === st)
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
  }, [products, searchQuery, selectedType, selectedCategory, stockFilter, getTypeNameForProduct])

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      await updateProductStock({ id: productId, stock: newStock }).unwrap()
      dispatch(showModal({
        type: 'success',
        title: 'Stock updated',
        message: 'Product stock has been updated successfully.'
      }))
    } catch (error) {
      dispatch(showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to update product stock.'
      }))
    }
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      await deleteProduct(productId).unwrap()
      dispatch(showModal({
        type: 'success',
        title: 'Product deleted',
        message: `${productName} has been removed from inventory.`
      }))
    } catch (error) {
      dispatch(showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete product.'
      }))
    }
  }

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await toggleProductStatus({ id: productId, inStock: !currentStatus }).unwrap()
      dispatch(showModal({
        type: 'success',
        title: 'Status updated',
        message: `Product ${currentStatus ? 'deactivated' : 'activated'} successfully.`
      }))
    } catch (error) {
      dispatch(showModal({
        type: 'error',
        title: 'Error',
        message: 'Failed to update product status.'
      }))
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
            <Loader message="Loading inventory..." />
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
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">Manage your jewelry and perfume inventory</p>
            </div>
            <Link href="/admin/inventory/add" className="w-full md:w-auto">
              <Button className="gradient-primary text-white w-full md:w-auto">
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
              {productTypes.map((t) => (
                <SelectItem key={t._id} value={t.name}>
                  <div className="flex items-center">
                    {t.icon ? (
                      <span className="mr-2">{t.icon}</span>
                    ) : (
                      <Package className="h-4 w-4 mr-2" />
                    )}
                    {t.name?.charAt(0).toUpperCase() + (t.name?.slice(1) ?? "")}
                  </div>
                </SelectItem>
              ))}
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
                <thead className="border-b gradient-primary text-white rounded-t-xl overflow-hidden">
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium whitespace-nowrap">Name & Brand</th>
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
                      className={`border-l-2 border-r-2 border-gray-100 ${index % 2=== 0 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative min-w-9 h-9 rounded-lg overflow-hidden bg-muted jewelry-sparkle">
                            <Image
                              src={toServerImageUrl(product.images?.[0] || "/placeholder.svg")}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                          <div>
                            <p className="font-medium whitespace-nowrap">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{product.brand || 'No brand'}</p>
                          </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="border-primary/20">
                          {(() => {
                            const ptName = getTypeNameForProduct(product)
                            const t = productTypes.find((pt) => (pt.name ?? '').toLowerCase() === (ptName ?? '').toLowerCase())
                            const baseLabel = ptName && ptName.length > 0 ? ptName : (product.type ? product.type : "Unknown")
                            const label = baseLabel.charAt(0).toUpperCase() + baseLabel.slice(1)
                            return (
                              <>
                                {t?.icon ? (
                                  <span className="mr-1">{t.icon}</span>
                                ) : (
                                  <Package className="h-3 w-3 mr-1" />
                                )}
                                {label}
                              </>
                            )
                          })()}
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
                            className="w-20 h-8 text-center border-primary"
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
                                  ? "bg-orange-100 text-orange-800 border-0"
                                  : "bg-green-100 text-green-800 border-0"
                            }
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock <= 10
                                ? "Low Stock"
                                : "In Stock"}
                          </Badge>
                          {/* <Badge
                            variant={product.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge> */}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium gradient-text border-none">
                          ${(product.price * product.stock).toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="border-none text-center w-full focus:outline-none focus:ring-none focus:border-0">⋯</DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[10rem] bg-white">
                            <DropdownMenuArrow className="fill-white" />
                            <DropdownMenuItem className="pl-10">
                              <Link href={`/products/${product._id}`} className="w-full">
                                <Button variant="ghost" size="icon">
                                  <span>Product Details</span>
                                </Button>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="pl-7">
                              <Link href={`/admin/inventory/edit/${product._id}`}>
                                <Button variant="ghost" size="icon">
                                  <span>Edit Product</span>
                                </Button>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="pl-13">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleStatus(product._id, product.isActive)}
                                className={product.isActive ? "" : "text-orange-400"}
                                title={product.isActive ? "Deactivate product" : "Activate product"}
                              >
                                {product.isActive ? (
                                  <span className="">Deactivate Product</span>
                                ) : (
                                  <span className="">Activate Product</span>
                                )}
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="-ml-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product._id, product.name)}
                                className="w-full text-start text-red-500"
                                title="Delete product"
                              >
                                Delete Product
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      {/* <td>
                      <Select value={selectAction} onValueChange={(value: any) => setSelectAction(value)}>
                        <SelectTrigger className="w-48 border-primary/20">
                          <SelectValue placeholder="Actions" />
                        </SelectTrigger>
                        <SelectContent className="flex flex-col items-start justify-end gap-2">
                          <div className="flex flex-col items-start justify-end gap-2">
                            <Link href={`/products/${product._id}`} className="bg-red-100 w-full">
                              <Button variant="ghost" size="icon">
                                <span>Product Details</span>
                              </Button>
                            </Link>
                            <Link href={`/admin/inventory/edit/${product._id}`}>
                              <Button variant="ghost" size="icon">
                                  <span>Edit Product</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(product._id, product.isActive)}
                              className={product.isActive ? "" : ""}
                              title={product.isActive ? "Deactivate product" : "Activate product"}
                            >
                              {product.isActive ? (
                                <span className="">Deactivate Product</span>
                              ) : (
                                <span className="">Activate Product</span>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                              className="text-red-500"
                            >
                              <span>Delete Product</span>
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                      </td> */}
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
