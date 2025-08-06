import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "#3210",
    customer: "John Doe",
    product: "Premium Headphones",
    amount: "$299.99",
    status: "completed",
  },
  {
    id: "#3209",
    customer: "Jane Smith",
    product: "Smart Watch",
    amount: "$199.99",
    status: "processing",
  },
  {
    id: "#3208",
    customer: "Bob Johnson",
    product: "Wireless Earbuds",
    amount: "$149.99",
    status: "shipped",
  },
  {
    id: "#3207",
    customer: "Alice Brown",
    product: "Bluetooth Speaker",
    amount: "$89.99",
    status: "pending",
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export function RecentOrders() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium">{order.id}</span>
                <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.customer}</p>
              <p className="text-sm text-muted-foreground">{order.product}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{order.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
