"use client"

import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Gem, Sparkles } from "lucide-react"
import { jewelryCategories, perfumeCategories } from "@/lib/product-data"

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedType: "all" | "jewelry" | "perfume"
- onTypeChange: (type: "all" | "jewelry" | "perfume") => void
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
}

const brands = [
  { id: "luxe-atelier", name: "Luxe Atelier", count: 23, type: "jewelry" },
  { id: "atelier-rose", name: "Atelier Rose", count: 18, type: "jewelry" },
  { id: "royal-gems", name: "Royal Gems", count: 15, type: "jewelry" },
  { id: "ocean-pearls", name: "Ocean Pearls", count: 12, type: "jewelry" },
  { id: "luxury-scents", name: "Luxury Scents", count: 25, type: "perfume" },
  { id: "aqua-fragrances", name: "Aqua Fragrances", count: 20, type: "perfume" },
  { id: "oriental-luxe", name: "Oriental Luxe", count: 15, type: "perfume" },
]

// Materials and gemstones should come from backend data
// Removed mock data arrays

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
  selectedType,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  const getCategories = () => {
    if (selectedType === "jewelry") return jewelryCategories
    if (selectedType === "perfume") return perfumeCategories
    return [...jewelryCategories, ...perfumeCategories]
  }

  const getBrands = () => {
    if (selectedType === "all") return brands
    return brands.filter((brand) => brand.type === selectedType)
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          {selectedType === "jewelry" ? (
            <Gem className="h-4 w-4 text-primary" />
          ) : selectedType === "perfume" ? (
            <Sparkles className="h-4 w-4 text-primary" />
          ) : null}
          <span>Categories</span>
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category-all" className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                id="category-all"
                checked={selectedCategory === ""}
                onCheckedChange={() => onCategoryChange("")}
              />
              <span>All Categories</span>
            </Label>
            <Badge variant="outline" className="text-xs">
              {getCategories().reduce((sum, cat) => sum + cat.productCount, 0)}
            </Badge>
          </div>
          {getCategories().map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <Label htmlFor={`category-${category.id}`} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.id}
                  onCheckedChange={() => onCategoryChange(category.id)}
                />
                <span className="capitalize">{category.name}</span>
              </Label>
              <Badge variant="outline" className="text-xs">
                {category.productCount}
              </Badge>
            </div>
          ))}
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
          {getBrands().map((brand) => (
            <div key={brand.id} className="flex items-center justify-between">
              <Label htmlFor={`brand-${brand.id}`} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id={`brand-${brand.id}`} />
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

      {/* Jewelry-specific filters */}
      {(selectedType === "all" || selectedType === "jewelry") && (
        <>
          {/* Materials and Gemstones filters removed - should come from backend */}
        </>
      )}

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
