"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Sparkles, Gem, Crown, Snowflake, Gift } from "lucide-react"
import { MobileHero } from "./MobileHero"
import { useMemo } from "react"



export function HeroSection() {

  const startChristmasMonth = 9 //set your preferred month to start christmas sales
  const isChristmas = useMemo(() => {
    const today = new Date()
    const month = today.getMonth() // 0 = Jan, 11 = Dec
    return month >= startChristmasMonth && month <= 11; // October to December
  }, [])

  return (
    <section className="relative bg-gradient-hero overflow-hidden rounded-b-4xl lg:rounded-b-none">
      {isChristmas ? (
      /* 🎄 Christmas Frame */
        <div className="absolute inset-0 rounded-b-3xl lg:rounded-b-none p-[6px] overflow-hidden
            bg-[conic-gradient(from_45deg,#e11d48_0_25%,#ffffff_0_50%,#e11d48_0_75%,#ffffff_0_100%)]
            [background-size:22px_22px] shadow-lg">

            {/* Inner panel (the actual hero background) */}
            <div className="absolute inset-0 rounded-b-[1.35rem] lg:rounded-b-none overflow-hidden">
              {/* Festive gradient base */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800 via-emerald-600 to-red-700" />

              {/* Soft vignette + inner glow */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]" />
              <div className="absolute inset-0 ring-1 ring-white/15" />

              {/* Snow overlay (two staggered dot grids) */}
              <div className="absolute inset-0 opacity-70 pointer-events-none
              [background-image:radial-gradient(#ffffff_1px,transparent_1px),radial-gradient(#ffffff_1px,transparent_1px)]
              [background-size:22px_22px,30px_30px]
              [background-position:0_0,11px_15px]" />

              {/* Optional corner ornaments (SVG snowflakes) */}
              <Snowflake className="absolute top-3 left-13 h-16 w-16 opacity-90 text-white" />
              <Snowflake className="absolute top-3 right-40 h-6 w-6 opacity-90 text-white"/>
              <svg className="absolute top-3 left-3 h-16 w-16 opacity-90" viewBox="0 0 54 54" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93" strokeLinecap="round"/>
            </svg>

            <Gift className="absolute top-12 lg:top-3 right-14 h-16 w-16 text-white" />
            
            <Gift className="absolute bottom-3 left-13 h-16 w-16 opacity-90 text-white " />

            <Snowflake className="absolute bottom-3 right-3 h-46 w-46 rotate-45 text-white" />
            <Snowflake className="absolute bottom-3 left-13 h-6 w-6 opacity-50 rotate-45 text-white" />
            
            <svg className="absolute bottom-3 right-3 h-6 w-6 opacity-90 rotate-45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93" strokeLinecap="round"/>
            </svg>
            </div>
        </div>
      ) :
        (<div className="absolute inset-0 bg-[url('/images/TestImage.jpg')] opacity-5"></div>)
      }

      <MobileHero startChristmasMonth={startChristmasMonth}/>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative hidden lg:block">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className={`text-sm ${isChristmas ? "text-white" : "text-muted-foreground"}`}>Trusted by luxury connoisseurs worldwide</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-bold font-playfair tracking-tight"
              >
                Exquisite
                <span className="gradient-text block pb-2 whitespace-nowrap">Jewelry & Fragrances</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg max-w-md leading-relaxed ${isChristmas ? "text-white" : "text-muted-foreground"}`}
              >
                Discover our curated collection of fine jewelry and luxury fragrances. Each piece tells a story of
                craftsmanship, elegance, and timeless beauty.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/products">
                <Button
                  size="lg"
                  className="group gradient-primary text-white border-0 hover:opacity-90 transition-opacity"
                >
                  <Gem className="mr-2 h-4 w-4" />
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="">
                <Button variant="outline" size="lg" className={`bg-transparent ${isChristmas ? "text-black border-2 border-black" : "text-black border-primary/20 hover:bg-primary/5"}`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Shop Fragrances
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex items-center space-x-8 text-sm ${isChristmas ? "text-white" : "text-muted-foreground"}`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Certified Authentic</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Expert Curation</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square lg:aspect-[6/5] rounded-2xl overflow-hidden jewelry-sparkle">
              <Image
                src="https://images.unsplash.com/photo-1599458350242-6052c0716ee5?q=80&w=2036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Luxury Jewelry & Perfume Collection"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-4 -left-4 bg-background rounded-lg p-4 shadow-lg border border-primary/20"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                  <Crown className="text-white h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Premium Collection</p>
                  <p className="text-xs text-muted-foreground">Handcrafted luxury</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-background rounded-lg p-4 shadow-lg border border-primary/20"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Certified Authentic</p>
                  <p className="text-xs text-muted-foreground">100% genuine</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
