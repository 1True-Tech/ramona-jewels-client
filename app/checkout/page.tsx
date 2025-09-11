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
  Lock,
  Shield,
  Phone,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/redux-auth-context"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { Navbar } from "@/components/layouts/navbar"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCreateStripePaymentIntentMutation } from "@/store/api/ordersApi"

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

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
const stripePromise = typeof window !== "undefined" && stripeKey ? loadStripe(stripeKey) : null

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [readableOrderId, setReadableOrderId] = useState<string | null>(null)
  const [createPaymentIntent] = useCreateStripePaymentIntentMutation()
  
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

  const handleShippingSubmit = async () => {
    // Validate shipping form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const isValid = requiredFields.every(field => shippingInfo[field as keyof ShippingInfo])
    
    if (!isValid) {
      dispatch(showModal({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required shipping fields.'
      }))
      return
    }

    if (!stripeKey) {
      dispatch(showModal({
        type: 'error',
        title: 'Stripe Not Configured',
        message: 'Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Please set it in your environment.'
      }))
      return
    }

    try {
      setIsLoading(true)
      const items = state.items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      }))

      const body = {
        items,
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        billingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        customerInfo: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        },
        shippingMethod,
      }

      const res: any = await createPaymentIntent(body)
      if (res?.data?.success && res.data.data?.clientSecret) {
        setClientSecret(res.data.data.clientSecret)
        setCreatedOrderId(res.data.data.orderId)
        setReadableOrderId(res.data.data.readableOrderId)
        setCurrentStep(2)
      } else {
        const message = res?.error?.data?.message || 'Failed to create payment intent'
        dispatch(showModal({ type: 'error', title: 'Payment Error', message }))
      }
    } catch (err: any) {
      dispatch(showModal({ type: 'error', title: 'Payment Error', message: err?.message || 'Unexpected error' }))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSubmit = () => {
    // For Stripe Elements, we no longer need to validate manual fields here.
    setCurrentStep(3)
  }

  const handleOrderSubmit = async (stripe?: any, elements?: any) => {
    if (!clientSecret) {
      dispatch(showModal({ type: 'error', title: 'Payment Error', message: 'Payment is not initialized. Please go back to Payment step.' }))
      return
    }
    setIsLoading(true)
    try {
      const cardElement = elements?.getElement('card') || elements?.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card details are incomplete.')
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentInfo.cardholderName || `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: {
              line1: paymentInfo.sameAsShipping ? shippingInfo.address : paymentInfo.billingAddress.address,
              city: paymentInfo.sameAsShipping ? shippingInfo.city : paymentInfo.billingAddress.city,
              state: paymentInfo.sameAsShipping ? shippingInfo.state : paymentInfo.billingAddress.state,
              postal_code: paymentInfo.sameAsShipping ? shippingInfo.zipCode : paymentInfo.billingAddress.zipCode,
              country: paymentInfo.sameAsShipping ? shippingInfo.country : paymentInfo.billingAddress.country,
            },
          },
        },
      })

      if (error) {
        dispatch(showModal({ type: 'error', title: 'Payment Failed', message: error.message || 'Your card was not accepted. Please try another card.' }))
        return
      }

      if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture' || paymentIntent.status === 'processing')) {
        // Persist minimal order snapshot for the success page
        try {
          const idToRoute = createdOrderId || readableOrderId
          if (idToRoute) {
            const existing = JSON.parse(localStorage.getItem('orders') || '[]')
            const etaDays = shippingMethod === 'overnight' ? 1 : shippingMethod === 'express' ? 3 : 5
            const newOrder = {
              id: idToRoute,
              items: state.items,
              shipping: shippingInfo,
              shippingMethod,
              subtotal,
              shippingCost,
              tax,
              total,
              status: 'confirmed',
              estimatedDelivery: new Date(Date.now() + etaDays * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date().toISOString(),
              payment: { method: 'card', status: paymentIntent.status }
            }
            const orders = [newOrder, ...existing.filter((o: any) => o.id !== idToRoute)]
            localStorage.setItem('orders', JSON.stringify(orders))
          }
        } catch (_) {}

        // Clear cart locally
        clearCart()
        // Navigate to success/confirmation page using the order created when PaymentIntent was created
        const idToRoute = createdOrderId || readableOrderId
        if (idToRoute) {
          router.push(`/checkout/success?orderId=${idToRoute}`)
        } else {
          router.push('/orders')
        }
      } else {
        dispatch(showModal({ type: 'error', title: 'Payment Error', message: 'Unexpected payment status. Please contact support.' }))
      }
    } catch (err: any) {
      dispatch(showModal({ type: 'error', title: 'Payment Error', message: err?.message || 'An unexpected error occurred.' }))
    } finally {
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="h-screen bg-background">
      <Navbar />
      <MobileNav />
      
      <div className="container mx-auto pt-7 pb-20">
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
                <div className={`flex items-center justify-center w-7 h-7 md:w-10 md:h-10 rounded-full border-2 ${
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
                <span className={`pl-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`md:w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Checkout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-ful md:max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}              
                {currentStep === 1 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Shipping Information
                      </CardTitle>
                      <CardDescription>Enter your contact and shipping address</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="flex items-center gap-2"><User className="h-4 w-4" /> First Name *</Label>
                          <Input id="firstName" value={shippingInfo.firstName} onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })} placeholder="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="flex items-center gap-2"><User className="h-4 w-4" /> Last Name *</Label>
                          <Input id="lastName" value={shippingInfo.lastName} onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })} placeholder="Doe" />
                        </div>
                        <div>
                          <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email *</Label>
                          <Input id="email" type="email" value={shippingInfo.email} onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })} placeholder="you@example.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone *</Label>
                          <Input id="phone" value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} placeholder="(555) 123-4567" />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address *</Label>
                        <Input value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} placeholder="Street address" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} placeholder="City" />
                          <Input value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} placeholder="State" />
                          <Input value={shippingInfo.zipCode} onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} placeholder="ZIP Code" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input value={shippingInfo.country} onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })} placeholder="Country" />
                          <div>
                            <Label>Shipping Method</Label>
                            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a shipping method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard {subtotal > 100 ? '(Free)' : '($9.99)'}</SelectItem>
                                <SelectItem value="express">Express ($15.99)</SelectItem>
                                <SelectItem value="overnight">Overnight ($29.99)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="saveInfo" checked={saveInfo} onCheckedChange={(v: any) => setSaveInfo(Boolean(v))} />
                              <Label htmlFor="saveInfo">Save this information for next time</Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <Link href="/cart" className="flex-1">
                          <Button variant="outline" className="w-full">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Cart
                          </Button>
                        </Link>
                        <Button className="flex" onClick={handleShippingSubmit} disabled={isLoading}>
                          {isLoading ? 'Preparing Payment...' : 'Continue to Payment'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {currentStep >= 2 && clientSecret && stripePromise && (
                <Elements stripe={stripePromise!} options={{ clientSecret }}>
                  {currentStep === 2 && (
                    <StripePaymentForm
                      paymentInfo={paymentInfo}
                      setPaymentInfo={setPaymentInfo}
                      onBack={() => setCurrentStep(1)}
                      onNext={handlePaymentSubmit}
                    />
                  )}
                  {currentStep === 3 && (
                    <StripeOrderReview
                      order={{ shippingInfo, items: state.items, subtotal, shippingCost, tax, total }}
                      onBack={() => setCurrentStep(2)}
                      onSubmit={handleOrderSubmit}
                      isLoading={isLoading}
                    />
                  )}
                </Elements>
              )}
              {/* Steps 2 & 3 rendered above within a single shared Elements provider */}
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
                        <Image src={item.image || "/images/TestImage.jpg"} alt={item.name} fill className="object-cover" loading="lazy"/>
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
    </div>
  )
}

