"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, Sparkles } from "lucide-react";
// import { allProducts } from "@/lib/product-data";
import { Product as UIProduct, ProductCard } from "../products/product-card";
import { useGetProductsQuery } from "@/store/api/productsApi";
import type { Product as ApiProduct } from "@/store/apiTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || (() => {
  try {
    return API_URL ? new URL(API_URL).origin : "";
  } catch {
    return "";
  }
})();
const toImageUrl = (src?: string) => {
  if (!src) return "/placeholder.svg";
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${SERVER_URL}${path}`;
};

const toUIProduct = (p: ApiProduct): UIProduct => ({
  id: p._id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice,
  image: toImageUrl(p.images?.[0]),
  // allow any type string for dynamic product types
  type: p.type,
});

export function FeaturedProducts() {
  // keep current tabs for now; they only affect local filtering of the featured list
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Jewelry" | "Perfumes">("All");
  // Fetch 10 latest products from backend directly
  const { data } = useGetProductsQuery({ limit: 10, sort: "-createdAt" });

  const featured = useMemo(() => {
    const items = (data?.data ?? []).slice();
    return items.map(toUIProduct);
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return featured;
    const type = selectedCategory === "Jewelry" ? "jewelry" : "perfume";
    return featured.filter((p) => (p.type?.toLowerCase?.() || "") === type);
  }, [featured, selectedCategory]);

  return (
    <section className="py-16 lg:py-24 px-[16px] md:px-6 lg:px-[5rem] xl:px-[8.5rem]">
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
            {(["All", "Jewelry", "Perfumes"] as const).map((category) => (
              <Button
                key={category}
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCategory(category)}
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
                <ProductCard product={product} />
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
