"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Grid, List, Gem, Sparkles } from "lucide-react"
import { allProducts } from "@/lib/product-data"
import { Navbar } from "@/components/layouts/navbar"
import { ProductSort } from "@/components/products/product-sort"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductCard } from "@/components/products/product-card"
import { MobileNav } from "@/components/layouts/mobile-nav"

export default function ProductsPage() {
  const [products, setProducts] = useState(allProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "jewelry" | "perfume">("all")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = allProducts

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

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      default:
        break
    }

    setProducts(filtered)
  }, [searchQuery, selectedCategory, selectedType, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-playfair gradient-text mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of luxury jewelry and premium fragrances
          </p>
        </motion.div>

        {/* Type Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-2 rounded-full border border-primary/20">
            <Button
              variant={selectedType === "all" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full ${
                selectedType === "all" ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedType("all")}
            >
              All Products
            </Button>
            <Button
              variant={selectedType === "jewelry" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full ${
                selectedType === "jewelry" ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedType("jewelry")}
            >
              <Gem className="h-4 w-4 mr-2" />
              Jewelry
            </Button>
            <Button
              variant={selectedType === "perfume" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full ${
                selectedType === "perfume" ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedType("perfume")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Perfumes
            </Button>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jewelry & fragrances..."
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
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {products.length}{" "}
              {selectedType === "all" ? "products" : selectedType === "jewelry" ? "jewelry pieces" : "fragrances"}
            </div>

            <motion.div
              layout
              className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {products.length === 0 && (
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
                    setSelectedType("all")
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
