"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Gem, Sparkles } from "lucide-react"
import { jewelryCategories, perfumeCategories } from "@/lib/product-data"

export function CategorySection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-playfair gradient-text mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse collections of fine jewelry and luxury fragrances, each carefully curated for the
            discerning connoisseur.
          </p>
        </motion.div>

        {/* Jewelry Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <Gem className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold font-playfair gradient-text">Fine Jewelry</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jewelryCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Link href={`/jewelry/${category.id}`}>
                  <div className="group relative overflow-hidden rounded-lg bg-card border border-primary/20 hover:shadow-lg transition-all duration-300 jewelry-sparkle">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="text-xl font-bold font-playfair mb-1">{category.name}</h4>
                        <p className="text-sm opacity-90 mb-2">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-75">{category.productCount} pieces</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Perfume Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold font-playfair gradient-text">Luxury Fragrances</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perfumeCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Link href={`/perfumes/${category.id}`}>
                  <div className="group relative overflow-hidden rounded-lg bg-card border border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="text-xl font-bold font-playfair mb-1">{category.name}</h4>
                        <p className="text-sm opacity-90 mb-2">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-75">{category.productCount} fragrances</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
