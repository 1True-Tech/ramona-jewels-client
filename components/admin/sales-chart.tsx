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
  // Fetch monthly aggregated sales data
  const { data } = useGetSalesDataQuery({ period: "monthly" })
  const salesData = useMemo(() => data?.data ?? [], [data])

  // Extract years
  const years = useMemo(() => {
    const set = new Set<number>()
    salesData.forEach((item) => {
      const y = new Date(item.date).getFullYear()
      set.add(y)
    })
    return Array.from(set).sort((a, b) => a - b)
  }, [salesData])

  const currentYear = new Date().getFullYear()
  const initialYear = years.includes(currentYear)
    ? currentYear
    : years[0] ?? currentYear
  const [selectedYear, setSelectedYear] = useState<number>(initialYear)

  const filteredData = useMemo(() => {
    return salesData
      .filter(
        (item) => new Date(item.date).getFullYear() === selectedYear
      )
      .map((item) => ({
        name: new Date(item.date).toLocaleString(undefined, {
          month: "short",
        }),
        paid: item.paid ?? 0,
        pending: item.pending ?? 0,
        cancelled: item.cancelled ?? 0,
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
          className="border rounded-md px-2 py-1 text-sm"
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
          <AreaChart data={filteredData} margin={{ left: -10, right: 12 }}>
            <defs>
              <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(142, 71%, 45%)" // green-600
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(142, 71%, 45%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(47, 95%, 55%)" // yellow-500
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(47, 95%, 55%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(0, 84%, 60%)" // red-500
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />

            {/* Paid orders */}
            <Area
              type="monotone"
              dataKey="paid"
              stroke="hsl(142, 71%, 45%)"
              fillOpacity={1}
              fill="url(#fillPaid)"
            />

            {/* Pending orders */}
            <Area
              type="monotone"
              dataKey="pending"
              stroke="hsl(47, 95%, 55%)"
              fillOpacity={1}
              fill="url(#fillPending)"
            />

            {/* Cancelled orders */}
            <Area
              type="monotone"
              dataKey="cancelled"
              stroke="hsl(0, 84%, 60%)"
              fillOpacity={1}
              fill="url(#fillCancelled)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
