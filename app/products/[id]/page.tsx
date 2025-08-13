"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Award,
  Clock,
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { allProducts, type JewelryProduct, type PerfumeProduct } from "@/lib/product-data"
import { Navbar } from "@/components/layouts/navbar"
import { Product, ProductCard } from "@/components/products/product-card"
import { MobileNav } from "@/components/layouts/mobile-nav"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  // Find the product by ID
  const product = allProducts.find((p) => p.id === productId) || allProducts[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  // Get related products (same type, different products)
  const relatedProducts = allProducts
    .filter((p) => p.type === product.type && p.id !== product.id)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.image,
      rating: p.rating,
      reviews: p.reviews,
      badge: p.badge,
      type: p.type,
    }))

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}(s) added to your cart.`,
    })
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isJewelry = product.type === "jewelry"
  const jewelryProduct = product as JewelryProduct
  const perfumeProduct = product as PerfumeProduct

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
                <Badge variant="destructive" className="absolute top-4 right-4">
                  -{discount}%
                </Badge>
              )}
              <Badge variant="outline" className="absolute bottom-4 left-4 bg-background/80 border-primary/20">
                {isJewelry ? (
                  <>
                    <Gem className="h-3 w-3 mr-1" />
                    Jewelry
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Perfume
                  </>
                )}
              </Badge>
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
                        i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {product.rating} ({product.reviews} reviews)
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

            {/* Product Specifications */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
              {isJewelry ? (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{jewelryProduct.material}</div>
                    <div className="text-sm text-muted-foreground">Material</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{jewelryProduct.gemstone || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Gemstone</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{jewelryProduct.weight || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">Weight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{jewelryProduct.collection}</div>
                    <div className="text-sm text-muted-foreground">Collection</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{perfumeProduct.size}</div>
                    <div className="text-sm text-muted-foreground">Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{perfumeProduct.concentration}</div>
                    <div className="text-sm text-muted-foreground">Concentration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{perfumeProduct.gender}</div>
                    <div className="text-sm text-muted-foreground">For</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">{product.stockCount}</div>
                    <div className="text-sm text-muted-foreground">In Stock</div>
                  </div>
                </>
              )}
            </div>

            {/* Fragrance Notes (for perfumes) */}
            {!isJewelry && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Fragrance Notes
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-1 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-amber-600">Top Notes:</span>
                      <span className="text-muted-foreground ml-2">{perfumeProduct.topNotes.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mt-1 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-orange-600">Middle Notes:</span>
                      <span className="text-muted-foreground ml-2">{perfumeProduct.middleNotes.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mt-1 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-yellow-600">Base Notes:</span>
                      <span className="text-muted-foreground ml-2">{perfumeProduct.baseNotes.join(", ")}</span>
                    </div>
                  </div>
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
                  <p className="text-xs text-muted-foreground">On orders over $500</p>
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
                {isJewelry ? "Specifications" : "Fragrance Profile"}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This {isJewelry ? "Piece" : "Fragrance"}</h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{product.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                    <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Perfect For
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {isJewelry ? (
                        <>
                          <li>• Special occasions</li>
                          <li>• Anniversary gifts</li>
                          <li>• Elegant evenings</li>
                          <li>• Sophisticated style</li>
                        </>
                      ) : (
                        <>
                          <li>• Evening occasions</li>
                          <li>• Special events</li>
                          <li>• Romantic dinners</li>
                          <li>• Confident personalities</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                    <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {isJewelry ? "Care Instructions" : "Longevity"}
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {isJewelry ? (
                        <>
                          <li>• Store in jewelry box</li>
                          <li>• Clean with soft cloth</li>
                          <li>• Avoid harsh chemicals</li>
                          <li>• Professional cleaning yearly</li>
                        </>
                      ) : (
                        <>
                          <li>• 6-8 hours wear time</li>
                          <li>• Moderate sillage</li>
                          <li>• Best in cool weather</li>
                          <li>• Apply to pulse points</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">
                  {isJewelry ? "Detailed Specifications" : "Fragrance Pyramid"}
                </h3>

                {isJewelry ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold mb-2">Materials & Construction</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span className="font-medium">{jewelryProduct.material}</span>
                          </div>
                          {jewelryProduct.gemstone && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gemstone:</span>
                              <span className="font-medium">{jewelryProduct.gemstone}</span>
                            </div>
                          )}
                          {jewelryProduct.weight && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-medium">{jewelryProduct.weight}</span>
                            </div>
                          )}
                          {jewelryProduct.size && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size:</span>
                              <span className="font-medium">{jewelryProduct.size}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold mb-2">Collection Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Collection:</span>
                            <span className="font-medium">{jewelryProduct.collection}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Brand:</span>
                            <span className="font-medium">{product.brand}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium capitalize">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                      <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        Top Notes (First 15 minutes)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {perfumeProduct.topNotes.map((note, index) => (
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
                        {perfumeProduct.middleNotes.map((note, index) => (
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
                        {perfumeProduct.baseNotes.map((note, index) => (
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    Write a Review
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                    <div className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{product.reviews} reviews</div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-primary"
                            style={{ width: `${Math.random() * 80 + 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Sample reviews */}
                  <div className="p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-medium">Sarah M.</span>
                      <span className="text-sm text-muted-foreground">Verified Purchase</span>
                    </div>
                    <p className="text-muted-foreground">
                      {isJewelry
                        ? "Absolutely stunning piece! The craftsmanship is exceptional and it looks even better in person. Perfect for special occasions."
                        : "Absolutely love this fragrance! The scent is sophisticated and long-lasting. Perfect for evening wear."}
                    </p>
                  </div>
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
                <ProductCard key={relatedProduct.id} product={relatedProduct as Product} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
