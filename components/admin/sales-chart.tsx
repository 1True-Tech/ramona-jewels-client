"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useGetSalesDataQuery } from "@/store/api/analyticsApi"

export function SalesChart() {
  // Fetch monthly aggregated sales data for better year view
  const { data } = useGetSalesDataQuery({ period: 'monthly' })
  const salesData = useMemo(() => data?.data ?? [], [data])

  // Derive available years from returned dates
  const years = useMemo(() => {
    const set = new Set<number>()
    salesData.forEach((item) => {
      const y = new Date(item.date).getFullYear()
      set.add(y)
    })
    return Array.from(set).sort((a, b) => a - b)
  }, [salesData])

  const currentYear = new Date().getFullYear()
  const initialYear = years.includes(currentYear) ? currentYear : years[0] ?? currentYear
  const [selectedYear, setSelectedYear] = useState<number>(initialYear)

  const filteredData = useMemo(() => {
    return salesData
      .filter((item) => new Date(item.date).getFullYear() === selectedYear)
      .map((item) => ({
        name: new Date(item.date).toLocaleString(undefined, { month: 'short' }),
        revenue: item.revenue,
        orders: item.orders,
      }))
  }, [salesData, selectedYear])

  return (
    <div className="bg-card rounded-lg border py-6 px-3 md:px-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">
          Sales Overview ({selectedYear})
        </h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#fillRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
