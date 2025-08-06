"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", sales: 4000, revenue: 12000 },
  { name: "Feb", sales: 3000, revenue: 9000 },
  { name: "Mar", sales: 5000, revenue: 15000 },
  { name: "Apr", sales: 4500, revenue: 13500 },
  { name: "May", sales: 6000, revenue: 18000 },
  { name: "Jun", sales: 5500, revenue: 16500 },
  { name: "Jul", sales: 7000, revenue: 21000 },
]

export function SalesChart() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
