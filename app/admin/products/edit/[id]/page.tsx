"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { allProducts, type Product, type JewelryProduct, type PerfumeProduct } from "@/lib/product-data"
import Image from "next/image"
import Link from "next/link"

export default function EditProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
      return
    }

    // Find the product
    const foundProduct = allProducts.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    }
    setLoading(false)
  }, [user, router, productId])

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    router.push("/admin/products")
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Link href="/admin/products">
              <Button>Back to Products</Button>
            </Link>
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
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">Update product information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {product.type}
            </Badge>
            <Badge variant={product.inStock ? "default" : "destructive"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Information */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" defaultValue={product.name} />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" defaultValue={product.brand} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={product.description} rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select defaultValue={product.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {product.type === "jewelry" ? (
                          <>
                            <SelectItem value="rings">Rings</SelectItem>
                            <SelectItem value="necklaces">Necklaces</SelectItem>
                            <SelectItem value="earrings">Earrings</SelectItem>
                            <SelectItem value="bracelets">Bracelets</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="eau-de-parfum">Eau de Parfum</SelectItem>
                            <SelectItem value="eau-de-toilette">Eau de Toilette</SelectItem>
                            <SelectItem value="cologne">Cologne</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select defaultValue={product.type} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="perfume">Perfume</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" defaultValue={product.price} />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                    <Input id="originalPrice" type="number" defaultValue={product.originalPrice || ""} />
                  </div>
                  <div>
                    <Label htmlFor="stockCount">Stock Count</Label>
                    <Input id="stockCount" type="number" defaultValue={product.stockCount} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="inStock" defaultChecked={product.inStock} />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </CardContent>
            </Card>

            {/* Product Specific Details */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>
                  {product.type === "jewelry" ? "Jewelry Details" : "Perfume Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.type === "jewelry" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input id="material" defaultValue={(product as JewelryProduct).material} />
                    </div>
                    <div>
                      <Label htmlFor="gemstone">Gemstone</Label>
                      <Input id="gemstone" defaultValue={(product as JewelryProduct).gemstone || ""} />
                    </div>
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input id="size" defaultValue={(product as JewelryProduct).size || ""} />
                    </div>
                    <div>
                      <Label htmlFor="collection">Collection</Label>
                      <Input id="collection" defaultValue={(product as JewelryProduct).collection || ""} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input id="size" defaultValue={(product as PerfumeProduct).size} />
                    </div>
                    <div>
                      <Label htmlFor="concentration">Concentration</Label>
                      <Input id="concentration" defaultValue={(product as PerfumeProduct).concentration} />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select defaultValue={(product as PerfumeProduct).gender}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unisex">Unisex</SelectItem>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="longevity">Longevity</Label>
                      <Input id="longevity" defaultValue={(product as PerfumeProduct).longevity || ""} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Image */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full gradient-primary text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin/products" className="block">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Delete Product
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}