"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/redux-auth-context"
import { 
  Settings,
  Store,
  Bell,
  Shield,
  Palette,
  Mail,
  Globe,
  CreditCard,
  Truck,
  Save,
  Upload
} from "lucide-react"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Ramona Jewels",
    storeDescription: "Luxury jewelry and perfumes for the modern woman",
    storeEmail: "contact@ramonajewels.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Luxury Lane, Beverly Hills, CA 90210",
    currency: "USD",
    timezone: "America/Los_Angeles",
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    customerMessages: true,
    marketingEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: true,
    applePayEnabled: false,
    googlePayEnabled: false,
    
    // Shipping Settings
    freeShippingThreshold: 100,
    standardShippingRate: 9.99,
    expressShippingRate: 19.99,
    internationalShipping: true,
    
    // Theme Settings
    darkMode: false,
    primaryColor: "#8B5CF6",
    accentColor: "#F59E0B"
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings)
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your store settings and preferences</p>
          </div>
          <Button onClick={handleSave} className="gradient-primary text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </motion.div>

        {/* Settings Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="store" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-4">
              <TabsTrigger value="store" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Store</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Shipping</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="store" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>
                    Basic information about your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={settings.storeName}
                        onChange={(e) => handleInputChange("storeName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => handleInputChange("storeEmail", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storePhone">Store Phone</Label>
                      <Input
                        id="storePhone"
                        value={settings.storePhone}
                        onChange={(e) => handleInputChange("storePhone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        value={settings.currency}
                        onChange={(e) => handleInputChange("currency", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <Textarea
                      id="storeDescription"
                      value={settings.storeDescription}
                      onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Store Address</Label>
                    <Textarea
                      id="storeAddress"
                      value={settings.storeAddress}
                      onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Order Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new orders are placed
                        </p>
                      </div>
                      <Switch
                        checked={settings.orderNotifications}
                        onCheckedChange={(checked) => handleInputChange("orderNotifications", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Inventory Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get alerts when products are low in stock
                        </p>
                      </div>
                      <Switch
                        checked={settings.inventoryAlerts}
                        onCheckedChange={(checked) => handleInputChange("inventoryAlerts", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Customer Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified of customer inquiries
                        </p>
                      </div>
                      <Switch
                        checked={settings.customerMessages}
                        onCheckedChange={(checked) => handleInputChange("customerMessages", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive marketing and promotional emails
                        </p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => handleInputChange("passwordExpiry", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Configure available payment options for customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Stripe</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept credit and debit cards
                        </p>
                      </div>
                      <Switch
                        checked={settings.stripeEnabled}
                        onCheckedChange={(checked) => handleInputChange("stripeEnabled", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>PayPal</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept PayPal payments
                        </p>
                      </div>
                      <Switch
                        checked={settings.paypalEnabled}
                        onCheckedChange={(checked) => handleInputChange("paypalEnabled", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Apple Pay</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept Apple Pay payments
                        </p>
                      </div>
                      <Switch
                        checked={settings.applePayEnabled}
                        onCheckedChange={(checked) => handleInputChange("applePayEnabled", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Google Pay</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept Google Pay payments
                        </p>
                      </div>
                      <Switch
                        checked={settings.googlePayEnabled}
                        onCheckedChange={(checked) => handleInputChange("googlePayEnabled", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Settings</CardTitle>
                  <CardDescription>
                    Configure shipping rates and options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => handleInputChange("freeShippingThreshold", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="standardShippingRate">Standard Shipping Rate ($)</Label>
                      <Input
                        id="standardShippingRate"
                        type="number"
                        step="0.01"
                        value={settings.standardShippingRate}
                        onChange={(e) => handleInputChange("standardShippingRate", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expressShippingRate">Express Shipping Rate ($)</Label>
                      <Input
                        id="expressShippingRate"
                        type="number"
                        step="0.01"
                        value={settings.expressShippingRate}
                        onChange={(e) => handleInputChange("expressShippingRate", parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>International Shipping</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow shipping to international addresses
                      </p>
                    </div>
                    <Switch
                      checked={settings.internationalShipping}
                      onCheckedChange={(checked) => handleInputChange("internationalShipping", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your admin panel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the admin panel
                      </p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleInputChange("darkMode", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          value={settings.primaryColor}
                          onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        />
                        <div 
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: settings.primaryColor }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accentColor"
                          value={settings.accentColor}
                          onChange={(e) => handleInputChange("accentColor", e.target.value)}
                        />
                        <div 
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: settings.accentColor }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  )
}