// Stripe Payment Form Component
function StripePaymentForm({ paymentInfo, setPaymentInfo, onBack, onNext }: any) {
  const stripe = useStripe()
  const elements = useElements()

  const billing = paymentInfo?.billingAddress || {}
  const billingRequired = !paymentInfo?.sameAsShipping
  const missingBilling = billingRequired && (!billing.address || !billing.city || !billing.state || !billing.zipCode || !billing.country)
  const isNextDisabled = !stripe || !elements || !paymentInfo?.cardholderName?.trim() || missingBilling

  return (
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
            <Label>Card Details *</Label>
            <div className="p-3 border rounded-md bg-background">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
            <p className="text-xs text-muted-foreground">Your card details are encrypted and never touch our servers.</p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="space-y-4">
          <div>
            <Label>Cardholder Name</Label>
            <Input
              placeholder="Name on card"
              value={paymentInfo.cardholderName}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsShipping"
              checked={paymentInfo.sameAsShipping}
              onCheckedChange={(v: any) => setPaymentInfo({ ...paymentInfo, sameAsShipping: Boolean(v) })}
            />
            <Label htmlFor="sameAsShipping">Billing address same as shipping</Label>
          </div>
          {!paymentInfo.sameAsShipping && (
            <div className="space-y-3">
              <Label>Billing Address</Label>
              <Input
                placeholder="Street address"
                value={paymentInfo.billingAddress.address}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, billingAddress: { ...paymentInfo.billingAddress, address: e.target.value } })}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="City"
                  value={paymentInfo.billingAddress.city}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, billingAddress: { ...paymentInfo.billingAddress, city: e.target.value } })}
                />
                <Input
                  placeholder="State"
                  value={paymentInfo.billingAddress.state}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, billingAddress: { ...paymentInfo.billingAddress, state: e.target.value } })}
                />
                <Input
                  placeholder="ZIP Code"
                  value={paymentInfo.billingAddress.zipCode}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, billingAddress: { ...paymentInfo.billingAddress, zipCode: e.target.value } })}
                />
              </div>
              <Input
                placeholder="Country"
                value={paymentInfo.billingAddress.country}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, billingAddress: { ...paymentInfo.billingAddress, country: e.target.value } })}
              />
              {missingBilling && (
                <p className="text-xs text-red-500">Please complete all billing address fields.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shipping
          </Button>
          <Button onClick={onNext} className="flex-1" disabled={isNextDisabled}>
            Review Order
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Stripe Order Review Component
function StripeOrderReview({ order, onBack, onSubmit, isLoading }: any) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    await onSubmit(stripe, elements)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Review Your Order
        </CardTitle>
        <CardDescription>Please review your order before placing it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">Shipping</h3>
            <p className="text-sm text-muted-foreground">
              {order?.shippingInfo?.firstName} {order?.shippingInfo?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{order?.shippingInfo?.email}</p>
            <p className="text-sm text-muted-foreground">{order?.shippingInfo?.phone}</p>
            <p className="text-sm">
              {order?.shippingInfo?.address}, {order?.shippingInfo?.city}, {order?.shippingInfo?.state} {order?.shippingInfo?.zipCode}, {order?.shippingInfo?.country}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Totals</h3>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${order?.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{order?.shippingCost === 0 ? 'Free' : `$${order?.shippingCost?.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-sm"><span>Tax</span><span>${order?.tax?.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>${order?.total?.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Payment
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !stripe || !elements} className="flex-1">
            {isLoading ? "Processing..." : "Place Order"}
            <Lock className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}