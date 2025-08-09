import { Badge } from "@/components/ui/badge";

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
];

const statusColors = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export function RecentOrders() {
  return (
    <div className="bg-card rounded-lg border pt-6 pb-3 px-3 md:px-4 md:pb-4 shadow-md overflow-x-auto">
      <h3 className="text-xl font-semibold mb-6">Recent Orders</h3>
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Order ID</th>
            <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Customer</th>
            <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Product</th>
            <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Amount</th>
            <th className="py-3 px-4 font-medium text-gray-700 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr
              key={order.id}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="py-4 px-4 font-medium text-gray-900">{order.id}</td>
              <td className="py-4 px-4 text-gray-700">{order.customer}</td>
              <td className="py-4 px-4 text-gray-700">{order.product}</td>
              <td className="py-4 px-4 font-semibold text-gray-900">{order.amount}</td>
              <td className="py-4 px-4">
                <Badge
                  variant="secondary"
                  className={`${statusColors[order.status as keyof typeof statusColors]} capitalize`}
                >
                  {order.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
