"use client"

import { useState, useMemo, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useCreateProductMutation,
  useUploadProductImagesMutation,
} from "@/store/api/productsApi"
import { useGetProductTypesQuery } from "@/store/api/productTypesApi"
import { useGetCategoriesQuery } from "@/store/api/categoriesApi"

export default function AdminInventoryAddPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [description, setDescription] = useState("")
  const [inStock, setInStock] = useState(true)
  const [stockCount, setStockCount] = useState("")
  const [typeId, setTypeId] = useState<string>("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const { data: typesResp, isLoading: loadingTypes } = useGetProductTypesQuery()
  const { data: categoriesResp, isLoading: loadingCategories } = useGetCategoriesQuery(
    typeId ? { productType: typeId } : undefined
  )

  const productTypes = typesResp?.data ?? []
  const categories = categoriesResp?.data ?? []

  const canSubmit = useMemo(() => {
    return (
      !!name.trim() &&
      !!brand.trim() &&
      !!price &&
      !!categoryId &&
      !!description.trim() &&
      stockCount !== "" &&
      files.length > 0
    )
  }, [name, brand, price, categoryId, description, stockCount, files])

  const [createProduct, { isLoading: creating }] = useCreateProductMutation()
  const [uploadImages, { isLoading: uploading }] = useUploadProductImagesMutation()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      let imageUrls: string[] = []
      if (files.length > 0) {
        const fd = new FormData()
        files.forEach((f) => fd.append("images", f))
        const uploaded = await uploadImages(fd).unwrap()
        imageUrls = uploaded?.data?.urls ?? []
      }

      const payload: any = {
        name: name.trim(),
        brand: brand.trim(),
        description: description.trim(),
        price: Number(price),
        category: categoryId, // backend accepts id or name and stores name
        inStock,
        stockCount: stockCount ? Number(stockCount) : undefined,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        images: imageUrls.length ? imageUrls : undefined,
      }

      await createProduct(payload).unwrap()
      // Success modal is shown globally by baseQueryWithModal
      router.push("/admin/inventory")
    } catch (err) {
      // Errors are surfaced by global modal; keep form enabled for edits
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Royal Oud" required />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Creed" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99.99" required />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (optional)</Label>
                    <Input id="originalPrice" type="number" min="0" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="129.99" />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" min="0" step="1" value={stockCount} onChange={(e) => setStockCount(e.target.value)} placeholder="100" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product..." rows={6} required />
                </div>

                <div>
                  <Label>Images</Label>
                  <Input type="file" multiple accept="image/*" onChange={handleFileChange} required />
                  {files.length > 0 && (
                    <div className="mt-3 text-sm text-muted-foreground">{files.length} file(s) selected</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-1 space-y-5">
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select value={typeId} onValueChange={(v) => { setTypeId(v); setCategoryId("") }}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={loadingTypes ? "Loading..." : "Select a type"} /></SelectTrigger>
                    <SelectContent>
                      {productTypes.map((t: any) => (
                        <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={loadingCategories ? "Loading..." : (typeId ? "Select a category" : "Select a type first")} /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <Label htmlFor="inStock" className="cursor-pointer">In Stock</Label>
                  </div>
                  <Switch id="inStock" checked={inStock} onCheckedChange={setInStock} />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={!canSubmit || submitting || creating || uploading}>
                    {submitting || creating || uploading ? "Adding..." : "Add Product"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => router.push("/admin/inventory")}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
