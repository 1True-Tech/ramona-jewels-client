import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategorySection } from "@/components/home/category-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
// import { NewsletterSection } from "@/components/home/newsletter-section"
import { Navbar } from "@/components/layouts/navbar"
import { Footer } from "@/components/layouts/footer"
import { MobileNav } from "@/components/layouts/mobile-nav"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20">
        <HeroSection />
        <FeaturedProducts />
        <CategorySection />
        <TestimonialsSection />
        {/* <NewsletterSection /> */}
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
