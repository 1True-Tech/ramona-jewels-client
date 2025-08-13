"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, Sparkles } from "lucide-react";
import { allProducts } from "@/lib/product-data";
import { Product, ProductCard } from "../products/product-card";

const featuredProducts = allProducts.slice(0, 6).map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  rating: product.rating,
  reviews: product.reviews,
  badge: product.badge,
  type: product.type, // 'jewelry' or 'perfumes'
}));

export function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Jewelry" | "Perfumes">("All");

  const filteredProducts =
    selectedCategory === "All"
      ? featuredProducts
      : featuredProducts.filter(
          (product) => product.type.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section className="py-16 lg:py-24 px-[16px] md:px-6 lg:px-[8.5rem]">
      <div className="w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-playfair gradient-text mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of exquisite jewelry and luxury fragrances from renowned designers and
            perfumers.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center space-x-4 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-full border border-primary">
            {["All", "Jewelry", "Perfumes"].map((category) => (
              <Button
                key={category}
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCategory(category as "All" | "Jewelry" | "Perfumes")}
                className={`rounded-full w-[6.3rem] md:w-[7rem] ${
                  selectedCategory === category
                    ? "gradient-primary text-white border-0"
                    : "hover:bg-primary/10"
                }`}
              >
                {category === "Perfumes" ? (
                  <Sparkles className="h-4 w-4 mr-2" />
                ) : (
                  <Gem className="h-4 w-4 mr-2" />
                )}
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 mb-12">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Products Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/products">
            <Button size="lg" variant="outline" className="group bg-transparent border-primary/20 hover:bg-primary/5">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
