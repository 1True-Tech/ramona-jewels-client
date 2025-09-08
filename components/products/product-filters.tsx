"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useGetCategoriesQuery } from "@/store/api/categoriesApi"
import type { Product as ApiProduct } from "@/store/apiTypes"

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  // Selected product type id or 'all'
  selectedTypeId: string | "all"
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
  // Products list within the selected type scope to compute counts/brands
  products: ApiProduct[]
  selectedBrand: string
  onBrandChange: (brand: string) => void
}

const ratings = [
  { stars: 5, count: 89 },
  { stars: 4, count: 45 },
  { stars: 3, count: 23 },
  { stars: 2, count: 8 },
  { stars: 1, count: 2 },
]

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  selectedTypeId,
  priceRange,
  onPriceRangeChange,
  products,
  selectedBrand,
  onBrandChange,
}: ProductFiltersProps) {
  // Fetch categories from backend based on selected product type
  const { data: categoriesResp, isLoading: categoriesLoading } = useGetCategoriesQuery(
    selectedTypeId === "all" ? undefined : { productType: selectedTypeId }
  )

  const categories = useMemo(() => categoriesResp?.data ?? [], [categoriesResp])

  // Compute counts by category name from provided products
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) {
      const key = (p.category || "").toString()
      if (!key) continue
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return counts
  }, [products])

  // Derive brand options and counts from products
  const brands = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) {
      const b = (p.brand || "").toString()
      if (!b) continue
      counts.set(b, (counts.get(b) || 0) + 1)
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }))
  }, [products])

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category-all" className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                id="category-all"
                checked={selectedCategory === ""}
                onCheckedChange={() => onCategoryChange("")}
                disabled={categoriesLoading}
              />
              <span>All Categories</span>
            </Label>
            <Badge variant="outline" className="text-xs">
              {products.length}
            </Badge>
          </div>
          {categories.map((category: any) => {
            const isChecked = selectedCategory.toLowerCase() === (category?.name || "").toLowerCase()
            const count = categoryCounts.get(category?.name) || 0
            return (
              <div key={category._id} className="flex items-center justify-between">
                <Label htmlFor={`category-${category._id}`} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={isChecked}
                    onCheckedChange={() => onCategoryChange(category.name)}
                    disabled={categoriesLoading}
                  />
                  <span className="capitalize">{category.name}</span>
                </Label>
                <Badge variant="outline" className="text-xs">
                  {count}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            max={5000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-4">Brands</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`brand-all`} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox id={`brand-all`} checked={selectedBrand === ""} onCheckedChange={() => onBrandChange("")} />
              <span>All Brands</span>
            </Label>
            <Badge variant="outline" className="text-xs">{products.length}</Badge>
          </div>
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-between">
              <Label htmlFor={`brand-${brand.name}`} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id={`brand-${brand.name}`}
                  checked={selectedBrand.toLowerCase() === brand.name.toLowerCase()}
                  onCheckedChange={() => onBrandChange(brand.name)}
                />
                <span>{brand.name}</span>
              </Label>
              <Badge variant="outline" className="text-xs">
                {brand.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-4">Customer Rating</h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div key={rating.stars} className="flex items-center justify-between">
              <Label htmlFor={`rating-${rating.stars}`} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id={`rating-${rating.stars}`} />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < rating.stars ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </span>
                  ))}
                  <span className="ml-1">& up</span>
                </div>
              </Label>
              <Badge variant="outline" className="text-xs">
                {rating.count}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
