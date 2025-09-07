"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGetProductPerformanceQuery } from "@/store/api/analyticsApi"

export function ProductAnalytics() {
  const { data, isLoading } = useGetProductPerformanceQuery({})
  const products = data?.data ?? []

  // Derive top product by totalSold
  const topProduct = products.reduce((top, p) => {
    const sales = p.totalSold ?? 0
    if (!top) return { id: String(p.id), name: p.name, sales, revenue: p.totalRevenue ?? 0, growth: Math.min(99, Math.round((sales / 10))) }
    const topSales = top.sales
    return sales > topSales ? { id: String(p.id), name: p.name, sales, revenue: p.totalRevenue ?? 0, growth: Math.min(99, Math.round((sales / 10))) } : top
  }, null as null | { id: string; name: string; sales: number; revenue: number; growth: number })

  const otherTopPerformers = products
    .filter(p => String(p.id) !== (topProduct?.id ?? ""))
    .sort((a, b) => (b.totalSold ?? 0) - (a.totalSold ?? 0))
    .slice(0, 4)
    .map((p) => ({
      id: String(p.id),
      name: p.name,
      sales: p.totalSold ?? 0,
      revenue: p.totalRevenue ?? 0,
      growth: Math.min(99, Math.round(((p.totalSold ?? 0) / 10)))
    }))

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Top Performing Product</h3>

      {!topProduct && (
        <div className="text-sm text-muted-foreground mb-6">
          {isLoading ? "Loading product performance..." : "No product performance data available."}
        </div>
      )}

      {topProduct && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-100 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-yellow-800">{topProduct.name}</span>
              <Badge variant="destructive" className="text-xs bg-white text-amber-400">
                #1 Top Product
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {topProduct.sales} units sold • ${topProduct.revenue} revenue
            </div>
            <Progress value={topProduct.growth * 2} className="h-2" />
          </div>
          <div className="text-right ml-4">
            <div className="text-sm font-medium text-green-600">+{topProduct.growth}%</div>
            <div className="text-xs text-muted-foreground">growth</div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4 gradient-text">Other Top Products</h3>
      <div className="space-y-4">
        {otherTopPerformers.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50/30 to-pink-50/30 border border-purple-100 dark:border-purple-800/20"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{product.name}</span>
                <Badge variant="outline" className="text-xs">
                  #{index + 2}
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
        {isLoading && otherTopPerformers.length === 0 && (
          <div className="text-sm text-muted-foreground">Loading product performance...</div>
        )}
        {!isLoading && otherTopPerformers.length === 0 && topProduct && (
          <div className="text-sm text-muted-foreground">No additional top products.</div>
        )}
      </div>
    </div>
  )
}
