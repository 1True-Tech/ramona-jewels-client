"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  Gem,
  Loader2,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAppDispatch } from "@/store/hooks"
import { showModal } from "@/store/slices/uiSlice"
import { useGetProductQuery, useGetProductsQuery } from "@/store/api/productsApi"
import type { Product as ApiProduct } from "@/store/apiTypes"
import { Navbar } from "@/components/layouts/navbar"
import { ProductCard } from "@/components/products/product-card"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { useToast } from "@/hooks/use-toast"
import { useGetReviewsByProductQuery, useCreateReviewMutation, Review } from '@/store/api/reviewsApi'
import { useProductReviewsRealtime } from '@/hooks/use-product-reviews-realtime'

// Helper: build server/base URL for images
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || (() => {
  try {
    return API_URL ? new URL(API_URL).origin : ""
  } catch {
    return ""
  }
})()

const toImageUrl = (img?: string | null) => {
  if (!img) return "/placeholder.svg"
  if (img.startsWith("http")) return img
  if (img.startsWith("/uploads")) return `${SERVER_URL}${img}`
  return img
}

// Local type for details page - using only backend data
interface ExtendedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  rating?: number
  reviews?: number
  badge?: string
  type?: "jewelry" | "perfume"
  category: string
  brand: string
  description: string
  stockCount: number
  inStock: boolean
  // Backend-driven fields only
  size?: string
  concentration?: string
  gender?: string
  topNotes?: string[]
  middleNotes?: string[]
  baseNotes?: string[]
}

