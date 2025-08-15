"use client"

import { useState } from "react"
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
  List
} from "lucide-react"
import { productTypes } from "@/lib/categories-data"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isAddingProductType, setIsAddingProductType] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newProductType, setNewProductType] = useState({
    name: "",
    label: "",
    description: "",
    icon: ""
  })
  const [newCategory, setNewCategory] = useState({
    name: "",
    label: "",
    description: "",
    productTypeId: ""
  })

  const filteredProductTypes = productTypes.filter(type =>
    type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProductType = () => {
    // In a real app, this would be an API call
    console.log("Adding product type:", newProductType)
    toast({
      title: "Product Type Added",
      description: `${newProductType.label} has been added successfully.`
    })
    setIsAddingProductType(false)
    setNewProductType({ name: "", label: "", description: "", icon: "" })
  }

  const handleAddCategory = () => {
    // In a real app, this would be an API call
    console.log("Adding category:", newCategory)
    toast({
      title: "Category Added",
      description: `${newCategory.label} has been added successfully.`
    })
    setIsAddingCategory(false)
    setNewCategory({ name: "", label: "", description: "", productTypeId: "" })
  }

  const handleDeleteProductType = (productTypeId: string) => {
    // In a real app, this would be an API call
    console.log("Deleting product type:", productTypeId)
    toast({
      title: "Product Type Deleted",
      description: "The product type has been deleted successfully."
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    // In a real app, this would be an API call
    console.log("Deleting category:", categoryId)
    toast({
      title: "Category Deleted",
      description: "The category has been deleted successfully."
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          
        >
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
                  <DialogDescription>
                    Create a new product type with its own set of categories
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productTypeName">Name</Label>
                    <Input
                      id="productTypeName"
                      value={newProductType.name}
                      onChange={(e) => setNewProductType({ ...newProductType, name: e.target.value })}
                      placeholder="e.g., electronics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productTypeLabel">Label</Label>
                    <Input
                      id="productTypeLabel"
                      value={newProductType.label}
                      onChange={(e) => setNewProductType({ ...newProductType, label: e.target.value })}
                      placeholder="e.g., Electronics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productTypeIcon">Icon (Emoji)</Label>
                    <Input
                      id="productTypeIcon"
                      value={newProductType.icon}
                      onChange={(e) => setNewProductType({ ...newProductType, icon: e.target.value })}
                      placeholder="e.g., 📱"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productTypeDescription">Description</Label>
                    <Textarea
                      id="productTypeDescription"
                      value={newProductType.description}
                      onChange={(e) => setNewProductType({ ...newProductType, description: e.target.value })}
                      placeholder="Describe this product type..."
                    />
                  </div>
                  <Button onClick={handleAddProductType} className="w-full">
                    Add Product Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
            </div>
        </motion.div>

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search product types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            </div>
            </div>
        </motion.div>

        {/* Product Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProductTypes.map((productType, index) => (
                <motion.div
                  key={productType.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{productType.icon}</div>
                          <div>
                            <CardTitle className="text-lg">{productType.label}</CardTitle>
                            <CardDescription>{productType.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProductType(productType.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Categories</span>
                          <Badge variant="secondary">{productType.categories.length}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {productType.categories.slice(0, 3).map((category) => (
                            <Badge key={category.id} variant="outline" className="text-xs">
                              {category.label}
                            </Badge>
                          ))}
                          {productType.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{productType.categories.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Tag className="h-3 w-3 mr-1" />
                                Manage Categories
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{productType.label} Categories</DialogTitle>
                                <DialogDescription>
                                  Manage categories for {productType.label}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Categories ({productType.categories.length})</h4>
                                  <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                                    <DialogTrigger asChild>
                                      <Button size="sm" onClick={() => setNewCategory({ ...newCategory, productTypeId: productType.id })}>
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Category
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Add New Category</DialogTitle>
                                        <DialogDescription>
                                          Add a new category to {productType.label}
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="categoryName">Name</Label>
                                          <Input
                                            id="categoryName"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            placeholder="e.g., smartphones"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="categoryLabel">Label</Label>
                                          <Input
                                            id="categoryLabel"
                                            value={newCategory.label}
                                            onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                                            placeholder="e.g., Smartphones"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="categoryDescription">Description</Label>
                                          <Textarea
                                            id="categoryDescription"
                                            value={newCategory.description}
                                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                            placeholder="Describe this category..."
                                          />
                                        </div>
                                        <Button onClick={handleAddCategory} className="w-full">
                                          Add Category
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {productType.categories.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <h5 className="font-medium">{category.label}</h5>
                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-destructive hover:text-destructive"
                                          onClick={() => handleDeleteCategory(category.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredProductTypes.map((productType, index) => (
                    <motion.div
                      key={productType.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{productType.icon}</div>
                          <div>
                            <h3 className="font-medium">{productType.label}</h3>
                            <p className="text-sm text-muted-foreground">{productType.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{productType.categories.length} categories</Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteProductType(productType.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                       </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}