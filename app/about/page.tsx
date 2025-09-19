import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Gem, Leaf, Shield, Sparkles, HandHeart, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "About | Ramona Jewels",
  description: "Discover the story, values, and craftsmanship behind Ramona Jewels.",
}

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary via-transparent to-primary py-10 px-4 md:p-14">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-74 rounded-full bg-primary blur-3xl" />


        <div className="relative z-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/15 text-primary border-primary/20">Our Story</Badge>
            <h1 className="font-playfair text-4xl md:text-5xl">Crafting Timeless Elegance</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              At Ramona Jewels, we believe every piece should tell your story. From ethically sourced materials 
              to meticulous artistry, our creations are designed to be treasured for a lifetime.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/products">Shop Collections</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:justify-items-end">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Signature Craft</CardTitle>
                <CardDescription>Hand-finished, made to shine every day.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Lifetime Care</CardTitle>
                <CardDescription>Complimentary polishing and inspection.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gem className="h-5 w-5 text-primary" /> Craftsmanship</CardTitle>
            <CardDescription>Each piece is designed with precision and care.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary" /> Sustainability</CardTitle>
            <CardDescription>Ethically sourced gemstones and recycled metals.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HandHeart className="h-5 w-5 text-primary" /> Community</CardTitle>
            <CardDescription>Giving back through local artisan partnerships.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Transparency</CardTitle>
            <CardDescription>Traceable materials and honest pricing.</CardDescription>
          </CardHeader>
        </Card>
      </section>

      <div className="mt-12 lg:flex lg:gap-8 lg:items-start">
        {/* Mission */}
        <section className="">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-3xl font-playfair">Our Mission</CardTitle>
              <CardDescription>
                To craft meaningful jewelry that blends modern design with timeless elegance—responsibly and beautifully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We partner with suppliers who share our values and adhere to rigorous standards of environmental and social responsibility.
                Every design is thoughtfully made to celebrate life’s milestones and everyday moments.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Timeline */}
        <section className="mt-12 lg:mt-0">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <CardDescription>Highlights from our journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="font-medium">2018</p>
                  <p className="text-muted-foreground">Ramona Jewels founded with a mission to bring ethical luxury to everyone.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">2020</p>
                  <p className="text-muted-foreground">Launched our signature collection and partnered with local ateliers.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">2024</p>
                  <p className="text-muted-foreground">Expanded to global shipping with carbon-offset logistics.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Press / Trusted by */}
      <section className="mt-12">
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Trusted By</CardTitle>
            <CardDescription>We’re proud to be featured and supported by great partners.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="relative h-8 grayscale opacity-70"><Image src="/next.svg" alt="Next.js" fill className="object-contain" /></div>
              <div className="relative h-8 grayscale opacity-70"><Image src="/vercel.svg" alt="Vercel" fill className="object-contain" /></div>
              <div className="relative h-8 grayscale opacity-70"><Image src="/paypal.svg" alt="PayPal" fill className="object-contain" /></div>
              <div className="relative h-8 grayscale opacity-70"><Image src="/globe.svg" alt="Global" fill className="object-contain" /></div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="mt-12">
        <Card className="border-primary">
          <CardContent className="flex flex-col items-center justify-between gap-4 p-8 md:flex-row">
            <div>
              <h3 className="text-2xl font-playfair">Ready to find your next favorite piece?</h3>
              <p className="text-muted-foreground">Explore our latest arrivals and timeless bestsellers.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/returns">Returns & Care</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}