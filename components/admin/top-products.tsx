"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { mockPerfumes } from "@/lib/perfume-data"

export function TopProducts() {
  const topProducts = mockPerfumes.slice(0, 6).map((product, index) => ({
    ...product,
    rank: index + 1,
    sales: Math.floor(Math.random() * 500) + 100,
    trend: Math.random() > 0.5 ? "up" : "down",
    trendValue: Math.floor(Math.random() * 20) + 5,
  }))

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Bestselling Products</h3>
      <div className="space-y-3">
        {topProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-sm font-bold text-primary">
              {product.rank}
            </div>

            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{product.sales} sold</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {product.category}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">${product.price}</p>
              <p className={`text-xs ${product.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {product.trend === "up" ? "+" : "-"}
                {product.trendValue}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
