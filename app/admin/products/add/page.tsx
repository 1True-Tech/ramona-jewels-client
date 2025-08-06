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
import { ArrowLeft, Upload, Plus, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  size: z.string().min(1, "Size is required"),
  concentration: z.enum(["EDT", "EDP", "Parfum", "EDC"]),
  gender: z.enum(["Men", "Women", "Unisex"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stockCount: z.number().min(0, "Stock count must be 0 or greater"),
  inStock: z.boolean(),
})

type ProductForm = z.infer<typeof productSchema>

export default function AddProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
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
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      inStock: true,
      concentration: "EDP",
      gender: "Unisex",
    },
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

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

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      const newProduct = {
        ...data,
        id: Date.now().toString(),
        image: "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(data.name),
        rating: 0,
        reviews: 0,
        topNotes,
        middleNotes,
        baseNotes,
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
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

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
              <p className="text-muted-foreground">Create a new perfume listing</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-6"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="e.g., Midnight Rose" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g., Luxury Scents" {...register("brand")} />
                  {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the fragrance, its character, and appeal..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pricing</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="99.99"
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
                    placeholder="129.99"
                    {...register("originalPrice", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="floral">Floral</SelectItem>
                      <SelectItem value="oriental">Oriental</SelectItem>
                      <SelectItem value="woody">Woody</SelectItem>
                      <SelectItem value="citrus">Citrus</SelectItem>
                      <SelectItem value="aquatic">Aquatic</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concentration">Concentration</Label>
                  <Select onValueChange={(value) => setValue("concentration", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select concentration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EDT">EDT (Eau de Toilette)</SelectItem>
                      <SelectItem value="EDP">EDP (Eau de Parfum)</SelectItem>
                      <SelectItem value="Parfum">Parfum</SelectItem>
                      <SelectItem value="EDC">EDC (Eau de Cologne)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => setValue("gender", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input id="size" placeholder="e.g., 50ml, 100ml" {...register("size")} />
                  {errors.size && <p className="text-sm text-destructive">{errors.size.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockCount">Stock Count</Label>
                  <Input
                    id="stockCount"
                    type="number"
                    placeholder="25"
                    {...register("stockCount", { valueAsNumber: true })}
                  />
                  {errors.stockCount && <p className="text-sm text-destructive">{errors.stockCount.message}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={watch("inStock")}
                  onCheckedChange={(checked) => setValue("inStock", !!checked)}
                />
                <Label htmlFor="inStock">Product is in stock</Label>
              </div>
            </div>

            {/* Fragrance Notes */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Fragrance Notes</h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select value={noteType} onValueChange={(value) => setNoteType(value as any)}>
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
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNote())}
                  />
                  <Button type="button" onClick={addNote}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Top Notes</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {topNotes.map((note) => (
                        <div
                          key={note}
                          className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
                        >
                          {note}
                          <button type="button" onClick={() => removeNote(note, "top")}>
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Middle Notes</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {middleNotes.map((note) => (
                        <div
                          key={note}
                          className="flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm"
                        >
                          {note}
                          <button type="button" onClick={() => removeNote(note, "middle")}>
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Base Notes</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {baseNotes.map((note) => (
                        <div
                          key={note}
                          className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-sm"
                        >
                          {note}
                          <button type="button" onClick={() => removeNote(note, "base")}>
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Image</h2>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                <Button type="button" variant="outline" className="mt-4 bg-transparent">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? "Adding Product..." : "Add Product"}
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
