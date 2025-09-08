"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Gem, Sparkles, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/redux-auth-context"
import { useToast } from "@/hooks/use-toast"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviews?: number
  badge?: string
  type?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      })
      return
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    // toast({
    //   title: "Added to cart",
    //   description: `${product.name} has been added to your cart.`,
    //   variant: "success",
    // })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      })
      return
    }
    
    const isCurrentlyInWishlist = isInWishlist(product.id)
    
    if (isCurrentlyInWishlist) {
      removeFromWishlist(product.id)
      // toast({
      //   title: "Removed from wishlist",
      //   description: `${product.name} has been removed from your wishlist.`,
      //   variant: "info",
      // })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.type || "products",
        type: product.type || "products",
      })
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getProductUrl = () => {
    return `/products/${product.id}`
  }

  const renderTypeBadgeContent = () => {
    if (!product.type) return null
  
    return (
      <>
        {product.type}
      </>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card rounded-lg border border-primary/10 overflow-hidden transition-all duration-300 jewelry-sparkle min-w-full h-full"
    >
      <Link href={getProductUrl()}>
        <div className="relative aspect-square overflow-hidden w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge && <Badge className="text-xs gradient-primary text-white border-0">{product.badge}</Badge>}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs bg-red-400">
                -{discount}%
              </Badge>
            )}
            {product.type && (
              <Badge variant="outline" className="text-xs border-primary/20 bg-white">
                {renderTypeBadgeContent()}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-primary/20 ${
              isInWishlist(product.id) ? "text-red-500" : ""
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
          </Button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              className="w-full gradient-primary text-white border-0 hover:opacity-90"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors font-playfair">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg gradient-text">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] md:text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
