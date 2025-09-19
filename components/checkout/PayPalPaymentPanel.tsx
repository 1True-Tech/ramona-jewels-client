// import { useCart } from "@/contexts/cart-context"
// import { useCapturePayPalOrderMutation, useCreatePayPalOrderMutation } from "@/store/api/ordersApi"
// import { useAppDispatch } from "@/store/hooks"
// import { showModal } from "@/store/slices/uiSlice"
// import { useRouter } from "next/router"



// export function PayPalPaymentPanel({ shippingInfo, shippingMethod, items, totals, onBack }: any) {
//     const dispatch = useAppDispatch()
//     const router = useRouter()
//     const { clearCart, state: cartState } = useCart()
//     const [createPayPalOrder] = useCreatePayPalOrderMutation()
//     const [capturePayPalOrder] = useCapturePayPalOrderMutation()
  
//     const { subtotal, shippingCost, tax, total } = totals || {}
  
//     const createOrderHandler = async () => {
//       try {
//         const body = {
//           items: items.map((i: any) => ({ productId: i.id, quantity: i.quantity, color: i.color, size: i.size })),
//           shippingAddress: {
//             firstName: shippingInfo.firstName,
//             lastName: shippingInfo.lastName,
//             email: shippingInfo.email,
//             phone: shippingInfo.phone,
//             address: shippingInfo.address,
//             city: shippingInfo.city,
//             state: shippingInfo.state,
//             zipCode: shippingInfo.zipCode,
//             country: shippingInfo.country,
//           },
//           billingAddress: {
//             address: shippingInfo.address,
//             city: shippingInfo.city,
//             state: shippingInfo.state,
//             zipCode: shippingInfo.zipCode,
//             country: shippingInfo.country,
//           },
//           customerInfo: {
//             name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
//             email: shippingInfo.email,
//             phone: shippingInfo.phone,
//           },
//           shippingMethod,
//         }
//         const res: any = await createPayPalOrder(body)
//         if (res?.data?.success) {
//           return res.data.data.paypalOrderId
//         }
//         const message = res?.error?.data?.message || 'Failed to create PayPal order'
//         dispatch(showModal({ type: 'error', title: 'PayPal Error', message }))
//         throw new Error(message)
//       } catch (err: any) {
//         dispatch(showModal({ type: 'error', title: 'PayPal Error', message: err?.message || 'Unexpected error creating PayPal order' }))
//         throw err
//       }
//     }
  
//     const onApproveHandler = async (data: any) => {
//       try {
//         const res: any = await capturePayPalOrder({ paypalOrderId: data?.orderID })
//         if (res?.data?.success) {
//           const orderId = res.data.data.orderId
//           // Persist minimal order snapshot for the success page
//           try {
//             const existing = JSON.parse(localStorage.getItem('orders') || '[]')
//             const etaDays = shippingMethod === 'overnight' ? 1 : shippingMethod === 'express' ? 3 : 5
//             const newOrder = {
//               id: orderId,
//               items,
//               shipping: shippingInfo,
//               shippingMethod,
//               subtotal,
//               shippingCost,
//               tax,
//               total,
//               status: 'confirmed',
//               estimatedDelivery: new Date(Date.now() + etaDays * 24 * 60 * 60 * 1000).toISOString(),
//               createdAt: new Date().toISOString(),
//               payment: { method: 'paypal', status: 'paid' }
//             }
//             const orders = [newOrder, ...existing.filter((o: any) => o.id !== orderId)]
//             localStorage.setItem('orders', JSON.stringify(orders))
//           } catch (_) {}
//           // Clear cart locally and navigate
//           clearCart()
//           router.push(`/checkout/success?orderId=${orderId}`)
//         } else {
//           const message = res?.error?.data?.message || 'Failed to capture PayPal order'
//           dispatch(showModal({ type: 'error', title: 'PayPal Capture Error', message }))
//         }
//       } catch (err: any) {
//         dispatch(showModal({ type: 'error', title: 'PayPal Error', message: err?.message || 'Unexpected error capturing PayPal order' }))
//       }
//     }
  
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Image src="/paypal.svg" alt="PayPal" width={24} height={24} />
//             Pay with PayPal
//           </CardTitle>
//           <CardDescription>You'll be able to log in to your PayPal account to complete the purchase.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4 z-0">
//           <PayPalScriptProvider options={{ clientId: paypalClientId || 'test', currency: 'USD' }}>
//             <PayPalButtons
//               style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
//               createOrder={async () => await createOrderHandler()}
//               onApprove={async (data) => await onApproveHandler(data)}
//               onError={(err) => dispatch(showModal({ type: 'error', title: 'PayPal Error', message: (err as any)?.message || 'An error occurred with PayPal.' }))}
//               onCancel={() => dispatch(showModal({ type: 'warning', title: 'Payment Cancelled', message: 'You cancelled the PayPal payment.' }))}
//               className="z-[0]"
//             />
//           </PayPalScriptProvider>
  
//           <div className="flex flex-col md:flex-row gap-4">
//             <Button variant="outline" onClick={onBack} className="flex-1">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Shipping
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     )
// }
  