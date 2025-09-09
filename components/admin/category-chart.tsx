"use client"

import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetCategoryPerformanceQuery } from "@/store/api/analyticsApi"

// Generate a deterministic HSL color from a string (category name)
function stringToHslColor(str: string, s = 65, l = 50) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0 // Convert to 32bit integer
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, ${s}%, ${l}%)`
}

// Array for months (0-based for Date API)
const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
]

export function CategoryChart() {
  // Build years list: current year and 2 previous years
  const uniqueYears = useMemo(() => {
    const y = new Date().getFullYear()
    return [y, y - 1, y - 2].map(String)
  }, [])

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0] || String(new Date().getFullYear()))
  const [reportType, setReportType] = useState("yearly")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()) // 0-based

  // Compute date range based on filters
  const { startDate, endDate } = useMemo(() => {
    const year = parseInt(selectedYear, 10)
    if (reportType === "monthly") {
      const start = new Date(year, selectedMonth, 1)
      const end = new Date(year, selectedMonth + 1, 0)
      return { startDate: start.toISOString(), endDate: end.toISOString() }
    }
    // yearly
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31, 23, 59, 59, 999)
    return { startDate: start.toISOString(), endDate: end.toISOString() }
  }, [selectedYear, reportType, selectedMonth])

  // Fetch category performance from backend
  const { data, isLoading } = useGetCategoryPerformanceQuery({ startDate, endDate })

  const chartData = useMemo(() => {
    const list = data?.data ?? []
    return list.map((item) => ({
      name: item.category,
      value: item.totalSold,
      color: stringToHslColor(item.category),
    }))
  }, [data])

  return (
    <div className="bg-card rounded-lg border px-3 md:px-4 py-6">
      <div className="flex justify-between items-center flex-wrap mb-4 gap-3">
        <h3 className="text-lg font-semibold gradient-text">Sales by Categories</h3>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          {/* Year Filter */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="max-w-[90px] bg-amber-400 text-white">
              <SelectValue placeholder="Year" className="text-white"/>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {uniqueYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Filter (show only if monthly) */}
          {reportType === "monthly" && (
            <Select
              value={selectedMonth.toString()}
              onValueChange={(val) => setSelectedMonth(parseInt(val))}
            >
              <SelectTrigger className="max-w-[118px] bg-amber-400 text-white">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Report Type Filter */}
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="max-w-[90px] bg-amber-400 text-white">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Sales"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {isLoading && (
        <div className="text-sm text-muted-foreground mt-2">Loading category performance...</div>
      )}
    </div>
  )
}
