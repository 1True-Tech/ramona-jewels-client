// this will be a demo display, so this route will still be available
export default function JewerlyPage(){
    return null
}
// remove the above code, and replace it with the real one


// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import Image from "next/image"
// import { useParams } from "next/navigation"
// import { Separator } from "@/components/ui/separator"
// import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Sparkles, Award, Clock, Zap, Gift, MessageCircle, ChevronLeft, ChevronRight, Droplets, Wind, Info, Palette, Sun, Moon } from 'lucide-react'
// import { useCart } from "@/contexts/cart-context"
// import { useToast } from "@/hooks/use-toast"
// import { mockPerfumes } from "@/lib/product-data"
// import Link from "next/link"
// import { Navbar } from "@/components/layouts/navbar"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { ProductCard } from "@/components/products/product-card"
// import { MobileNav } from "@/components/layouts/mobile-nav"


// export default function PerfumeDetailPage() {
//   const params = useParams()
//   const productId = params.id as string

//   // Find the perfume product by ID
//   const product = mockPerfumes.find((p) => p.id === productId) || mockPerfumes[0]

//   const [selectedImage, setSelectedImage] = useState(0)
//   const [quantity, setQuantity] = useState(1)
//   const [selectedSize, setSelectedSize] = useState("")
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const { addItem } = useCart()
//   const { toast } = useToast()

//   // Get related perfume products
//   const getRelatedProducts = () => {
//     const sameCategory = mockPerfumes.filter((p) => p.category === product.category && p.id !== product.id)
//     const sameBrand = mockPerfumes.filter((p) => p.brand === product.brand && p.id !== product.id)
//     const sameGender = mockPerfumes.filter((p) => p.gender === product.gender && p.id !== product.id)

//     // Prioritize: same category > same gender > same brand
//     const related = [
//       ...sameCategory.slice(0, 2),
//       ...sameGender.filter((p) => !sameCategory.includes(p)).slice(0, 1),
//       ...sameBrand.filter((p) => !sameCategory.includes(p) && !sameGender.includes(p)).slice(0, 1),
//     ].slice(0, 4)

//     return related.map((p) => ({
//       id: p.id,
//       name: p.name,
//       price: p.price,
//       originalPrice: p.originalPrice,
//       image: p.image,
//       rating: p.rating,
//       reviews: p.reviews,
//       badge: p.badge,
//       type: p.type,
//     }))
//   }

//   const relatedProducts = getRelatedProducts()

//   const handleAddToCart = () => {
//     for (let i = 0; i < quantity; i++) {
//       addItem({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         size: selectedSize,
//       })
//     }
//     toast({
//       title: "Added to cart",
//       description: `${quantity} ${product.name}(s) added to your cart.`,
//     })
//   }

