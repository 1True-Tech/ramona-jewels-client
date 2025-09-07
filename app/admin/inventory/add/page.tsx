"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminInventoryAddPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              The add-inventory form is not implemented yet. You can extend this page to add new products to your catalog.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
