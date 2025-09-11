"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar } from '@/components/layouts/navbar'
import { MobileNav } from '@/components/layouts/mobile-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader }  from '@/components/ui/loader'
import { RefreshCw, Package, Truck, CheckCircle, Clock, Receipt, MessageSquare, Link as LinkIcon, ShieldCheck } from 'lucide-react'
import { useCreateReturnMutation, useGetMyReturnsQuery } from '@/store/api/returnsApi'
import { useAuth } from '@/contexts/redux-auth-context'
import { io, Socket } from 'socket.io-client'

export default function ReturnsPage(){
  const { user } = useAuth()
  const [orderId, setOrderId] = useState('')
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')
  const [activeReturnId, setActiveReturnId] = useState<string | null>(null)
  const [liveStatus, setLiveStatus] = useState<string>('disconnected')
  const [liveUpdate, setLiveUpdate] = useState<any>(null)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  const socketRef = useRef<Socket | null>(null)
  const [createReturn, { isLoading: creating }] = useCreateReturnMutation()
  const { data: myReturns, isLoading } = useGetMyReturnsQuery(undefined, { skip: !user })

  useEffect(() => {
    const s = io(serverUrl, { transports: ['websocket'], autoConnect: true })
    socketRef.current = s
    s.on('connect', () => setLiveStatus('connected'))
    s.on('disconnect', () => setLiveStatus('disconnected'))
    return () => { s.disconnect() }
  }, [serverUrl])

  useEffect(() => {
    const s = socketRef.current
    if (!s) return
    if (activeReturnId) {
      s.emit('join_return', activeReturnId)
      const handler = (payload: any) => {
        setLiveUpdate(payload)
      }
      s.on('return_update', handler)
      return () => {
        s.emit('leave_return', activeReturnId)
        s.off('return_update', handler)
      }
    }
  }, [activeReturnId])

  const handleSubmit = async () => {
    if (!orderId) return
    try {
      const res: any = await createReturn({ orderId, reason, comments })
      const id = res?.data?.data?._id
      if (id) setActiveReturnId(id)
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="container py-8 mb-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <CardTitle>Start a Return</CardTitle>
                </div>
                <CardDescription>Enter your Order ID to request a return. We’ll keep you updated in real time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Order ID</label>
                    <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g., 6651f..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reason</label>
                    <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Changed mind, defective, etc." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Comments</label>
                  <Textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Optional details to help us" />
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleSubmit} disabled={creating} className="bg-primary text-white">
                    {creating ? 'Submitting...' : 'Submit Return Request'}
                  </Button>
                  <Badge variant={liveStatus === 'connected' ? 'default' : 'secondary'}>{liveStatus === 'connected' ? 'Live' : 'Offline'}</Badge>
                </div>
                {liveUpdate && (
                  <div className="text-sm text-muted-foreground">
                    Live update: status changed to <span className="font-semibold">{liveUpdate.status}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Return Requests</CardTitle>
                <CardDescription>Click to follow a request live</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 flex items-center justify-center"><Loader message=''/></div>
                ) : (
                  <div className="space-y-3">
                    {(myReturns?.data || []).map((rr) => (
                      <button
                        key={rr._id}
                        onClick={() => setActiveReturnId(rr._id)}
                        className={`w-full p-4 rounded-lg border text-left hover:bg-muted/50 transition ${activeReturnId === rr._id ? 'border-primary' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{rr.rmaNumber}</div>
                            <div className="text-xs text-muted-foreground">Order: {rr.orderId}</div>
                          </div>
                          <Badge>{rr.status}</Badge>
                        </div>
                        {activeReturnId === rr._id && (
                          <div className="mt-2 text-xs text-muted-foreground">Listening for updates...</div>
                        )}
                      </button>
                    ))}
                    {(!myReturns?.data || myReturns.data.length === 0) && (
                      <div className="text-sm text-muted-foreground">No return requests yet.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Return Policy</CardTitle>
                </div>
                <CardDescription>30-day hassle-free returns on eligible items.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Items must be unused and in original packaging</p>
                <p>• Refunds are issued to the original payment method</p>
                <p>• Prepaid label provided for approved returns</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}