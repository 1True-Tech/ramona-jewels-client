"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import "./style.css"

// Simulated yearly report data
const allData = [
  // 2024 data
  { name: "Jan", sales: 4000, revenue: 12000, year: 2024 },
  { name: "Feb", sales: 3800, revenue: 11400, year: 2024 },
  { name: "Mar", sales: 5000, revenue: 15000, year: 2024 },
  { name: "Apr", sales: 4700, revenue: 14100, year: 2024 },
  { name: "May", sales: 6000, revenue: 18000, year: 2024 },
  { name: "Jun", sales: 5600, revenue: 16800, year: 2024 },
  { name: "Jul", sales: 7200, revenue: 21600, year: 2024 },
  { name: "Aug", sales: 6800, revenue: 20400, year: 2024 },
  { name: "Sep", sales: 6400, revenue: 19200, year: 2024 },
  { name: "Oct", sales: 7000, revenue: 21000, year: 2024 },
  { name: "Nov", sales: 7300, revenue: 21900, year: 2024 },
  { name: "Dec", sales: 7800, revenue: 23400, year: 2024 },

  // 2025 data
  { name: "Jan", sales: 1200, revenue: 12600, year: 2025 },
  { name: "Feb", sales: 4000, revenue: 12000, year: 2025 },
  { name: "Mar", sales: 2300, revenue: 15900, year: 2025 },
  { name: "Apr", sales: 4900, revenue: 14700, year: 2025 },
  { name: "May", sales: 6200, revenue: 18600, year: 2025 },
  { name: "Jun", sales: 5900, revenue: 17700, year: 2025 },
  { name: "Jul", sales: 1500, revenue: 22500, year: 2025 },
  { name: "Aug", sales: 7000, revenue: 21000, year: 2025 },
  { name: "Sep", sales: 6600, revenue: 19800, year: 2025 },
  { name: "Oct", sales: 2200, revenue: 21600, year: 2025 },
  { name: "Nov", sales: 7600, revenue: 22800, year: 2025 },
  { name: "Dec", sales: 4000, revenue: 24000, year: 2025 },
]

export function SalesChart() {
  const years = [...new Set(allData.map((item) => item.year))]

  const currentYear = new Date().getFullYear()

  const initialYear = years.includes(currentYear) ? currentYear : years[0]

  const [selectedYear, setSelectedYear] = useState(initialYear)

  const filteredData = allData.filter((item) => item.year === selectedYear)

  return (
    <div className="bg-card rounded-lg border py-6 px-3 md:px-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">
          Sales Overview ({selectedYear})
        </h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded px-2 py-1 bg-transparent outline-none w-[6rem]"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-amber-300 text-white outline-0" style={{ backgroundColor: "#FFD700" }}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={filteredData}
          margin={{ top: 0, right: 0, left: -9, bottom: 0 }}
        >
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
          <Tooltip
            formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFC900" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FFE100" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="sales"
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
