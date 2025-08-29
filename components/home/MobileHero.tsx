"use client"
import Image from "next/image"
import { motion } from 'framer-motion';
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Gem } from "lucide-react";

export function MobileHero(isChristmas) {
  return (
    <div className="relative h-[20rem] w-full lg:hidden overflow-hidden rounded-b-4xl shadow-md">
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 py-6 text-black space-y-2">
        <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-6xl font-bold font-playfair tracking-tight"
            >
            Exquisite
            <span className="gradient-text block">Jewelry & Fragrances</span>
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

        <Link href="/products">
            <Button
                size="lg"
                className="group gradient-primary text-white border-0 hover:opacity-90 transition-opacity rounded-full"
            >
                <Gem className="mr-2 h-4 w-4" />
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </Link>
      </div>

      {/* Floating Image Section */}
      <div className="absolute right-4 bottom-0">
        <div className="bg-white backdrop-blur-sm h-[15rem] w-[9rem] px-2 pt-2 rounded-t-full flex items-center justify-center shadow-xl overflow-hidden">
          <Image
            src="https://media.istockphoto.com/id/2199608255/photo/child-girl-giving-a-gift-to-mother-at-home.webp?a=1&b=1&s=612x612&w=0&k=20&c=mqc-S-W0YkuulweIdNO3qR1a3kFkAFvMR3-9NusC6J8="
            alt="Product"
            width={120}
            height={120}
            className="object-cover w-full h-full rounded-t-full"
          />
        </div>
      </div>
    </div>
  )
}
