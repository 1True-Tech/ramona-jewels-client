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
import { useAuth } from "@/contexts/redux-auth-context"
import { useGetProductQuery, useUpdateProductMutation } from "@/store/api/productsApi"
import Image from "next/image"
import Link from "next/link"

export default function EditProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const { data: productResponse, isLoading, error: productError } = useGetProductQuery(productId)
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [saving, setSaving] = useState(false)

  const apiProduct = productResponse?.data
  const product = apiProduct
    ? {
        id: apiProduct._id,
        name: apiProduct.name,
        brand: apiProduct.brand,
        description: apiProduct.description,
        category: apiProduct.category,
        price: apiProduct.price,
        originalPrice: apiProduct.originalPrice,
        image: (apiProduct.images && apiProduct.images[0]) || "/placeholder.svg",
        stockCount: apiProduct.stock ?? 0,
        inStock: (apiProduct.isActive ?? true) && (apiProduct.stock ?? 0) > 0,
        type: apiProduct.type ?? "perfume",
        // Backend-driven fields only
        size: apiProduct.size || "",
        concentration: apiProduct.concentration || "",
        gender: apiProduct.gender || "unisex",
      }
    : null

  // Local state to capture controlled Select values we need to send back
  const [category, setCategory] = useState<string>("")
  const [gender, setGender] = useState<string>("unisex")

  useEffect(() => {
    if (product) {
      setCategory(product.category || "")
      setGender((product.gender as string) || "unisex")
    }
  }, [product?.id])

  const handleSave = async () => {
    if (!product) return
    try {
      setSaving(true)
      // Read values from inputs by id
      const nameEl = document.getElementById("name") as HTMLInputElement | null
      const brandEl = document.getElementById("brand") as HTMLInputElement | null
      const descEl = document.getElementById("description") as HTMLTextAreaElement | null
      const priceEl = document.getElementById("price") as HTMLInputElement | null
      const originalPriceEl = document.getElementById("originalPrice") as HTMLInputElement | null
      const stockEl = document.getElementById("stockCount") as HTMLInputElement | null
      const inStockEl = document.getElementById("inStock") as HTMLInputElement | null
      const sizeEl = document.getElementById("size") as HTMLInputElement | null
      const concentrationEl = document.getElementById("concentration") as HTMLInputElement | null

      const payload: any = {}
      if (nameEl) payload.name = nameEl.value.trim()
      if (brandEl) payload.brand = brandEl.value.trim()
      if (descEl) payload.description = descEl.value.trim()

      // Use controlled state for Select values
      if (category) payload.category = category

      if (priceEl) {
        const priceNum = parseFloat(priceEl.value)
        if (!Number.isNaN(priceNum)) payload.price = priceNum
      }
      if (originalPriceEl && originalPriceEl.value !== "") {
        const opNum = parseFloat(originalPriceEl.value)
        if (!Number.isNaN(opNum)) payload.originalPrice = opNum
      } else {
        payload.originalPrice = undefined
      }
      if (stockEl) {
        const stockNum = parseInt(stockEl.value, 10)
        if (!Number.isNaN(stockNum)) payload.stockCount = stockNum
      }
      if (inStockEl) payload.inStock = inStockEl.checked

      if (sizeEl && sizeEl.value) payload.size = sizeEl.value
      if (concentrationEl && concentrationEl.value) payload.concentration = concentrationEl.value

      // Map gender to backend accepted casing
      if (gender) {
        const map: Record<string, string> = { men: "Men", women: "Women", unisex: "Unisex" }
        payload.gender = map[gender] || gender
      }

      await updateProduct({ id: productId, data: payload }).unwrap()
      router.push("/admin/inventory")
    } catch (e) {
      // Errors are surfaced by global modal in baseQuery
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (isLoading) {
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

  if (productError || !product) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">The product you are looking for does not exist.</p>
            <Link href="/admin/inventory">
              <Button>Back to Inventory</Button>
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
            <Link href="/admin/inventory">
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
            style={{
            gridColumn: 'span 2 / span 2', // This applies for lg breakpoint — you can't fully replicate responsive breakpoints with inline styles alone
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem', // space-y-6 = 1.5rem gap between children vertically
            }}
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
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eau-de-parfum">Eau de Parfum</SelectItem>
                        <SelectItem value="eau-de-toilette">Eau de Toilette</SelectItem>
                        <SelectItem value="cologne">Cologne</SelectItem>
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
                  Perfume Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="size">Size</Label>
    <Input id="size" defaultValue={product.size || ""} />
  </div>
  {product.type === "perfume" && (
    <>
      <div>
        <Label htmlFor="concentration">Concentration</Label>
        <Input id="concentration" defaultValue={product.concentration || ""} />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={setGender}>
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
    </>
  )}
</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-6">
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
                  disabled={saving || isUpdating}
                  className="w-full gradient-primary text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving || isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin/inventory" className="block">
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
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}