"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Floral", value: 35, color: "#8B5CF6" },
  { name: "Oriental", value: 25, color: "#EC4899" },
  { name: "Woody", value: 20, color: "#F59E0B" },
  { name: "Citrus", value: 15, color: "#10B981" },
  { name: "Aquatic", value: 5, color: "#3B82F6" },
]

export function CategoryChart() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Sales"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