//   const handleWishlist = () => {
//     setIsWishlisted(!isWishlisted)
//     toast({
//       title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
//       description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
//     })
//   }

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: product.name,
//           text: product.description,
//           url: window.location.href,
//         })
//       } catch (error) {
//         navigator.clipboard.writeText(window.location.href)
//         toast({
//           title: "Link copied",
//           description: "Product link has been copied to clipboard.",
//         })
//       }
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast({
//         title: "Link copied",
//         description: "Product link has been copied to clipboard.",
//       })
//     }
//   }

//   const discount = product.originalPrice
//     ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
//     : 0

//   const nextImage = () => {
//     setSelectedImage((prev) => (prev + 1) % product.images.length)
//   }

//   const prevImage = () => {
//     setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
//   }

//   // Perfume-specific options
//   const sizeOptions = ["30ml", "50ml", "100ml"]

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Breadcrumb */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center space-x-2 text-sm text-muted-foreground mb-8"
//         >
//           <Link href="/" className="hover:text-primary transition-colors">
//             Home
//           </Link>
//           <span>/</span>
//           <Link href="/perfumes" className="hover:text-primary transition-colors">
//             Perfumes
//           </Link>
//           <span>/</span>
//           <Link href={`/perfumes/${product.category}`} className="hover:text-primary transition-colors capitalize">
//             {product.category}
//           </Link>
//           <span>/</span>
//           <span className="text-foreground">{product.name}</span>
//         </motion.div>

//         <div className="grid lg:grid-cols-2 gap-12">
//           {/* Product Images */}
//           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
//             <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 group">
//               <Image
//                 src={product.images[selectedImage] || product.image}
//                 alt={product.name}
//                 fill
//                 className="object-cover transition-transform group-hover:scale-105"
//                 priority
//               />

//               {/* Image Navigation */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
//                 onClick={prevImage}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-background hover:bg-background border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
//                 onClick={nextImage}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>

//               {/* Badges */}
//               <div className="absolute top-4 left-4 flex flex-col gap-2">
//                 {product.badge && <Badge className="gradient-primary text-white border-0">{product.badge}</Badge>}
//                 {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
//                 <Badge variant="outline" className="bg-background/80 border-primary/20">
//                   <Sparkles className="h-3 w-3 mr-1" />
//                   Luxury Fragrance
//                 </Badge>
//               </div>

//               {/* Image Counter */}
//               <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm border border-primary/20">
//                 {selectedImage + 1} / {product.images.length}
//               </div>
//             </div>

//             {/* Thumbnail Grid */}
//             <div className="grid grid-cols-4 gap-2">
//               {product.images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
//                     selectedImage === index
//                       ? "border-primary shadow-lg scale-105"
//                       : "border-transparent hover:border-primary/50"
//                   }`}
//                 >
//                   <Image
//                     src={image || "/placeholder.svg"}
//                     alt={`${product.name} ${index + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Perfume Features */}
//             <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
//               <div className="flex items-center gap-2">
//                 <Truck className="h-5 w-5 text-primary" />
//                 <div>
//                   <p className="font-medium text-sm">Free Shipping</p>
//                   <p className="text-xs text-muted-foreground">On orders over $75</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <RotateCcw className="h-5 w-5 text-primary" />
//                 <div>
//                   <p className="font-medium text-sm">30-Day Returns</p>
//                   <p className="text-xs text-muted-foreground">Easy returns</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Shield className="h-5 w-5 text-primary" />
//                 <div>
//                   <p className="font-medium text-sm">Authentic</p>
//                   <p className="text-xs text-muted-foreground">100% genuine</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Droplets className="h-5 w-5 text-primary" />
//                 <div>
//                   <p className="font-medium text-sm">Sample Available</p>
//                   <p className="text-xs text-muted-foreground">Try before you buy</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Product Info */}
//           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
//                   {product.brand}
//                 </Badge>
//                 <Badge variant="outline" className="capitalize border-primary/20">
//                   {product.category}
//                 </Badge>
//                 <Badge variant="outline" className="border-primary/20">
//                   {product.gender}
//                 </Badge>
//                 {product.inStock ? (
//                   <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
//                 ) : (
//                   <Badge variant="destructive">Out of Stock</Badge>
//                 )}
//               </div>

//               <h1 className="text-3xl lg:text-4xl font-bold font-playfair mb-4 gradient-text">{product.name}</h1>

//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                   <span className="text-sm text-muted-foreground ml-2">
//                     {product.rating} ({product.reviews} reviews)
//                   </span>
//                 </div>
//                 <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
//                   <MessageCircle className="h-4 w-4 mr-1" />
//                   Read Reviews
//                 </Button>
//               </div>

//               <div className="flex items-center gap-4 mb-6">
//                 <span className="text-4xl font-bold gradient-text">${product.price}</span>
//                 {product.originalPrice && (
//                   <div className="flex flex-col">
//                     <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
//                     <span className="text-sm text-green-600 font-medium">
//                       Save ${(product.originalPrice - product.price).toFixed(2)}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
//             </div>

//             {/* Perfume Specifications */}
//             <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
//               <div className="text-center">
//                 <div className="text-2xl font-bold gradient-text">{product.size}</div>
//                 <div className="text-sm text-muted-foreground">Volume</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold gradient-text">{product.concentration}</div>
//                 <div className="text-sm text-muted-foreground">Concentration</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold gradient-text">6-8 hrs</div>
//                 <div className="text-sm text-muted-foreground">Longevity</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold gradient-text">Moderate</div>
//                 <div className="text-sm text-muted-foreground">Sillage</div>
//               </div>
//             </div>

//             {/* Fragrance Notes */}
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold flex items-center gap-2">
//                 <Sparkles className="h-5 w-5 text-primary" />
//                 Fragrance Notes
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex gap-3">
//                   <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 mt-1 flex-shrink-0"></div>
//                   <div>
//                     <span className="font-medium text-amber-600">Top Notes:</span>
//                     <span className="text-muted-foreground ml-2">{product.topNotes.join(", ")}</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mt-1 flex-shrink-0"></div>
//                   <div>
//                     <span className="font-medium text-orange-600">Middle Notes:</span>
//                     <span className="text-muted-foreground ml-2">{product.middleNotes.join(", ")}</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mt-1 flex-shrink-0"></div>
//                   <div>
//                     <span className="font-medium text-yellow-600">Base Notes:</span>
//                     <span className="text-muted-foreground ml-2">{product.baseNotes.join(", ")}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Size Selection */}
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 <Droplets className="h-4 w-4 text-primary" />
//                 <h3 className="font-medium">Size</h3>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {sizeOptions.map((size) => (
//                   <Button
//                     key={size}
//                     variant={selectedSize === size ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => setSelectedSize(size)}
//                     className={
//                       selectedSize === size
//                         ? "gradient-primary text-white border-0"
//                         : "border-primary/20 hover:bg-primary/5"
//                     }
//                   >
//                     {size}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* Best For */}
//             <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10 border border-purple-200 dark:border-purple-800/20">
//               <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-400 flex items-center gap-2">
//                 <Palette className="h-4 w-4" />
//                 Perfect For
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 <Badge className="bg-purple-100 text-purple-800 border-purple-200">
//                   <Sun className="h-3 w-3 mr-1" />
//                   Evening Wear
//                 </Badge>
//                 <Badge className="bg-purple-100 text-purple-800 border-purple-200">
//                   <Moon className="h-3 w-3 mr-1" />
//                   Special Occasions
//                 </Badge>
//                 <Badge className="bg-purple-100 text-purple-800 border-purple-200">
//                   <Wind className="h-3 w-3 mr-1" />
//                   Cool Weather
//                 </Badge>
//               </div>
//             </div>

//             {/* Quantity */}
//             <div>
//               <h3 className="font-medium mb-3">Quantity</h3>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={quantity <= 1}
//                   className="border-primary/20 hover:bg-primary/5"
//                 >
//                   <Minus className="h-4 w-4" />
//                 </Button>
//                 <span className="w-12 text-center font-medium text-lg">{quantity}</span>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
//                   disabled={quantity >= product.stockCount}
//                   className="border-primary/20 hover:bg-primary/5"
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//                 <span className="text-sm text-muted-foreground ml-2">{product.stockCount} in stock</span>
//                 {product.stockCount <= 10 && (
//                   <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
//                     <Zap className="h-3 w-3 mr-1" />
//                     Low Stock
//                   </Badge>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="space-y-3">
//               <Button
//                 size="lg"
//                 className="w-full gradient-primary text-white border-0 hover:opacity-90 transition-opacity"
//                 onClick={handleAddToCart}
//                 disabled={!product.inStock}
//               >
//                 <ShoppingCart className="h-5 w-5 mr-2" />
//                 {product.inStock ? `Add to Cart - $${(product.price * quantity).toFixed(2)}` : "Out of Stock"}
//               </Button>

//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent"
//                   onClick={handleWishlist}
//                 >
//                   <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
//                   {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent"
//                   onClick={handleShare}
//                 >
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Share
//                 </Button>
//               </div>

//               {/* Perfume-specific Actions */}
//               <div className="flex gap-2">
//                 <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent">
//                   <Gift className="h-4 w-4 mr-2" />
//                   Gift Wrap
//                 </Button>
//                 <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent">
//                   <Droplets className="h-4 w-4 mr-2" />
//                   Sample
//                 </Button>
//                 <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 bg-transparent">
//                   <Sparkles className="h-4 w-4 mr-2" />
//                   Discover
//                 </Button>
//               </div>
//             </div>

//             {/* Trust Indicators */}
//             <div className="p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 border border-green-200 dark:border-green-800/20">
//               <div className="flex items-center gap-2 mb-2">
//                 <Shield className="h-5 w-5 text-green-600" />
//                 <span className="font-medium text-green-800 dark:text-green-400">Authenticity Guarantee</span>
//               </div>
//               <p className="text-sm text-green-700 dark:text-green-300">
//                 100% authentic fragrance with batch verification and quality guarantee. Cruelty-free and ethically
//                 sourced ingredients.
//               </p>
//             </div>
//           </motion.div>
//         </div>

//         {/* Product Details Tabs */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mt-16"
//         >
//           <Tabs defaultValue="description" className="w-full">
//             <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
//               <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//                 Description
//               </TabsTrigger>
//               <TabsTrigger
//                 value="specifications"
//                 className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
//               >
//                 Fragrance Profile
//               </TabsTrigger>
//               <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//                 Reviews ({product.reviews})
//               </TabsTrigger>
//               <TabsTrigger value="care" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
//                 Care & Info
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="description" className="mt-6">
//               <div className="prose max-w-none">
//                 <h3 className="text-xl font-semibold mb-4">About This Fragrance</h3>
//                 <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{product.description}</p>

//                 <div className="grid md:grid-cols-2 gap-6 mt-8">
//                   <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
//                     <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
//                       <Award className="h-4 w-4" />
//                       Perfect For
//                     </h4>
//                     <ul className="text-sm text-muted-foreground space-y-1">
//                       <li>• Evening occasions & date nights</li>
//                       <li>• Special events & celebrations</li>
//                       <li>• Professional meetings</li>
//                       <li>• Confident personalities</li>
//                       <li>• Signature scent seekers</li>
//                       <li>• Cool weather seasons</li>
//                     </ul>
//                   </div>
//                   <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
//                     <h4 className="font-semibold mb-2 text-primary flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       Longevity & Performance
//                     </h4>
//                     <ul className="text-sm text-muted-foreground space-y-1">
//                       <li>• 6-8 hours wear time</li>
//                       <li>• Moderate to strong sillage</li>
//                       <li>• Best performance in cool weather</li>
//                       <li>• Apply to pulse points for longevity</li>
//                       <li>• Complements skin chemistry</li>
//                       <li>• Evolves beautifully over time</li>
//                     </ul>
//                   </div>
//                 </div>

//                 {/* Brand Story */}
//                 <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
//                   <h4 className="font-semibold mb-3 text-primary">About {product.brand}</h4>
//                   <p className="text-muted-foreground leading-relaxed">
//                     {product.brand} represents the art of fine perfumery, creating sophisticated fragrances that tell
//                     stories and evoke emotions. Each scent is carefully crafted using the finest ingredients sourced
//                     from around the world, blending traditional perfumery techniques with modern innovation to create
//                     truly memorable olfactory experiences.
//                   </p>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="specifications" className="mt-6">
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold mb-4">Fragrance Pyramid</h3>

//                 <div className="space-y-6">
//                   <div className="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/30">
//                     <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//                       Top Notes (First 15 minutes)
//                     </h4>
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {product.topNotes.map((note, index) => (
//                         <Badge
//                           key={index}
//                           variant="secondary"
//                           className="bg-amber-100 text-amber-800 border-amber-200"
//                         >
//                           {note}
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="text-sm text-amber-700 dark:text-amber-300">
//                       The initial impression that creates the first spark of attraction and sets the mood.
//                     </p>
//                   </div>

//                   <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800/30">
//                     <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-orange-500"></div>
//                       Middle Notes (Heart - 2-4 hours)
//                     </h4>
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {product.middleNotes.map((note, index) => (
//                         <Badge
//                           key={index}
//                           variant="secondary"
//                           className="bg-orange-100 text-orange-800 border-orange-200"
//                         >
//                           {note}
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="text-sm text-orange-700 dark:text-orange-300">
//                       The soul of the fragrance that defines its character and personality.
//                     </p>
//                   </div>

//                   <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
//                     <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                       Base Notes (Dry down - 4+ hours)
//                     </h4>
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {product.baseNotes.map((note, index) => (
//                         <Badge
//                           key={index}
//                           variant="secondary"
//                           className="bg-yellow-100 text-yellow-800 border-yellow-200"
//                         >
//                           {note}
//                         </Badge>
//                       ))}
//                     </div>
//                     <p className="text-sm text-yellow-700 dark:text-yellow-300">
//                       The lasting foundation that provides depth and creates memorable impressions.
//                     </p>
//                   </div>

//                   {/* Fragrance Details */}
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <div className="p-4 rounded-lg border border-primary/20">
//                       <h4 className="font-semibold mb-3">Fragrance Details</h4>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Concentration:</span>
//                           <span className="font-medium">{product.concentration}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Volume:</span>
//                           <span className="font-medium">{product.size}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Gender:</span>
//                           <span className="font-medium">{product.gender}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Longevity:</span>
//                           <span className="font-medium">6-8 hours</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Sillage:</span>
//                           <span className="font-medium">Moderate</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Projection:</span>
//                           <span className="font-medium">Strong</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="p-4 rounded-lg border border-primary/20">
//                       <h4 className="font-semibold mb-3">Best For</h4>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Season:</span>
//                           <span className="font-medium">Fall/Winter</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Time of Day:</span>
//                           <span className="font-medium">Evening</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Occasion:</span>
//                           <span className="font-medium">Special Events</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Age Group:</span>
//                           <span className="font-medium">25-45</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Personality:</span>
//                           <span className="font-medium">Sophisticated</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-muted-foreground">Mood:</span>
//                           <span className="font-medium">Confident</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="reviews" className="mt-6">
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold">Customer Reviews</h3>
//                   <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
//                     Write a Review
//                   </Button>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-6">
//                   <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10 border border-primary/20">
//                     <div className="text-center">
//                       <div className="text-4xl font-bold gradient-text mb-2">{product.rating}</div>
//                       <div className="flex justify-center mb-2">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${
//                               i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <div className="text-sm text-muted-foreground">{product.reviews} reviews</div>
//                     </div>
//                   </div>

//                   <div className="md:col-span-2 space-y-4">
//                     {[5, 4, 3, 2, 1].map((stars) => {
//                       const count = Math.floor(Math.random() * 50) + 5
//                       const percentage = (count / (product.reviews || 100)) * 100
//                       return (
//                         <div key={stars} className="flex items-center gap-3">
//                           <span className="text-sm w-8">{stars}★</span>
//                           <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
//                             <div
//                               className="h-full gradient-primary"
//                               style={{ width: `${Math.min(percentage, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-sm text-muted-foreground w-8">{count}</span>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-6">
//                   {/* Sample perfume reviews */}
//                   {[
//                     {
//                       name: "Sarah M.",
//                       rating: 5,
//                       date: "2 weeks ago",
//                       verified: true,
//                       review:
//                         "This fragrance is absolutely divine! The scent is sophisticated and long-lasting. I get compliments every time I wear it. Perfect for evening occasions and the bottle is gorgeous too!",
//                     },
//                     {
//                       name: "Michael R.",
//                       rating: 5,
//                       date: "1 month ago",
//                       verified: true,
//                       review:
//                         "Excellent fragrance with great longevity. The scent profile is complex and evolves beautifully throughout the day. Great value for the quality and the packaging is premium.",
//                     },
//                     {
//                       name: "Emma L.",
//                       rating: 4,
//                       date: "2 months ago",
//                       verified: true,
//                       review:
//                         "Love this scent! It's unique and sophisticated. The only downside is that it's a bit strong for daytime wear, but perfect for evenings. The projection is excellent.",
//                     },
//                   ].map((review, index) => (
//                     <div key={index} className="p-4 rounded-lg border border-primary/20">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center font-semibold text-primary">
//                             {review.name.charAt(0)}
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <span className="font-medium">{review.name}</span>
//                               {review.verified && (
//                                 <Badge
//                                   variant="outline"
//                                   className="text-xs bg-green-50 text-green-700 border-green-200"
//                                 >
//                                   Verified Purchase
//                                 </Badge>
//                               )}
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <div className="flex">
//                                 {[...Array(5)].map((_, i) => (
//                                   <Star
//                                     key={i}
//                                     className={`h-3 w-3 ${
//                                       i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
//                                     }`}
//                                   />
//                                 ))}
//                               </div>
//                               <span className="text-xs text-muted-foreground">{review.date}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-muted-foreground">{review.review}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="care" className="mt-6">
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold mb-4">Care Instructions & Information</h3>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="p-4 rounded-lg border border-primary/20">
//                       <h4 className="font-semibold mb-3 flex items-center gap-2">
//                         <Shield className="h-4 w-4 text-primary" />
//                         Fragrance Care
//                       </h4>
//                       <ul className="text-sm text-muted-foreground space-y-2">
//                         <li>• Store in cool, dry place away from direct sunlight</li>
//                         <li>• Keep bottle upright and tightly closed</li>
//                         <li>• Avoid extreme temperature changes</li>
//                         <li>• Apply to pulse points for best projection</li>
//                         <li>• Don't rub fragrance into skin after application</li>
//                         <li>• Use within 3-5 years for optimal quality</li>
//                         <li>• Keep away from heat sources</li>
//                       </ul>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="p-4 rounded-lg border border-primary/20">
//                       <h4 className="font-semibold mb-3 flex items-center gap-2">
//                         <Info className="h-4 w-4 text-primary" />
//                         Important Information
//                       </h4>
//                       <ul className="text-sm text-muted-foreground space-y-2">
//                         <li>• Contains natural and synthetic ingredients</li>
//                         <li>• Patch test recommended for sensitive skin</li>
//                         <li>• Alcohol-based formula for longevity</li>
//                         <li>• Cruelty-free and ethically sourced</li>
//                         <li>• Batch code ensures authenticity</li>
//                         <li>• Recyclable packaging materials</li>
//                         <li>• Made in France with premium ingredients</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quality Guarantee */}
//                 <div className="p-6 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10 border border-green-200 dark:border-green-800/20">
//                   <h4 className="font-semibold mb-3 text-green-800 dark:text-green-400 flex items-center gap-2">
//                     <Award className="h-4 w-4" />
//                     Quality Guarantee
//                   </h4>
//                   <p className="text-sm text-green-700 dark:text-green-300 mb-3">
//                     We guarantee the authenticity and quality of our fragrances. Each bottle comes with a batch
//                     verification code and is sourced directly from authorized distributors. If you're not completely
//                     satisfied, return within 30 days for a full refund.
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     <Badge className="bg-green-100 text-green-800 border-green-200">Authenticity Guaranteed</Badge>
//                     <Badge className="bg-green-100 text-green-800 border-green-200">30-Day Returns</Badge>
//                     <Badge className="bg-green-100 text-green-800 border-green-200">Quality Assured</Badge>
//                     <Badge className="bg-green-100 text-green-800 border-green-200">Cruelty-Free</Badge>
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </motion.div>

//         {/* Related Products */}
//         {relatedProducts.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-16"
//           >
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold font-playfair gradient-text mb-4">You Might Also Like</h2>
//               <p className="text-muted-foreground">
//                 Discover similar fragrances from our {product.category} collection
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {relatedProducts.map((relatedProduct, index) => (
//                 <motion.div
//                   key={relatedProduct.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 + index * 0.1 }}
//                 >
//                   <ProductCard product={relatedProduct} />
//                 </motion.div>
//               ))}
//             </div>

//             <div className="text-center mt-8">
//               <Link href="/perfumes">
//                 <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
//                   View All Perfumes
//                   <ChevronRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       <MobileNav />
//     </div>
//   )
// }
