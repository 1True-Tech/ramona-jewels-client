"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Lock,
  ShoppingBag,
  Calendar,
  Shield
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/redux-auth-context"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/layouts/navbar"
import { MobileNav } from "@/components/layouts/mobile-nav"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  sameAsShipping: boolean
}

const steps = [
  { id: 1, name: "Shipping", icon: Truck },
  { id: 2, name: "Payment", icon: CreditCard },
  { id: 3, name: "Review", icon: Check },
]

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    sameAsShipping: true
  })

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [saveInfo, setSaveInfo] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/cart')
    }
  }, [state.items.length, router])

  // Calculate totals
  const subtotal = state.total
  const shippingCost = shippingMethod === 'express' ? 15.99 : shippingMethod === 'overnight' ? 29.99 : subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleShippingSubmit = () => {
    // Validate shipping form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const isValid = requiredFields.every(field => shippingInfo[field as keyof ShippingInfo])
    
    if (!isValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive"
      })
      return
    }
    
    setCurrentStep(2)
  }

  const handlePaymentSubmit = () => {
    // Validate payment form
    if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.cardholderName) {
      toast({
        title: "Missing Payment Information",
        description: "Please fill in all payment details.",
        variant: "destructive"
      })
      return
    }
    
    setCurrentStep(3)
  }

  const handleOrderSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create order object
      const order = {
        id: `ORD-${Date.now()}`,
        items: state.items,
        shipping: shippingInfo,
        payment: {
          ...paymentInfo,
          cardNumber: `****-****-****-${paymentInfo.cardNumber.slice(-4)}`
        },
        shippingMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + (shippingMethod === 'overnight' ? 1 : shippingMethod === 'express' ? 3 : 7) * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      }

      // Clear cart
      clearCart()
      
      // Store order in localStorage (in real app, this would be sent to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]))
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${order.id} has been confirmed.`,
        variant: "success",
      })
      
      // Redirect to order confirmation
      router.push(`/checkout/success?orderId=${order.id}`)
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 pb-20">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Information
                      </CardTitle>
                      <CardDescription>Where should we deliver your order?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            placeholder="John"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                            placeholder="New York"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Select value={shippingInfo.state} onValueChange={(value) => setShippingInfo({...shippingInfo, state: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AL">Alabama</SelectItem>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              {/* Add more states as needed */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      {/* Shipping Method */}
                      <div className="space-y-4">
                        <Label>Shipping Method</Label>
                        <div className="space-y-3">
                          {[
                            { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', price: subtotal > 100 ? 0 : 9.99 },
                            { id: 'express', name: 'Express Shipping', time: '2-3 business days', price: 15.99 },
                            { id: 'overnight', name: 'Overnight Shipping', time: '1 business day', price: 29.99 }
                          ].map((method) => (
                            <div
                              key={method.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                shippingMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => setShippingMethod(method.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">{method.time}</div>
                                </div>
                                <div className="font-semibold">
                                  {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="saveInfo" 
                          checked={saveInfo}
                          onCheckedChange={(val:boolean)=>setSaveInfo(val)}
                        />
                        <Label htmlFor="saveInfo">Save this information for next time</Label>
                      </div>

                      <Button onClick={handleShippingSubmit} className="w-full">
                        Continue to Payment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Information
                      </CardTitle>
                      <CardDescription>Enter your payment details securely</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Payment Method */}
                      <div className="space-y-4">
                        <Label>Payment Method</Label>
                        <div className="border rounded-lg p-4 bg-primary/5 border-primary">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <span className="font-medium">Credit/Debit Card</span>
                            <Badge variant="secondary">Secure</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name *</Label>
                          <Input
                            id="cardholderName"
                            value={paymentInfo.cardholderName}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Billing Address */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="sameAsShipping" 
                            checked={paymentInfo.sameAsShipping}
                            onCheckedChange={(checked) => setPaymentInfo({...paymentInfo, sameAsShipping: !!checked})}
                          />
                          <Label htmlFor="sameAsShipping">Billing address same as shipping</Label>
                        </div>

                        {!paymentInfo.sameAsShipping && (
                          <div className="space-y-4 border-t pt-4">
                            <Label className="text-base font-medium">Billing Address</Label>
                            
                            <div className="space-y-2">
                              <Label htmlFor="billingAddress">Address</Label>
                              <Input
                                id="billingAddress"
                                value={paymentInfo.billingAddress.address}
                                onChange={(e) => setPaymentInfo({
                                  ...paymentInfo, 
                                  billingAddress: {...paymentInfo.billingAddress, address: e.target.value}
                                })}
                                placeholder="123 Main Street"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="billingCity">City</Label>
                                <Input
                                  id="billingCity"
                                  value={paymentInfo.billingAddress.city}
                                  onChange={(e) => setPaymentInfo({
                                    ...paymentInfo, 
                                    billingAddress: {...paymentInfo.billingAddress, city: e.target.value}
                                  })}
                                  placeholder="New York"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="billingState">State</Label>
                                <Select 
                                  value={paymentInfo.billingAddress.state} 
                                  onValueChange={(value) => setPaymentInfo({
                                    ...paymentInfo, 
                                    billingAddress: {...paymentInfo.billingAddress, state: value}
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AL">Alabama</SelectItem>
                                    <SelectItem value="CA">California</SelectItem>
                                    <SelectItem value="FL">Florida</SelectItem>
                                    <SelectItem value="NY">New York</SelectItem>
                                    <SelectItem value="TX">Texas</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="billingZip">ZIP Code</Label>
                                <Input
                                  id="billingZip"
                                  value={paymentInfo.billingAddress.zipCode}
                                  onChange={(e) => setPaymentInfo({
                                    ...paymentInfo, 
                                    billingAddress: {...paymentInfo.billingAddress, zipCode: e.target.value}
                                  })}
                                  placeholder="10001"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Security Notice */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Your payment information is encrypted and secure</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Shipping
                        </Button>
                        <Button onClick={handlePaymentSubmit} className="flex-1">
                          Review Order
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Review Your Order
                      </CardTitle>
                      <CardDescription>Please review your order before placing it</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Order Items */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Order Items</Label>
                        {state.items.map((item) => (
                          <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                              <Image src={item.image || "/images/TestImage.jpg"} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {item.color && <span>Color: {item.color} </span>}
                                {item.size && <span>Size: {item.size}</span>}
                              </div>
                              <div className="text-sm">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Information */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Shipping Address</Label>
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="text-sm">
                            <div>{shippingInfo.firstName} {shippingInfo.lastName}</div>
                            <div>{shippingInfo.address}</div>
                            <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
                            <div>{shippingInfo.phone}</div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">Payment Method</Label>
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="text-sm">****-****-****-{paymentInfo.cardNumber.slice(-4)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Payment
                        </Button>
                        <Button 
                          onClick={handleOrderSubmit} 
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? "Processing..." : "Place Order"}
                          <Lock className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <Image src={item.image || "/images/TestImage.jpg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}