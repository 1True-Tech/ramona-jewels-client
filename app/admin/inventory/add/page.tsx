"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Plus, X, Image as ImageIcon } from "lucide-react"
import { useAuth } from "@/contexts/redux-auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { productTypes, getCategoriesByProductType, getFieldsByProductType } from "@/lib/categories-data"

// Base product schema
const baseProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().optional(),
  productType: z.string().min(1, "Product type is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stockCount: z.number().min(0, "Stock count must be 0 or greater"),
  inStock: z.boolean(),
})

// Dynamic schema that will be extended based on product type
const createProductSchema = (productType: string) => {
  const fields = getFieldsByProductType(productType)
  let schema = baseProductSchema

  fields.forEach(field => {
    if (field.required) {
      if (field.type === 'number') {
        // @ts-expect-error - schema shape is intentionally dynamic
        schema = schema.extend({
          [field.name]: z.number().min(0, `${field.label} is required`)
        })
      } else {
        // @ts-expect-error - schema shape is intentionally dynamic
        schema = schema.extend({
          [field.name]: z.string().min(1, `${field.label} is required`)
        })
      }
    } else {
      if (field.type === 'number') {
        // @ts-expect-error - schema shape is intentionally dynamic
        schema = schema.extend({
          [field.name]: z.number().optional()
        })
      } else {
        // @ts-expect-error - schema shape is intentionally dynamic
        schema = schema.extend({
          [field.name]: z.string().optional()
        })
      }
    }
  })

  return schema
}

type ProductForm = z.infer<ReturnType<typeof createProductSchema>>

