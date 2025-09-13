"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
// import { allProducts } from "@/lib/product-data";
import { Product as UIProduct, ProductCard } from "../products/product-card";
import { useGetProductsQuery } from "@/store/api/productsApi";
import type { Product as ApiProduct } from "@/store/apiTypes";
import { useGetProductTypesQuery } from "@/store/api/productTypesApi";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import { toServerImageUrl } from "@/lib/utils/imageUtils";

const toImageUrl = (src?: string) => toServerImageUrl(src || "/placeholder.svg");

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
  // Fetch 10 latest products from backend directly
  const { data } = useGetProductsQuery({ limit: 10, sort: "-createdAt" });
  const { data: typesResp } = useGetProductTypesQuery();

  const [selectedTypeId, setSelectedTypeId] = useState<string | "all">("all");

  // Fetch categories for the selected type to filter products by category membership (like /products)
  const { data: typeCategoriesResp } = useGetCategoriesQuery(
    selectedTypeId === "all" ? undefined : { productType: selectedTypeId }
  );

  const typeCategoryNames = useMemo(
    () => new Set((typeCategoriesResp?.data ?? []).map((c: any) => String(c.name))),
    [typeCategoriesResp]
  );

  const productTypes = typesResp?.data ?? [];

  const apiProducts: ApiProduct[] = useMemo(() => (data?.data ?? []), [data]);

  const filteredApiProducts: ApiProduct[] = useMemo(() => {
    if (selectedTypeId === "all") return apiProducts;
    if (!typeCategoryNames.size) return [];
    return apiProducts.filter((p) => typeCategoryNames.has(String(p.category)));
  }, [apiProducts, selectedTypeId, typeCategoryNames]);

  const displayedProducts: UIProduct[] = useMemo(() => filteredApiProducts.map(toUIProduct), [filteredApiProducts]);

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

        {/* Type Filter Tabs (Dynamic like /products) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-full border border-primary overflow-x-auto max-w-full">
            <Button
              variant={selectedTypeId === "all" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full ${
                selectedTypeId === "all" ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedTypeId("all")}
            >
              All Products
            </Button>
            {productTypes.map((t: any) => (
              <Button
                key={t._id}
                variant={selectedTypeId === t._id ? "default" : "ghost"}
                size="sm"
                className={`rounded-full ${
                  selectedTypeId === t._id ? "gradient-primary text-white border-0" : "hover:bg-primary/10"
                }`}
                onClick={() => setSelectedTypeId(t._id)}
              >
                {t.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 mb-12 justify-items-center items-center">
          <AnimatePresence>
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="w-full h-full"
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
