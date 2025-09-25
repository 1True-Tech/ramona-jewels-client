"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useGetRandomReviewsQuery } from "@/store/api/reviewsApi"

export function TestimonialsSection() {
  const { data: reviews = [], isLoading, error } = useGetRandomReviewsQuery(3)

  return (
    <section className="py-12 lg:py-17">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border shadow-sm animate-pulse h-40" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-sm text-muted-foreground">Unable to load testimonials right now.</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">No testimonials yet. Be the first to review a product!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-semibold">{review.name || "Anonymous"}</h4>
                    {/* Optionally show product link or date */}
                    {/* <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p> */}
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                  <p className="text-muted-foreground italic pl-4">{review.comment}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