export default function AddProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProductType, setSelectedProductType] = useState<string>("")
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [productTypeFields, setProductTypeFields] = useState<any[]>([])
  const [images, setImages] = useState<string[]>([])
  
  // Fragrance notes (only for perfumes)
  const [topNotes, setTopNotes] = useState<string[]>([])
  const [middleNotes, setMiddleNotes] = useState<string[]>([])
  const [baseNotes, setBaseNotes] = useState<string[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState<"top" | "middle" | "base">("top")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(selectedProductType ? createProductSchema(selectedProductType) : baseProductSchema),
    defaultValues: {
      inStock: true,
    },
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  // Update categories when product type changes
  useEffect(() => {
    if (selectedProductType) {
      const categories = getCategoriesByProductType(selectedProductType)
      const fields = getFieldsByProductType(selectedProductType)
      setAvailableCategories(categories)
      setProductTypeFields(fields)
      
      // Reset category when product type changes
      setValue("category", "")
      
      // Reset form with new schema
      reset({
        inStock: true,
        productType: selectedProductType
      })
    } else {
      setAvailableCategories([])
      setProductTypeFields([])
    }
  }, [selectedProductType, setValue, reset])

  const addNote = () => {
    if (!newNote.trim()) return

    switch (noteType) {
      case "top":
        setTopNotes([...topNotes, newNote.trim()])
        break
      case "middle":
        setMiddleNotes([...middleNotes, newNote.trim()])
        break
      case "base":
        setBaseNotes([...baseNotes, newNote.trim()])
        break
    }
    setNewNote("")
  }

  const removeNote = (note: string, type: "top" | "middle" | "base") => {
    switch (type) {
      case "top":
        setTopNotes(topNotes.filter((n) => n !== note))
        break
      case "middle":
        setMiddleNotes(middleNotes.filter((n) => n !== note))
        break
      case "base":
        setBaseNotes(baseNotes.filter((n) => n !== note))
        break
    }
  }

  const addImage = () => {
    // In a real app, this would open a file picker
    const newImage = `https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&random=${Date.now()}`
    setImages([...images, newImage])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      const newProduct = {
        ...data,
        id: Date.now().toString(),
        type: selectedProductType,
        images: images.length > 0 ? images : ["/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(data.name)],
        rating: 0,
        reviews: 0,
        ...(selectedProductType === 'perfumes' && {
          topNotes,
          middleNotes,
          baseNotes,
        }),
      }

      console.log("New product:", newProduct)

      toast({
        title: "Product added successfully!",
        description: `${data.name} has been added to your inventory.`,
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const selectedType = productTypes.find(type => type.id === selectedProductType)

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">Create a new product for your store</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Product Type</CardTitle>
                <CardDescription>Select the type of product you want to add</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedProductType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedProductType(type.id)
                        setValue("productType", type.id)
                      }}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-2xl">{type.icon}</div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.productType && (
                  <p className="text-sm text-destructive mt-2">{errors.productType.message}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {selectedProductType && (
            <>
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic details of your {selectedType?.label.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter product name"
                          {...register("name")}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          placeholder="Enter brand name"
                          {...register("brand")}
                        />
                        {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price ($) - Optional</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("originalPrice", { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the product, its features, and appeal..."
                        rows={4}
                        {...register("description")}
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Category Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Category</CardTitle>
                    <CardDescription>Select the category for your {selectedType?.label.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setValue("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Dynamic Product Fields */}
              {productTypeFields.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Details</CardTitle>
                      <CardDescription>Specific details for {selectedType?.label.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {productTypeFields.map((field) => (
                          <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name}>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            
                            {field.type === 'select' ? (
                              <Select onValueChange={(value) => setValue(field.name as any, value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === 'number' ? (
                              <Input
                                id={field.name}
                                type="number"
                                step={field.name.includes('price') ? '0.01' : '1'}
                                placeholder={field.placeholder}
                                {...register(field.name as any, { valueAsNumber: true })}
                              />
                            ) : (
                              <Input
                                id={field.name}
                                placeholder={field.placeholder}
                                {...register(field.name as any)}
                              />
                            )}
                            
                            {errors[field.name as keyof typeof errors] && (
                              <p className="text-sm text-destructive">
                                {errors[field.name as keyof typeof errors]?.message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Fragrance Notes - Only for perfumes */}
              {selectedProductType === 'perfumes' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Fragrance Notes</CardTitle>
                      <CardDescription>Add the fragrance notes for this perfume</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Add Note */}
                      <div className="flex gap-2">
                        <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="middle">Middle</SelectItem>
                            <SelectItem value="base">Base</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Enter note"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNote())}
                        />
                        <Button type="button" onClick={addNote}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Notes Display */}
                      <div className="space-y-4">
                        {[
                          { type: "top" as const, notes: topNotes, label: "Top Notes" },
                          { type: "middle" as const, notes: middleNotes, label: "Middle Notes" },
                          { type: "base" as const, notes: baseNotes, label: "Base Notes" },
                        ].map(({ type, notes, label }) => (
                          <div key={type} className="space-y-2">
                            <Label>{label}</Label>
                            <div className="flex flex-wrap gap-2">
                              {notes.map((note) => (
                                <Badge key={note} variant="secondary" className="gap-1">
                                  {note}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeNote(note, type)}
                                  />
                                </Badge>
                              ))}
                              {notes.length === 0 && (
                                <span className="text-sm text-muted-foreground">No {label.toLowerCase()} added</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Add images for your product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button type="button" variant="outline" onClick={addImage}>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                      
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stock Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Information</CardTitle>
                    <CardDescription>Manage inventory for this product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stockCount">Stock Count</Label>
                        <Input
                          id="stockCount"
                          type="number"
                          placeholder="0"
                          {...register("stockCount", { valueAsNumber: true })}
                        />
                        {errors.stockCount && <p className="text-sm text-destructive">{errors.stockCount.message}</p>}
                      </div>

                      <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                          id="inStock"
                          checked={watch("inStock")}
                          onCheckedChange={(checked) => setValue("inStock", !!checked)}
                        />
                        <Label htmlFor="inStock">In Stock</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4"
              >
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Adding Product..." : "Add Product"}
                </Button>
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </form>
      </div>
    </AdminLayout>
  )
}
