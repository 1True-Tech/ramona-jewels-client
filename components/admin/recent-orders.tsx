import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetOrdersQuery } from "@/store/api/ordersApi"
import { io, Socket } from "socket.io-client"

const statusColors = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
} as const

export function RecentOrders() {
  const [page, setPage] = useState(1)
  const limit = 3

  // Fetch orders for the current page
  const { data, isLoading, isError, refetch } = useGetOrdersQuery({ page, limit })

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SERVER_URL
    const socket: Socket = io(base!, { transports: ["websocket"] })

    socket.emit("join_analytics")

    const onUpdate = () => {
      refetch()
    }

    socket.on("analytics_update", onUpdate)

    return () => {
      try { socket.emit("leave_analytics") } catch {}
      try {
        socket.off("analytics_update", onUpdate)
        socket.disconnect()
      } catch {}
    }
  }, [refetch])

  const orders = useMemo(() => data?.data ?? [], [data])
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border pt-6 pb-3 px-3 md:px-4 md:pb-4">
        <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
        <div className="text-sm text-muted-foreground">Loading recent orders...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-card rounded-lg border pt-6 pb-3 px-3 md:px-4 md:pb-4">
        <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
        <div className="text-sm text-red-600">Failed to load orders. Please try again.</div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="bg-card rounded-lg border pt-6 pb-3 px-3 md:px-4 md:pb-4">
        <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
        <div className="text-sm text-muted-foreground">No recent orders found.</div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border pt-6 pb-3 px-3 md:px-4 md:pb-4 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
      <table className="w-full text-left text-sm rounded-xl overflow-hidden">
        <thead className="border-b gradient-primary border-primary/20 text-white">
          <tr>
            <th className="py-3 px-4 font-medium whitespace-nowrap">Order ID</th>
            <th className="py-3 px-4 font-medium whitespace-nowrap">Customer</th>
            <th className="py-3 px-4 font-medium whitespace-nowrap">Items</th>
            <th className="py-3 px-4 font-medium whitespace-nowrap">Total</th>
            <th className="py-3 px-4 font-medium whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, idx: number) => {
            const readableId = order.orderId || order.id
            const customer = order.customerName || order.customerInfo?.name || "Unknown"
            const itemsSummary = Array.isArray(order.items)
              ? order.items.map((i: any) => `${i.name} x${i.quantity}`).join(", ")
              : "-"
            const amount = typeof order.total === "number" ? `$${order.total.toFixed(2)}` : "-"
            const status = (order.status ?? "pending") as keyof typeof statusColors

            return (
              <tr key={readableId} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-4 px-4 font-medium text-gray-900">
                  {readableId?.length > 10 ? readableId.slice(0, 10) + "..." : readableId}
                </td>
                <td className="py-4 px-4 text-gray-700">{customer}</td>
                <td className="py-4 px-4 text-gray-700">{itemsSummary}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">{amount}</td>
                <td className="py-4 px-4">
                  <Badge
                    variant="secondary"
                    className={`${statusColors[status] ?? statusColors.pending} capitalize border-none`}
                  >
                    {status}
                  </Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4 px-5 md:px-35">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`${page === 1 ? "cursor-not-allowed" : "bg-gradient-background"}`}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
