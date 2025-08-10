"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { allProducts } from "@/lib/product-data"
import { Gem, Sparkles } from "lucide-react"

export function TopProducts() {
  const topProducts = allProducts.slice(0, 6).map((product, index) => ({
    ...product,
    rank: index + 1,
    sales: Math.floor(Math.random() * 500) + 100,
    trend: Math.random() > 0.5 ? "up" : "down",
    trendValue: Math.floor(Math.random() * 20) + 5,
  }))

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">
        Bestselling Products
      </h3>

      <div className="overflow-x-auto rounded-t-xl overflow-y-hidden">
        <table className="min-w-full border-collapse rounded-xl">
          <thead className="border-b border-primary bg-amber-400 text-white">
            <tr className="bg-muted text-left text-sm font-medium">
              <th className="p-3">Rank</th>
              <th className="p-3">Product</th>
              <th className="p-3">Type</th>
              <th className="p-3">Category</th>
              <th className="p-3">Sales</th>
              <th className="p-3">Price</th>
              <th className="p-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-primary hover:bg-muted/50 transition-colors"
              >
                <td className="p-3 font-bold">{product.rank}</td>

                {/* Product Image + Name */}
                <td className="p-3 flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                    {product.name}
                  </span>
                </td>

                {/* Type */}
                <td className="p-3">
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    {product.type === "jewelry" ? (
                      <>
                        <Gem className="h-3 w-3" />
                        Jewelry
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Perfume
                      </>
                    )}
                  </Badge>
                </td>

                {/* Category */}
                <td className="p-3">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {product.category}
                  </Badge>
                </td>

                {/* Sales */}
                <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">
                  {product.sales} sold
                </td>

                {/* Price */}
                <td className="p-3 font-medium">${product.price}</td>

                {/* Trend */}
                <td
                  className={`p-3 text-xs font-semibold ${
                    product.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.trend === "up" ? "+" : "-"}
                  {product.trendValue}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
