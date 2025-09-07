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
  const { data, isLoading } = useGetSalesDataQuery({ period: 'monthly' })
  const salesData = data?.data ?? []

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
          className="bg-amber-400 text-white px-2 py-1 rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: any, name: string) => [value, name === 'revenue' ? 'Revenue' : 'Orders']} />
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFcB00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FFcB00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#FFcB00"
            fillOpacity={1}
            fill="url(#salesGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
