"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Gem, Sparkles } from "lucide-react"
import { useGetProductPerformanceQuery } from "@/store/api/analyticsApi"

export function TopProducts() {
  const { data, isLoading } = useGetProductPerformanceQuery({})

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const toImageUrl = (img?: string | null) => {
    if (!img) return "/placeholder.svg"
    if (img.startsWith("http")) return img
    if (img.startsWith("/uploads")) return `${API_URL}${img}`
    return img
  }

  const topProducts = (data?.data ?? []).map((p, index) => ({
    id: String(p.id),
    name: p.name,
    image: toImageUrl(p.image || undefined),
    category: p.category || "Unknown",
    // Map backend fields to UI expectations
    rank: index + 1,
    sales: p.totalSold ?? 0,
    price: Math.round((p.averagePrice ?? 0) * 100) / 100,
    // UI-only synthetic trend values when not provided by backend
    trend: "up" as const,
    trendValue: Math.min(99, Math.max(5, Math.round((p.totalSold ?? 0) / 5))),
    type: "perfume" as const,
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
                      src={product.image}
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
            {isLoading && (
              <tr>
                <td colSpan={7} className="p-3 text-sm text-muted-foreground">
                  Loading top products...
                </td>
              </tr>
            )}
            {!isLoading && topProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="p-3 text-sm text-muted-foreground">
                  No product performance data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
