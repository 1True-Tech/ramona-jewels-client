"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle, TrendingUp, Gem, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { allProducts } from "@/lib/product-data"
import Image from "next/image"

export default function AdminInventoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState(allProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "jewelry" | "perfume">("all")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
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
      filtered = filtered.filter((product) => product.stockCount <= 10 && product.stockCount > 0)
    } else if (stockFilter === "out") {
      filtered = filtered.filter((product) => product.stockCount === 0)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedType, selectedCategory, stockFilter, products])

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p)))
    toast({
      title: "Stock updated",
      description: "Product stock has been updated successfully.",
    })
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast({
      title: "Product deleted",
      description: "Product has been removed from inventory.",
    })
  }

  const lowStockCount = products.filter((p) => p.stockCount <= 10 && p.stockCount > 0).length
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stockCount, 0)

  if (!user || user.role !== "admin") {
    return null
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
            <Button className="gradient-primary text-white border-0 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
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
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
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
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg border border-primary/20"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Inventory Items</h2>
              <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
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
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-primary/10 hover:bg-muted/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted jewelry-sparkle">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
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
                      <td className="py-4 px-4 text-sm capitalize">{product.category}</td>
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
                            value={product.stockCount}
                            onChange={(e) => handleUpdateStock(product.id, Number.parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-center border-primary/20"
                            min="0"
                          />
                          <span className="text-xs text-muted-foreground">units</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            product.stockCount === 0
                              ? "destructive"
                              : product.stockCount <= 10
                                ? "secondary"
                                : "default"
                          }
                          className={
                            product.stockCount === 0
                              ? ""
                              : product.stockCount <= 10
                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                : "bg-green-100 text-green-800 border-green-200"
                          }
                        >
                          {product.stockCount === 0
                            ? "Out of Stock"
                            : product.stockCount <= 10
                              ? "Low Stock"
                              : "In Stock"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium gradient-text">
                          ${(product.price * product.stockCount).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="stock">Stock Quantity</Label>
                                  <Input
                                    id="stock"
                                    type="number"
                                    value={editingProduct?.stockCount || 0}
                                    onChange={(e) =>
                                      setEditingProduct({
                                        ...editingProduct,
                                        stockCount: Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="border-primary/20"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="price">Price</Label>
                                  <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={editingProduct?.price || 0}
                                    onChange={(e) =>
                                      setEditingProduct({
                                        ...editingProduct,
                                        price: Number.parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="border-primary/20"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      if (editingProduct) {
                                        setProducts(
                                          products.map((p) =>
                                            p.id === editingProduct.id
                                              ? {
                                                  ...p,
                                                  stockCount: editingProduct.stockCount,
                                                  price: editingProduct.price,
                                                  inStock: editingProduct.stockCount > 0,
                                                }
                                              : p,
                                          ),
                                        )
                                        toast({
                                          title: "Product updated",
                                          description: "Product details have been updated successfully.",
                                        })
                                        setEditingProduct(null)
                                      }
                                    }}
                                    className="gradient-primary text-white border-0 hover:opacity-90"
                                  >
                                    Save Changes
                                  </Button>
                                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
