"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Gem, Award, Clock, Zap, Gift, MessageCircle, ChevronLeft, ChevronRight, Ruler, Palette, Info, Crown, SparklesIcon } from 'lucide-react'
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { mockJewelry, type JewelryProduct } from "@/lib/product-data"
import Link from "next/link"
import { Navbar } from "@/components/layouts/navbar"
import { ProductCard } from "@/components/products/product-card"
import { MobileNav } from "@/components/layouts/mobile-nav"

export default function JewelryDetailPage() {
  const params = useParams()
  const productId = params.id as string

  // Find the jewelry product by ID
  const product = mockJewelry.find((p) => p.id === productId) || mockJewelry[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedMetal, setSelectedMetal] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  // Get related jewelry products
  const getRelatedProducts = () => {
    const sameCategory = mockJewelry.filter((p) => p.category === product.category && p.id !== product.id)
    const sameBrand = mockJewelry.filter((p) => p.brand === product.brand && p.id !== product.id)
    const sameCollection = mockJewelry.filter((p) => p.collection === product.collection && p.id !== product.id)

    // Prioritize: same collection > same category > same brand
    const related = [
      ...sameCollection.slice(0, 2),
      ...sameCategory.filter((p) => !sameCollection.includes(p)).slice(0, 1),
      ...sameBrand.filter((p) => !sameCollection.includes(p) && !sameCategory.includes(p)).slice(0, 1),
    ].slice(0, 4)

    return related.map((p) => ({
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
  }

  const relatedProducts = getRelatedProducts()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedMetal,
      })
    }
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name}(s) added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Product link has been copied to clipboard.",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  // Jewelry-specific options
  const sizeOptions = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"]
  const metalOptions = ["White Gold", "Yellow Gold", "Rose Gold", "Platinum"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-muted-foreground mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/jewelry" className="hover:text-primary transition-colors">
            Jewelry
          </Link>
          <span>/</span>
          <Link href={`/jewelry/${product.category}`} className="hover:text-primary transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 jewelry-sparkle group">
              <Image
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                priority
              />

              {/* Image Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && <Badge className="gradient-primary text-white border-0">{product.badge}</Badge>}
                {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
                <Badge variant="outline" className="bg-background/80 border-primary/20">
                  <Gem className="h-3 w-3 mr-1" />
                  Fine Jewelry
                </Badge>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm border border-primary/20">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Grid */}
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

            {/* Jewelry Features */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
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
                  <p className="font-medium text-sm">Certified Authentic</p>
                  <p className="text-xs text-muted-foreground">With certificate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Lifetime Warranty</p>
                  <p className="text-xs text-muted-foreground">Manufacturing defects</p>
                </div>
              </div>
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
                <Badge variant="outline" className="border-primary/20">
                  {product.collection}
                </Badge>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
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
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Read Reviews
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold gradient-text">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      Save ${(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Jewelry Specifications */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{product.material}</div>
                <div className="text-sm text-muted-foreground">Material</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{product.gemstone || "N/A"}</div>
                <div className="text-sm text-muted-foreground">Gemstone</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{product.weight || "N/A"}</div>
                <div className="text-sm text-muted-foreground">Weight</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{product.collection}</div>
                <div className="text-sm text-muted-foreground">Collection</div>
              </div>
            </div>

            {/* Size Selection */}
            {product.category === "rings" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Ring Size</h3>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 text-xs">
                    <Info className="h-3 w-3 mr-1" />
                    Size Guide
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={
                        selectedSize === size
                          ? "gradient-primary text-white border-0"
                          : "border-primary/20 hover:bg-primary/5"
                      }
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Metal Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Metal Type</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {metalOptions.map((metal) => (
                  <Button
                    key={metal}
                    variant={selectedMetal === metal ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMetal(metal)}
                    className={
                      selectedMetal === metal
                        ? "gradient-primary text-white border-0"
                        : "border-primary/20 hover:bg-primary/5"
                    }
                  >
                    {metal}
                  </Button>
                ))}
              </div>
            </div>

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
                {product.stockCount <= 5 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                    <Zap className="h-3 w-3 mr-1" />
                    Limited Stock
                  </Badge>
                )}
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
                {product.inStock
                  ? `Add to Cart - $${(product.price * quantity).toLocaleString()}`
                  : "Out of Stock"}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent"
                  onClick={handleWishlist}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
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

              {/* Jewelry-specific Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent">
                  <Gift className="h-4 w-4 mr-2" />
                  Gift Box
                </Button>
                <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent">
                  <Award className="h-4 w-4 mr-2" />
                  Engrave
                </Button>
                <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 border border-green-200 dark:border-green-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-400">Authenticity & Quality Guarantee</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Certified conflict-free diamonds and precious metals with lifetime warranty and certificate of
                authenticity.
              </p>
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
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger value="care" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Care & Warranty
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Jewelry Piece</h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{product.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                    <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Perfect For
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Engagement & wedding ceremonies</li>
                      <li>• Anniversary celebrations</li>
                      <li>• Special milestone events</li>
                      <li>• Elegant evening occasions</li>
                      <li>• Sophisticated daily wear</li>
                      <li>• Investment jewelry collection</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                    <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Craftsmanship
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Handcrafted by master artisans</li>
                      <li>• Premium materials & gemstones</li>
                      <li>• Precision setting techniques</li>
                      <li>• Quality control certified</li>
                      <li>• Lifetime craftsmanship warranty</li>
                      <li>• Conflict-free certified diamonds</li>
                    </ul>
                  </div>
                </div>

                {/* Brand Story */}
                <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
                  <h4 className="font-semibold mb-3 text-primary">About {product.brand}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.brand} represents the pinnacle of luxury jewelry craftsmanship, combining traditional
                    techniques with contemporary design. Each piece is meticulously created to embody elegance, quality,
                    and timeless beauty that transcends generations. Our commitment to ethical sourcing and sustainable
                    practices ensures that every piece tells a story of responsibility and care.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Detailed Specifications</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Gem className="h-4 w-4 text-primary" />
                        Materials & Construction
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Material:</span>
                          <span className="font-medium">{product.material}</span>
                        </div>
                        {product.gemstone && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gemstone:</span>
                            <span className="font-medium">{product.gemstone}</span>
                          </div>
                        )}
                        {product.weight && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="font-medium">{product.weight}</span>
                          </div>
                        )}
                        {product.size && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium">{product.size}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Finish:</span>
                          <span className="font-medium">High Polish</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Setting:</span>
                          <span className="font-medium">Prong Setting</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hallmark:</span>
                          <span className="font-medium">Certified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold mb-3">Collection Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Collection:</span>
                          <span className="font-medium">{product.collection}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Brand:</span>
                          <span className="font-medium">{product.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium capitalize">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Style:</span>
                          <span className="font-medium">Contemporary</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occasion:</span>
                          <span className="font-medium">Special Events</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Warranty:</span>
                          <span className="font-medium">Lifetime</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Certificate:</span>
                          <span className="font-medium">Included</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = Math.floor(Math.random() * 50) + 5
                      const percentage = (count / (product.reviews || 100)) * 100
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{stars}★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-primary"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  {/* Sample jewelry reviews */}
                  {[
                    {
                      name: "Sarah M.",
                      rating: 5,
                      date: "2 weeks ago",
                      verified: true,
                      review:
                        "Absolutely stunning piece! The craftsmanship is exceptional and it looks even better in person. The diamonds are brilliant and the setting is perfect. Worth every penny!",
                    },
                    {
                      name: "Michael R.",
                      rating: 5,
                      date: "1 month ago",
                      verified: true,
                      review:
                        "Bought this as an engagement ring and my fiancée loves it! The quality is outstanding and the customer service was excellent. The certificate of authenticity gives great peace of mind.",
                    },
                    {
                      name: "Emma L.",
                      rating: 4,
                      date: "2 months ago",
                      verified: true,
                      review:
                        "Beautiful piece, exactly as described. The only reason I'm giving 4 stars instead of 5 is that shipping took a bit longer than expected, but the quality makes up for it. Very happy with my purchase!",
                    },
                  ].map((review, index) => (
                    <div key={index} className="p-4 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center font-semibold text-primary">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.name}</span>
                              {review.verified && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="care" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Care Instructions & Warranty</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Jewelry Care
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Store in original jewelry box or soft pouch</li>
                        <li>• Clean with soft, lint-free cloth after each wear</li>
                        <li>• Avoid contact with perfumes, lotions, and chemicals</li>
                        <li>• Remove before swimming, showering, or exercising</li>
                        <li>• Professional cleaning recommended annually</li>
                        <li>• Inspect settings regularly for loose stones</li>
                        <li>• Keep away from harsh chemicals and abrasives</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-primary/20">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        Important Information
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• All diamonds are conflict-free certified</li>
                        <li>• Metals are hypoallergenic and nickel-free</li>
                        <li>• Lifetime warranty covers manufacturing defects</li>
                        <li>• Free resizing within 30 days of purchase</li>
                        <li>• Certificate of authenticity included</li>
                        <li>• Professional appraisal available upon request</li>
                        <li>• Insurance documentation provided</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Warranty Information */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 border border-green-200 dark:border-green-800/20">
                  <h4 className="font-semibold mb-3 text-green-800 dark:text-green-400 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Lifetime Warranty
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    We stand behind the quality of our jewelry with a comprehensive lifetime warranty covering
                    manufacturing defects, stone settings, and metal integrity. This warranty ensures your investment is
                    protected for generations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">Manufacturing Defects</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Stone Security</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Metal Integrity</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Free Repairs</Badge>
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
                Discover similar jewelry pieces from our {product.collection} collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/jewelry">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                  View All Jewelry
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
