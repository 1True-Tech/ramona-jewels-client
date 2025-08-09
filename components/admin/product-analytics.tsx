"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type Product = {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
};

const mockPerfumes: Product[] = [
  {
    id: "p1",
    name: "Floral Essence",
    sales: 150,
    revenue: 7500,
    growth: 12,
  },
  {
    id: "p2",
    name: "Ocean Breeze",
    sales: 200,
    revenue: 9800,
    growth: 18,
  },
  {
    id: "p3",
    name: "Citrus Splash",
    sales: 130,
    revenue: 6200,
    growth: 9,
  },
  {
    id: "p4",
    name: "Mystic Oud",
    sales: 90,
    revenue: 5400,
    growth: 15,
  },
  {
    id: "p5",
    name: "Vanilla Dream",
    sales: 180,
    revenue: 8700,
    growth: 20,
  },
  // Add more if needed
]

// Use first product as initial value, so return type is always Product
function getTopProductBySales(products: Product[]): Product {
  return products.reduce(
    (top, product) => (product.sales > top.sales ? product : top),
    products[0]
  )
}

export function ProductAnalytics() {
  const topProduct = getTopProductBySales(mockPerfumes)

  const otherTopPerformers = [...mockPerfumes]
    .filter(p => p.id !== topProduct.id)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4) // next 4 top products

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Top Performing Product</h3>

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
      </div>
    </div>
  )
}
