"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { useAuth } from "@/contexts/redux-auth-context"
import { Upload, X, ArrowLeft, Save, Loader2 } from "lucide-react"
import { useCreateProductMutation, useUploadProductImagesMutation } from "@/store/api/productsApi"
import { useGetProductTypesQuery } from "@/store/api/productTypesApi"
import { useGetCategoriesQuery } from "@/store/api/categoriesApi"
import { getFieldsByProductType, type ProductTypeField } from "@/lib/categories-data"

export default function AddProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const dispatch = useAppDispatch()

  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number | "">("")  
  const [originalPrice, setOriginalPrice] = useState<number | "">("")  
  const [stockCount, setStockCount] = useState<number | "">("")  
  const [inStock, setInStock] = useState(true)
  // Rating, reviews, and badge will be managed by the backend

  const [selectedTypeId, setSelectedTypeId] = useState<string>("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  // Dynamic field state bag
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({})

  // Images state
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // API hooks
  const { data: typesResp } = useGetProductTypesQuery()
  const types = typesResp?.data ?? []

  const { data: categoriesResp } = useGetCategoriesQuery(
    selectedTypeId ? { productType: selectedTypeId } : undefined
  )
  const categories = categoriesResp?.data ?? []

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImagesMutation()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  // Reset dependent selections when type changes
  useEffect(() => {
    setSelectedCategoryId("")
    setDynamicValues({})
  }, [selectedTypeId])

  const typeKey = useMemo(() => {
    if (!selectedTypeId) return ""
    const t = types.find((t: any) => t._id === selectedTypeId)
    return t?.name?.toLowerCase?.() || ""
  }, [selectedTypeId, types])

  const fields: ProductTypeField[] = useMemo(() => (typeKey ? getFieldsByProductType(typeKey) : []), [typeKey])

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (!files.length) return
    setImageFiles((prev) => [...prev, ...files])
    // optimistic local previews
    const newUrls = files.map((f) => URL.createObjectURL(f))
    setImageUrls((prev) => [...prev, ...newUrls])
  }

  const removeImageAt = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImageUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleDynamicChange = (name: string, value: any) => {
    setDynamicValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Name is required' }))
      return
    }
    if (!description.trim()) {
      dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Please add a description' }))
      return
    }
    if (!selectedTypeId) {
      dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Please select a product type' }))
      return
    }
    if (!selectedCategoryId) {
      dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Please select a category' }))
      return
    }
    
    // Additional validation for perfume products
    if (typeKey === "perfume") {
      if (!dynamicValues.gender) {
        dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Please specify gender' }))
        return
      }
      if (!dynamicValues.concentration) {
        dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Please add a concentration' }))
        return
      }
      if (!dynamicValues.size) {
        dispatch(showModal({ type: 'error', title: 'Validation Error', message: 'Please add a size' }))
        return
      }
    }

    try {
      // Upload images if any
      let uploadedUrls: string[] = []
      if (imageFiles.length) {
        const formData = new FormData()
        imageFiles.forEach((file) => formData.append("images", file))
        const res = await uploadImages(formData).unwrap()
        uploadedUrls = res?.data?.urls ?? []
      }

      // Map dynamic values to server fields when type is perfume
      const payload: any = {
        name,
        brand,
        description,
        price: Number(price) || 0,
        originalPrice: originalPrice === "" ? undefined : Number(originalPrice),
        category: selectedCategoryId,
        stockCount: Number(stockCount) || 0,
        inStock,

      }

      if (uploadedUrls.length) {
        payload.images = uploadedUrls
        // keep backward compatibility for single image field
        payload.image = uploadedUrls[0]
      }

      if (typeKey === "perfume") {
        // Expected by Perfume schema on server
        if (dynamicValues.size) payload.size = dynamicValues.size
        if (dynamicValues.concentration) payload.concentration = dynamicValues.concentration
        if (dynamicValues.gender) payload.gender = dynamicValues.gender
        if (dynamicValues.topNotes)
          payload.topNotes = Array.isArray(dynamicValues.topNotes)
            ? dynamicValues.topNotes
            : String(dynamicValues.topNotes)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
        if (dynamicValues.middleNotes)
          payload.middleNotes = Array.isArray(dynamicValues.middleNotes)
            ? dynamicValues.middleNotes
            : String(dynamicValues.middleNotes)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
        if (dynamicValues.baseNotes)
          payload.baseNotes = Array.isArray(dynamicValues.baseNotes)
            ? dynamicValues.baseNotes
            : String(dynamicValues.baseNotes)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
      } else {
        // For other types, store in specifications for future models
        if (Object.keys(dynamicValues).length) {
          payload.specifications = dynamicValues
        }
      }

      const created = await createProduct(payload).unwrap()
      dispatch(showModal({ 
        type: 'success', 
        title: 'Product created', 
        message: `${created?.data?.name} has been added successfully` 
      }))
      router.push("/admin/inventory")
    } catch (err: any) {
      dispatch(showModal({ 
        type: 'error', 
        title: 'Failed to create product', 
        message: err?.data?.error || 'Unexpected error occurred' 
      }))
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold font-playfair gradient-text">Add Product</h1>
              <p className="text-muted-foreground">Create a new product and set its details</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/inventory">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </Link>
              <Button onClick={handleSubmit} disabled={isCreating || isUploading} className="gradient-primary text-white">
                {isCreating || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                    <Input id="originalPrice" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="stockCount">Stock Count</Label>
                    <Input id="stockCount" type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value === "" ? "" : Number(e.target.value))} />
                  </div>
                </div>
                {/* Rating, reviews, and badge are managed by the backend */}
                <div className="flex items-center space-x-2">
                  <Switch id="inStock" checked={inStock} onCheckedChange={setInStock} />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </CardContent>
            </Card>

            {/* Classification */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Product Type</Label>
                    <Select value={selectedTypeId} onValueChange={(v) => setSelectedTypeId(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((t: any) => (
                          <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={selectedCategoryId} onValueChange={(v) => setSelectedCategoryId(v)} disabled={!selectedTypeId}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedTypeId ? "Select category" : "Select type first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c: any) => (
                          <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic fields */}
            {fields.length > 0 && (
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>{field.label}{field.required ? " *" : ""}</Label>
                      {field.type === "text" && (
                        <Input value={dynamicValues[field.name] ?? ""} onChange={(e) => handleDynamicChange(field.name, e.target.value)} placeholder={field.placeholder} />
                      )}
                      {field.type === "number" && (
                        <Input type="number" value={dynamicValues[field.name] ?? ""} onChange={(e) => handleDynamicChange(field.name, e.target.value === "" ? "" : Number(e.target.value))} placeholder={field.placeholder} />
                      )}
                      {field.type === "textarea" && (
                        <Textarea value={dynamicValues[field.name] ?? ""} onChange={(e) => handleDynamicChange(field.name, e.target.value)} placeholder={field.placeholder} />
                      )}
                      {field.type === "select" && (
                        <Select value={dynamicValues[field.name] ?? ""} onValueChange={(v) => handleDynamicChange(field.name, v)}>
                          <SelectTrigger>
                            <SelectValue placeholder={field.placeholder || "Select"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(field.options || []).map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {field.type === "multiselect" && (
                        <Input
                          value={Array.isArray(dynamicValues[field.name]) ? (dynamicValues[field.name] as string[]).join(", ") : (dynamicValues[field.name] ?? "")}
                          onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                          placeholder={field.placeholder || "Comma separated values"}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Images */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Button asChild variant="outline">
                      <label htmlFor="images" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" /> Choose Files
                      </label>
                    </Button>
                    <input id="images" type="file" accept="image/*" multiple className="hidden" onChange={onPickImages} />
                    {(isUploading || isCreating) && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-md overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 shadow hidden group-hover:block"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}
