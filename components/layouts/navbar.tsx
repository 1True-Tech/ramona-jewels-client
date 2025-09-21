"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingCart, User, Menu, X, Heart, Gem, Handbag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/redux-auth-context"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { state } = useCart()
  const { state: wishlistState } = useWishlist()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/products" },
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-white border-b border-primary/20 px-[16px] md:px-6 xl:px-[8.5rem]">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group md:pr-10">
            <div className="relative">
              <div className="h-10 w-10 gradient-primary rounded-full p-[2px] flex items-center justify-center jewelry-sparkle overflow-hidden">
                <Image src="/Ramona-Logo.jpg" alt="Ramona Jewels" width={100} height={100} className="rounded-full"/>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-playfair gradient-text whitespace-nowrap">Mona's Kreashon</span>
              <span className="text-xs text-muted-foreground -mt-1">Jewelry & Fragrances</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jewelry & fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border border-primary focus:outline-none outline-none ring-0 ring-white"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Heart className="h-8 w-8" />
                {wishlistState.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-primary text-white border-0">
                    {wishlistState.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <ShoppingCart className="h-5 w-5" />
                {state.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-primary text-white border-0">
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Orders - Only show for authenticated users */}
            {user && (
              <Link href="/orders" className="hidden lg:block">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Handbag className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href={user.role === "admin" ? "/admin" : "/profile"}>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} className="hidden md:inline-flex hover:bg-primary/10">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="hover:bg-primary/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="gradient-primary text-white border-0 hover:opacity-90">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jewelry & fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-primary/20 outline-none ring-white"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block pr-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-accent"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Orders link for authenticated users */}
                {user && (
                  <Link
                    href="/orders"
                    className="block pr-3 py-2 text-base font-medium rounded-md transition-colors text-muted-foreground hover:text-primary hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Handbag className="h-4 w-4" />
                      Orders
                    </div>
                  </Link>
                )}

                {/* User Menu */}
                {user ? (
                  <div className={`flex md:hidden items-center space-x-2 mt-4 ${user ? "" : "hidden"}`}>
                    <Button variant="ghost" onClick={logout} className="inline-flex md:hidden hover:bg-primary/10 h-9 w-full gradient-primary text-white text-md font-bold">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className={`flex md:hidden items-center space-x-2 mt-4 ${user ? "" : "hidden"}`}>
                    <Link href="/auth/login">
                      <Button variant="ghost" className="hover:bg-primary/10">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="gradient-primary text-white border-0 hover:opacity-90">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Auth */}
              {!user && (
                <div className="flex space-x-2 pt-4 border-t mt-2">
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent border-primary/20">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1">
                    <Button className="w-full gradient-primary text-white border-0">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
