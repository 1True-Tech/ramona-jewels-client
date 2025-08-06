"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockPerfumes } from "@/lib/perfume-data"

export function ProductAnalytics() {
  const topPerformers = mockPerfumes.slice(0, 5).map((product, index) => ({
    ...product,
    sales: Math.floor(Math.random() * 200) + 50,
    revenue: Math.floor(Math.random() * 10000) + 2000,
    growth: Math.floor(Math.random() * 30) + 5,
  }))

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Top Performing Products</h3>
      <div className="space-y-4">
        {topPerformers.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-950/10 dark:to-pink-950/10 border border-purple-100 dark:border-purple-800/20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{product.name}</span>
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {product.sales} units sold • ${product.revenue} revenue
              </div>
              <Progress value={product.growth * 2} className="h-2" />
            </div>
            <div className="text-right ml-4">
              <div className="text-sm font-medium text-green-600">+{product.growth}%</div>
              <div className="text-xs text-muted-foreground">growth</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
