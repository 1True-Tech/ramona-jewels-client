import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
}

export function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600"

  return (
    <div className="bg-card rounded-lg border py-6 px-3 md:px-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold gradient-text">{value}</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-4 text-sm ${trendColor}`}>
        <TrendIcon className="h-4 w-4" />
        <span>{change} from last month</span>
      </div>
    </div>
  )
}
