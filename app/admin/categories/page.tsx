"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2,  
  Tag,
  Search,
  Grid,
  List,
  Loader2
} from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { useAuth } from "@/contexts/redux-auth-context"
import { useRouter } from "next/navigation"
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api/categoriesApi"
import {
  useGetProductTypesQuery,
  useCreateProductTypeMutation,
  useDeleteProductTypeMutation,
} from "@/store/api/productTypesApi"

export default function CategoriesPage() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Product Type dialogs and state
  const [isAddingProductType, setIsAddingProductType] = useState(false)
  const [newProductType, setNewProductType] = useState({ name: "", description: "", icon: "" })

  // Manage Categories for a selected Product Type
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
  const [isManagingCategories, setIsManagingCategories] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<any>(null)

  // API hooks
  const { data: productTypesData, isLoading: isLoadingTypes, error: typesError, refetch: refetchTypes } = useGetProductTypesQuery()
  const [createProductType, { isLoading: isCreatingType }] = useCreateProductTypeMutation()
  const [deleteProductType, { isLoading: isDeletingType }] = useDeleteProductTypeMutation()

  // Fetch all categories once and group by productType for summary chips
  const { data: categoriesData, isLoading: isLoadingCategories, refetch: refetchCategories } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  const productTypes = productTypesData?.data || []
  const categories = categoriesData?.data || []

  const groupedCategories = useMemo(() => {
    const map: Record<string, typeof categories> = {}
    for (const c of categories) {
      const key = c.productType || "unknown"
      if (!map[key]) map[key] = []
      map[key].push(c)
    }
    return map
  }, [categories])

  const filteredTypes = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return productTypes.filter((t: any) =>
      t.name.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
    )
  }, [searchTerm, productTypes])

  const handleAddProductType = async () => {
    if (!newProductType.name.trim()) {
      dispatch(showModal({ type: 'error', title: 'Error', message: 'Product type name is required.' }))
      return
    }
    try {
      await createProductType(newProductType as any).unwrap()
      dispatch(showModal({ type: 'success', title: 'Product Type Added', message: `${newProductType.name} has been added successfully.` }))
      setIsAddingProductType(false)
      setNewProductType({ name: "", description: "", icon: "" })
      refetchTypes()
    } catch (error: any) {
      dispatch(showModal({ type: 'error', title: 'Error', message: error.data?.message || 'Failed to add product type.' }))
    }
  }

  const openManageCategories = (typeId: string) => {
    setSelectedTypeId(typeId)
    setIsManagingCategories(true)
    setNewCategory({ name: "", description: "" })
    setEditingCategory(null)
  }

  const handleAddCategory = async () => {
    if (!selectedTypeId) return
    if (!newCategory.name.trim()) {
      dispatch(showModal({ type: 'error', title: 'Error', message: 'Category name is required.' }))
      return
    }
    try {
      await createCategory({ ...newCategory, productType: selectedTypeId }).unwrap()
      dispatch(showModal({ type: 'success', title: 'Category Added', message: `${newCategory.name} has been added successfully.` }))
      setNewCategory({ name: "", description: "" })
      refetchCategories()
    } catch (error: any) {
      dispatch(showModal({ type: 'error', title: 'Error', message: error.data?.message || 'Failed to add category.' }))
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name?.trim()) {
      dispatch(showModal({ type: 'error', title: 'Error', message: 'Category name is required.' }))
      return
    }
    try {
      await updateCategory({ id: editingCategory._id, data: { name: editingCategory.name, description: editingCategory.description } }).unwrap()
      dispatch(showModal({ type: 'success', title: 'Category Updated', message: `${editingCategory.name} has been updated successfully.` }))
      setEditingCategory(null)
      refetchCategories()
    } catch (error: any) {
      dispatch(showModal({ type: 'error', title: 'Error', message: error.data?.message || 'Failed to update category.' }))
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) return
    try {
      await deleteCategory(categoryId).unwrap()
      dispatch(showModal({ type: 'success', title: 'Category Deleted', message: 'The category has been deleted successfully.' }))
      refetchCategories()
    } catch (error: any) {
      dispatch(showModal({ type: 'error', title: 'Error', message: error.data?.message || 'Failed to delete category.' }))
    }
  }

  const handleDeleteProductType = async (typeId: string, name: string) => {
    if (!confirm(`Delete product type "${name}"? This cannot be undone.`)) return
    try {
      await deleteProductType(typeId).unwrap()
      dispatch(showModal({ type: 'success', title: 'Product Type Deleted', message: `${name} has been deleted.` }))
      refetchTypes()
      refetchCategories()
    } catch (error: any) {
      dispatch(showModal({ type: 'error', title: 'Error', message: error.data?.message || 'Failed to delete product type.' }))
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (isLoadingTypes || isLoadingCategories) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  if (typesError) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Error Loading Product Types</h2>
          <p className="text-muted-foreground mb-4">Failed to load product types. Please try again.</p>
          <Button onClick={() => { refetchTypes(); refetchCategories(); }}>Retry</Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Categories Management</h1>
              <p className="text-muted-foreground">Manage product types and their categories</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddingProductType} onOpenChange={setIsAddingProductType}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product Type</DialogTitle>
                    <DialogDescription>Create a new product type to organize categories</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="typeName">Name</Label>
                      <Input id="typeName" value={newProductType.name} onChange={(e) => setNewProductType({ ...newProductType, name: e.target.value })} placeholder="e.g., Jewelry" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="typeDescription">Description</Label>
                      <Textarea id="typeDescription" value={newProductType.description} onChange={(e) => setNewProductType({ ...newProductType, description: e.target.value })} placeholder="Describe this product type..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="typeIcon">Icon (emoji or class)</Label>
                      <Input id="typeIcon" value={newProductType.icon} onChange={(e) => setNewProductType({ ...newProductType, icon: e.target.value })} placeholder="e.g., 💎" />
                    </div>
                    <Button onClick={handleAddProductType} className="w-full" disabled={isCreatingType}>
                      {isCreatingType ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</>) : ("Add Product Type")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Search and View Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search product types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Product Types Grid/List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {filteredTypes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No product types found</h3>
                <p className="text-muted-foreground mb-4">{searchTerm ? "No product types match your search." : "Get started by creating your first product type."}</p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddingProductType(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Type
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTypes.map((type: any, index: number) => {
                const typeCategories = groupedCategories[type._id] || []
                const visible = typeCategories.slice(0, 3)
                const remaining = typeCategories.length - visible.length
                return (
                  <motion.div key={type._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-xl">
                              {type.icon || "📦"}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{type.name}</CardTitle>
                              <CardDescription className="line-clamp-2">{type.description || "No description"}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteProductType(type._id, type.name)} disabled={isDeletingType}>
                              {isDeletingType ? (<Loader2 className="h-3 w-3 animate-spin" />) : (<Trash2 className="h-3 w-3" />)}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Categories</p>
                            <div className="flex flex-wrap gap-2">
                              {visible.map((c) => (
                                <Badge key={c._id} variant="secondary">{c.name}</Badge>
                              ))}
                              {remaining > 0 && (
                                <Badge variant="outline">+{remaining} more</Badge>
                              )}
                              {typeCategories.length === 0 && (
                                <span className="text-xs text-muted-foreground">No categories yet</span>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => openManageCategories(type._id)}>Manage Categories</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredTypes.map((type: any, index: number) => {
                    const typeCategories = groupedCategories[type._id] || []
                    return (
                      <motion.div key={type._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                        <div className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-primary/10 rounded-lg text-xl">{type.icon || "📦"}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{type.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{type.description || "No description"}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  {typeCategories.slice(0, 6).map((c) => (
                                    <Badge key={c._id} variant="secondary" className="text-xs">{c.name}</Badge>
                                  ))}
                                  {typeCategories.length === 0 && (<span className="text-xs text-muted-foreground">No categories yet</span>)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" onClick={() => openManageCategories(type._id)}>Manage Categories</Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteProductType(type._id, type.name)} disabled={isDeletingType}>
                                {isDeletingType ? (<Loader2 className="h-3 w-3 animate-spin" />) : (<Trash2 className="h-3 w-3" />)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Manage Categories Dialog */}
        <Dialog open={isManagingCategories} onOpenChange={(open) => { setIsManagingCategories(open); if (!open) { setSelectedTypeId(null); setEditingCategory(null); } }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Categories</DialogTitle>
              <DialogDescription>Add, edit, or remove categories for this product type</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* List existing categories for selected type */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Existing Categories</p>
                <div className="space-y-2 max-h-64 overflow-auto pr-1">
                  {(categories.filter((c) => c.productType === selectedTypeId)).length === 0 ? (
                    <div className="text-sm text-muted-foreground">No categories yet</div>
                  ) : (
                    categories.filter((c) => c.productType === selectedTypeId).map((category) => (
                      <div key={category._id} className="flex items-center justify-between rounded-md border p-2">
                        {editingCategory?._id === category._id ? (
                          <div className="flex-1 mr-2 space-y-2">
                            <Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                            <Textarea value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} placeholder="Description" />
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-muted-foreground">{category.description || "No description"}</div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-2">
                          {editingCategory?._id === category._id ? (
                            <Button size="sm" onClick={handleUpdateCategory} disabled={isUpdatingCategory}>
                              {isUpdatingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingCategory(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(category._id, category.name)} disabled={isDeletingCategory}>
                            {isDeletingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add category form */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="e.g., Rings" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryDescription">Description</Label>
                  <Textarea id="categoryDescription" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Describe this category..." />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddCategory} disabled={isCreatingCategory || !selectedTypeId}>
                    {isCreatingCategory ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</>) : ("Add Category")}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}