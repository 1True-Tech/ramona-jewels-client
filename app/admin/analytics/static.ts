export const stats = [
    {
      title: "Total Revenue",
      value: `$${revenue?.totalRevenue?.toLocaleString() || '0'}`,
      change: revenue?.revenueGrowth !== undefined ? `${revenue.revenueGrowth >= 0 ? '+' : ''}${revenue.revenueGrowth.toFixed(1)}%` : '+0.0%',
      trend: (revenue?.revenueGrowth !== undefined && revenue.revenueGrowth >= 0 ? "up" : "down") as "up" | "down",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: revenue?.totalOrders?.toLocaleString() || '0',
      change: "+0.0%", // Static fallback since orderGrowth doesn't exist in RevenueMetrics
      trend: "up" as "up" | "down",
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: customers?.totalCustomers?.toLocaleString() || '0',
      change: "+0.0%", // Static fallback since customerGrowth doesn't exist in CustomerInsights
      trend: "up" as "up" | "down",
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: `${revenue?.conversionRate?.toFixed(1) || '0'}%`,
      change: "+0.0%", // Static fallback since conversionGrowth doesn't exist in RevenueMetrics
      trend: "up" as "up" | "down",
      icon: TrendingUp,
    },
  ]

  export const productStats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      change: "+0.0%", // Static fallback since productGrowth doesn't exist in AnalyticsDashboard
      icon: Package,
    },
    {
      title: "Product Views",
      value: "0", // Static fallback since totalViews doesn't exist in AnalyticsDashboard
      change: "+0.0%",
      icon: Eye,
    },
    {
      title: "Wishlist Adds",
      value: "0", // Static fallback since wishlistAdds doesn't exist in AnalyticsDashboard
      change: "+0.0%",
      icon: Heart,
    },
    {
      title: "Avg Rating",
      value: "0.0", // Static fallback since averageRating doesn't exist in AnalyticsDashboard
      change: "+0.0",
      icon: Star,
    },
  ]