"use client"

import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock sales data for 3 years (same as yours)
const salesData = [
  { category: "Floral", value: 150, date: "2023-01-05" },
  { category: "Oriental", value: 90, date: "2023-01-12" },
  { category: "Woody", value: 120, date: "2023-02-03" },
  { category: "Citrus", value: 70, date: "2023-03-18" },
  { category: "Aquatic", value: 50, date: "2023-03-22" },
  { category: "Floral", value: 200, date: "2023-07-10" },
  { category: "Woody", value: 140, date: "2023-10-14" },
  { category: "Oriental", value: 110, date: "2023-12-25" },

  { category: "Floral", value: 130, date: "2024-01-08" },
  { category: "Oriental", value: 85, date: "2024-02-15" },
  { category: "Woody", value: 95, date: "2024-02-27" },
  { category: "Citrus", value: 60, date: "2024-03-05" },
  { category: "Aquatic", value: 30, date: "2024-05-19" },
  { category: "Floral", value: 220, date: "2024-07-22" },
  { category: "Woody", value: 160, date: "2024-09-03" },
  { category: "Oriental", value: 100, date: "2024-12-12" },

  { category: "Floral", value: 120, date: "2025-01-10" },
  { category: "Floral", value: 80, date: "2025-02-14" },
  { category: "Oriental", value: 60, date: "2025-01-20" },
  { category: "Woody", value: 100, date: "2025-02-05" },
  { category: "Citrus", value: 40, date: "2025-02-25" },
  { category: "Aquatic", value: 20, date: "2025-03-01" },
  { category: "Floral", value: 180, date: "2025-07-18" },
  { category: "Woody", value: 150, date: "2025-10-09" },
  { category: "Oriental", value: 90, date: "2025-12-30" },
]

const categoryColors: Record<string, string> = {
  Floral: "#8B5CF6",
  Oriental: "#EC4899",
  Woody: "#F59E0B",
  Citrus: "#10B981",
  Aquatic: "#3B82F6",
}

// Array for months (1-based)
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
  // Get unique years from data dynamically
  const uniqueYears = useMemo(() => {
    const years = Array.from(
      new Set(salesData.map((item) => new Date(item.date).getFullYear()))
    ).sort((a, b) => b - a) // descending order
    return years.map(String)
  }, [])

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0] || "2025")
  const [reportType, setReportType] = useState("yearly")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()) // 0-based

  const chartData = useMemo(() => {
    const now = new Date()

    // Compute start and end of current week (Monday - Sunday)
    const getWeekRange = (date: Date) => {
      const day = date.getDay()
      // Adjust Sunday (0) to 7 for easier calculation Monday=1 ... Sunday=7
      const adjustedDay = day === 0 ? 7 : day
      const monday = new Date(date)
      monday.setDate(date.getDate() - adjustedDay + 1)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      // Zero out time for safe comparisons
      monday.setHours(0, 0, 0, 0)
      sunday.setHours(23, 59, 59, 999)
      return [monday, sunday]
    }

    const [weekStart, weekEnd] = getWeekRange(now)
    const todayStr = now.toDateString()

    // Filter data by selectedYear first
    let filtered = salesData.filter(
      (item) => new Date(item.date).getFullYear().toString() === selectedYear
    )

    if (reportType === "monthly") {
      // Filter by selectedMonth as well
      filtered = filtered.filter(
        (item) => new Date(item.date).getMonth() === selectedMonth
      )
    } else if (reportType === "weekly") {
      filtered = filtered.filter((item) => {
        const date = new Date(item.date)
        return date >= weekStart && date <= weekEnd
      })
    } else if (reportType === "daily") {
      filtered = filtered.filter((item) => {
        const date = new Date(item.date)
        return date.toDateString() === todayStr
      })
    }

    // Group by category and sum values
    const grouped: Record<string, number> = {}
    filtered.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.value
    })

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name],
    }))
  }, [selectedYear, reportType, selectedMonth])

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
              {/* <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem> */}
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
    </div>
  )
}
