"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Grid, List } from "lucide-react"
// import { allProducts } from "@/lib/product-data"
import { Navbar } from "@/components/layouts/navbar"
import { ProductSort } from "@/components/products/product-sort"
import { ProductFilters } from "@/components/products/product-filters"
import { Product as UIProduct, ProductCard } from "@/components/products/product-card"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { useGetProductsQuery } from "@/store/api/productsApi"
import type { Product as ApiProduct } from "@/store/apiTypes"
import { useGetProductTypesQuery } from "@/store/api/productTypesApi"
import { useGetCategoriesQuery } from "@/store/api/categoriesApi"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || (() => {
  try {
    return API_URL ? new URL(API_URL).origin : ""
  } catch {
    return ""
  }
})()
const toImageUrl = (src?: string) => {
  if (!src) return "/placeholder.svg"
  if (/^https?:\/\//i.test(src)) return src
  const path = src.startsWith("/") ? src : `/${src}`
  return `${SERVER_URL}${path}`
}

const toUIProduct = (p: ApiProduct): UIProduct => ({
  id: p._id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice,
  image: toImageUrl(p.images?.[0]),
  rating: undefined,
  reviews: undefined,
  badge: undefined,
  // Pass through any string type so new product types display correctly
  type: p.type,
})

export default function ProductsPage() {
  const { data, isLoading, error } = useGetProductsQuery({ limit: 1000 })
  const { data: typesResp } = useGetProductTypesQuery()

  const [baseProducts, setBaseProducts] = useState<ApiProduct[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTypeId, setSelectedTypeId] = useState<string | "all">("all")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch categories for the selected type (used to filter products by type via category membership)
  const { data: typeCategoriesResp } = useGetCategoriesQuery(
    selectedTypeId === "all" ? undefined : { productType: selectedTypeId }
  )

  const typeCategoryNames = useMemo(
    () => new Set((typeCategoriesResp?.data ?? []).map((c: any) => String(c.name))),
    [typeCategoriesResp]
  )

  useEffect(() => {
    if (data?.data) {
      setBaseProducts(data.data)
      setProducts(data.data)
    }
  }, [data])

  // Pre-filter products for counts/brands within selected type scope (no search/brand/category applied)
  const typeScopedProducts = useMemo(() => {
    if (selectedTypeId === "all") return baseProducts
    if (!typeCategoryNames.size) return []
    return baseProducts.filter((p) => typeCategoryNames.has(String(p.category)))
  }, [baseProducts, selectedTypeId, typeCategoryNames])

  useEffect(() => {
    let filtered: ApiProduct[] = [...baseProducts]

    // Filter by selected type via categories list
    if (selectedTypeId !== "all") {
      filtered = filtered.filter((product) => typeCategoryNames.has(String(product.category)))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          (product.brand?.toLowerCase()?.includes(q) ?? false) ||
          (product.category?.toLowerCase()?.includes(q) ?? false),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => (product.category || "").toLowerCase() === selectedCategory.toLowerCase())
    }

    if (selectedBrand) {
      filtered = filtered.filter((product) => (product.brand || "").toLowerCase() === selectedBrand.toLowerCase())
    }

    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        break
    }

    setProducts(filtered)
  }, [baseProducts, searchQuery, selectedCategory, selectedBrand, selectedTypeId, typeCategoryNames, priceRange, sortBy])

  const productTypes = typesResp?.data ?? []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-playfair gradient-text mb-4">All Products</h1>
          <p className="text-muted-foreground mb-8">
            Discover our complete collection of luxury products
          </p>
        </motion.div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-sm text-muted-foreground mb-4">Loading products...</div>
        )}
        {error && !isLoading && (
          <div className="text-sm text-red-500 mb-4">Failed to load products.</div>
        )}

        {/* Type Filter Tabs (Dynamic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-50 dark:to-orange-50 p-2 rounded-full border border-primary overflow-x-auto max-w-full">
            <Button
              variant={selectedTypeId === "all" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full ${
                selectedTypeId === "all" ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
              }`}
              onClick={() => {
                setSelectedTypeId("all")
                setSelectedCategory("")
                setSelectedBrand("")
              }}
            >
              All Products
            </Button>
            {productTypes.map((t: any) => (
              <Button
                key={t._id}
                variant={selectedTypeId === t._id ? "default" : "ghost"}
                size="sm"
                className={`rounded-full ${
                  selectedTypeId === t._id ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
                }`}
                onClick={() => {
                  setSelectedTypeId(t._id)
                  setSelectedCategory("")
                  setSelectedBrand("")
                }}
              >
                {t.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-primary/20 hover:bg-primary/5"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <ProductSort value={sortBy} onChange={setSortBy} />

            <div className="flex border rounded-md border-primary/20">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-r-none ${
                  viewMode === "grid" ? "gradient-primary text-white border-0" : "hover:bg-primary/5"
                }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-l-none ${
                  viewMode === "list" ? "gradient-primary text-white border-0" : "hover:bg-primary/5"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"} w-full lg:w-64 shrink-0`}>
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedTypeId={selectedTypeId}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              products={typeScopedProducts}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
            />
          </div>

        {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {products.length} products
            </div>

            <motion.div
              layout
              className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6" : "space-y-4"}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={toUIProduct(product)} />
                </motion.div>
              ))}
            </motion.div>

            {products.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("")
                    setSelectedTypeId("all")
                    setSelectedBrand("")
                    setPriceRange([0, 5000])
                  }}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