const toUIProduct = (backendProduct: ApiProduct): ExtendedProduct => ({
  id: backendProduct._id,
  name: backendProduct.name,
  price: backendProduct.price,
  originalPrice: backendProduct.originalPrice,
  image: toImageUrl(backendProduct.images?.[0]),
  images: backendProduct.images?.map(toImageUrl) || [toImageUrl(backendProduct.images?.[0])],
  rating: 4.5, // TODO: Replace with actual rating from backend
  reviews: 12, // TODO: Replace with actual review count from backend
  badge: backendProduct.originalPrice && backendProduct.originalPrice > backendProduct.price ? "Sale" : undefined,
  type: (backendProduct.type as any) || "perfume",
  category: backendProduct.category,
  brand: backendProduct.brand,
  description: backendProduct.description,
  stockCount: backendProduct.stock || 0,
  inStock: (backendProduct.isActive ?? true) && (backendProduct.stock ?? 0) > 0,
  // Use only backend data - no mock values
  size: backendProduct.size,
  concentration: backendProduct.concentration,
  gender: backendProduct.gender,
  topNotes: backendProduct.topNotes || [],
  middleNotes: backendProduct.middleNotes || [],
  baseNotes: backendProduct.baseNotes || [],
})
 export default function ProductDetailPage() {
   const params = useParams()
   const productId = params.id as string

  // Fetch product and related
  const { data: productResponse, isLoading: isProductLoading, error: productError } = useGetProductQuery(productId)
  const { data: productsResponse } = useGetProductsQuery({ limit: 12 })
 
   const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  // Reviews hooks/state
  const { data: reviews = [], isLoading: reviewsLoading } = useGetReviewsByProductQuery(productId)
  const [createReview, { isLoading: creatingReview }] = useCreateReviewMutation()
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [reviewName, setReviewName] = useState<string>("")

  const handleSubmitReview = async () => {
    if (!rating) {
      toast({ title: 'Please select a rating', variant: 'destructive' })
      return
    }
    try {
      await createReview({ productId, rating, comment, name: reviewName || undefined }).unwrap()
      setRating(0)
      setComment('')
      setReviewName('')
      toast({ title: 'Thanks for your review!' })
    } catch (e: any) {
      toast({ title: 'Failed to submit review', description: e?.data?.message || 'Please try again', variant: 'destructive' })
    }
  }

  // Real-time reviews subscription
  const [localReviews, setLocalReviews] = useState<Review[] | null>(null)
  
  // Initialize/sync local list when fetched
  useEffect(() => {
    setLocalReviews(reviews)
  }, [reviews])

  useProductReviewsRealtime(productId, (payload) => {
    const { review } = payload || {}
    if (!review) return
    setLocalReviews((prev) => {
      const list = prev ?? reviews ?? []
      return [review, ...list]
    })
  })

  // Derive live average rating and total review count
  const { averageRating, totalReviews } = useMemo(() => {
    const list = localReviews ?? reviews ?? []
    const count = list.length
    if (!count) return { averageRating: 0, totalReviews: 0 }
    const sum = list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
    return { averageRating: sum / count, totalReviews: count }
  }, [localReviews, reviews])

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading product...</span>
          </div>
        </div>
      </div>
    )
  }

  if (productError || !productResponse?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  const product = toUIProduct(productResponse.data)
 
  // Related products (same category, exclude current)
  const relatedProducts = (productsResponse?.data || [])
    .filter((p) => p.category === product.category && p._id !== productId)
    .slice(0, 4)
    .map(toUIProduct)
 
   const handleAddToCart = () => {
     for (let i = 0; i < quantity; i++) {
       addItem({
         id: product.id,
         name: product.name,
         price: product.price,
         image: product.image,
       })
     }
     dispatch(showModal({
       type: 'success',
       title: 'Added to cart',
       message: `${quantity} ${product.name}(s) added to your cart.`
     }))
   }

  const handleShare = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
      const shareData: ShareData = {
        title: product.name,
        text: `${product.brand} • ${product.name} — $${product.price.toFixed(2)}`,
        url: shareUrl,
      }
      if (navigator.share) {
        await navigator.share(shareData)
        // no toast if successful
      } else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl)
        // no toast if successful
      } else {
        throw new Error("Sharing not supported on this device.")
      }
    } catch (err) {
      // user may cancel share; only notify on actual errors
      // eslint-disable-next-line no-console
      console.debug('Share error or canceled', err)
    }
  }
 
   const discount = product.originalPrice
     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
     : 0
 
  const isJewelry = product.type === "jewelry"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 jewelry-sparkle">
              <Image
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 gradient-primary text-white border-0">{product.badge}</Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4 bg-red-400">
                  -{discount}%
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary shadow-lg scale-105"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                  {product.brand}
                </Badge>
                <Badge variant="outline" className="capitalize border-primary/20">
                  {product.category}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 gradient-text">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {averageRating.toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold gradient-text">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Product Specifications - Only show if data exists */}
            {((!isJewelry && (product.size || product.concentration || product.gender)) || 
              (isJewelry && product.stockCount)) && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                {!isJewelry ? (
                  <>
                    {product.size && (
                      <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">{product.size}</div>
                        <div className="text-sm text-muted-foreground">Volume</div>
                      </div>
                    )}
                    {product.concentration && (
                      <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">{product.concentration}</div>
                        <div className="text-sm text-muted-foreground">Concentration</div>
                      </div>
                    )}
                    {product.gender && (
                      <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">{product.gender}</div>
                        <div className="text-sm text-muted-foreground">For</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">{product.stockCount}</div>
                      <div className="text-sm text-muted-foreground">In Stock</div>
                    </div>
                  </>
                ) : (
                  <div className="text-center col-span-2">
                    <div className="text-2xl font-bold gradient-text">{product.stockCount}</div>
                    <div className="text-sm text-muted-foreground">In Stock</div>
                  </div>
                )}
              </div>
            )}

            {/* Fragrance Notes (for perfumes) - Only show if notes exist */}
            {!isJewelry && (product.topNotes?.length || product.middleNotes?.length || product.baseNotes?.length) && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Product Notes
                </h3>
                <div className="space-y-3">
                  {product.topNotes && product.topNotes?.length > 0 && (
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-1 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-amber-600">Top Notes:</span>
                        <span className="text-muted-foreground ml-2">{product.topNotes.join(", ")}</span>
                      </div>
                    </div>
                  )}
                  {product.middleNotes && product.middleNotes?.length > 0 && (
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mt-1 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-orange-600">Middle Notes:</span>
                        <span className="text-muted-foreground ml-2">{product.middleNotes.join(", ")}</span>
                      </div>
                    </div>
                  )}
                  {product.baseNotes && product.baseNotes?.length > 0 && (
                    <div className="flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mt-1 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-yellow-600">Base Notes:</span>
                        <span className="text-muted-foreground ml-2">{product.baseNotes.join(", ")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  disabled={quantity >= product.stockCount}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">{product.stockCount} in stock</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full gradient-primary text-white border-0 hover:opacity-90 transition-opacity"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $5000</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Easy returns</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Authentic</p>
                  <p className="text-xs text-muted-foreground">100% genuine</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Product Profile
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This {product.category}</h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{product.description}</p>

                {/* Additional product details will be displayed when available from the backend */}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  Product Pyramid
                </h3>

                {isJewelry ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Jewelry specifications will be displayed when available from the backend.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        Top Notes (First 15 minutes)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(product.topNotes || []).map((note, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-amber-100 text-amber-800 border-amber-200"
                          >
                            {note}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/30">
                      <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        Middle Notes (Heart - 2-4 hours)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(product.middleNotes || []).map((note, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-orange-100 text-orange-800 border-orange-200"
                          >
                            {note}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
                      <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        Base Notes (Dry down - 4+ hours)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(product.baseNotes || []).map((note, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 border-yellow-200"
                          >
                            {note}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review form */}
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Write a review</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((r) => (
                          <button key={r} type="button" aria-label={`Rate ${r}`} onClick={() => setRating(r)} className={`p-1 rounded ${rating >= r ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input placeholder="Your name (optional)" value={reviewName} onChange={(e) => setReviewName(e.target.value)} />
                  </div>
                  <div className="mt-3">
                    <Textarea placeholder="Share your experience" value={comment} onChange={(e) => setComment(e.target.value)} />
                  </div>
                  <div className="mt-3">
                    <Button onClick={handleSubmitReview} disabled={creatingReview}>Submit review</Button>
                  </div>
                </div>

                {/* Reviews list */}
                <div className="space-y-4">
                  <h3 className="font-medium">Customer reviews</h3>
                  {reviewsLoading ? (
                    <p className="text-sm text-muted-foreground">Loading reviews…</p>
                  ) : (localReviews?.length ?? 0) === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
                  ) : (
                    <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {(localReviews ?? []).map((r: Review) => (
                        <li key={r._id} className="border rounded p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{r.name || 'Anonymous'}</div>
                            <div className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                          </div>
                          {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                          <div className="mt-1 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-playfair gradient-text mb-4">You Might Also Like</h2>
              <p className="text-muted-foreground">
                Similar {isJewelry ? "jewelry pieces" : "fragrances"} from our collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
