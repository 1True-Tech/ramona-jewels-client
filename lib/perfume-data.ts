export interface Perfume {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    image: string
    images: string[] // Add this line
    rating?: number
    reviews?: number
    badge?: string
    category: string
    size: string
    concentration: "EDT" | "EDP" | "Parfum" | "EDC"
    topNotes: string[]
    middleNotes: string[]
    baseNotes: string[]
    description: string
    gender: "Men" | "Women" | "Unisex"
    inStock: boolean
    stockCount: number
  }
  
  export const mockPerfumes: Perfume[] = [
    {
      id: "1",
      name: "Midnight Rose",
      brand: "Luxury Scents",
      price: 129.99,
      originalPrice: 159.99,
      image: "/placeholder.svg?height=300&width=300&text=Midnight+Rose",
      images: [
        "/placeholder.svg?height=600&width=600&text=Midnight+Rose+1",
        "/placeholder.svg?height=600&width=600&text=Midnight+Rose+2",
        "/placeholder.svg?height=600&width=600&text=Midnight+Rose+3",
        "/placeholder.svg?height=600&width=600&text=Midnight+Rose+4",
      ],
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      category: "floral",
      size: "50ml",
      concentration: "EDP",
      topNotes: ["Rose", "Bergamot", "Pink Pepper"],
      middleNotes: ["Jasmine", "Peony", "Lily of the Valley"],
      baseNotes: ["Musk", "Sandalwood", "Amber"],
      description:
        "A captivating floral fragrance that embodies elegance and femininity with its rich rose heart and sophisticated blend of precious florals.",
      gender: "Women",
      inStock: true,
      stockCount: 25,
    },
    // Update other products similarly with images array
    {
      id: "2",
      name: "Ocean Breeze",
      brand: "Aqua Fragrances",
      price: 89.99,
      image: "/placeholder.svg?height=300&width=300&text=Ocean+Breeze",
      images: [
        "/placeholder.svg?height=600&width=600&text=Ocean+Breeze+1",
        "/placeholder.svg?height=600&width=600&text=Ocean+Breeze+2",
        "/placeholder.svg?height=600&width=600&text=Ocean+Breeze+3",
        "/placeholder.svg?height=600&width=600&text=Ocean+Breeze+4",
      ],
      rating: 4.6,
      reviews: 89,
      badge: "Fresh",
      category: "aquatic",
      size: "75ml",
      concentration: "EDT",
      topNotes: ["Sea Salt", "Lemon", "Mint"],
      middleNotes: ["Marine Notes", "Lavender", "Geranium"],
      baseNotes: ["Driftwood", "Musk", "Ambergris"],
      description:
        "A refreshing aquatic fragrance that captures the essence of ocean waves and sea breeze with crisp marine accords.",
      gender: "Unisex",
      inStock: true,
      stockCount: 18,
    },
    // Continue with other products...
    {
      id: "3",
      name: "Velvet Oud",
      brand: "Oriental Luxe",
      price: 199.99,
      originalPrice: 249.99,
      image: "/placeholder.svg?height=300&width=300&text=Velvet+Oud",
      images: [
        "/placeholder.svg?height=600&width=600&text=Velvet+Oud+1",
        "/placeholder.svg?height=600&width=600&text=Velvet+Oud+2",
        "/placeholder.svg?height=600&width=600&text=Velvet+Oud+3",
        "/placeholder.svg?height=600&width=600&text=Velvet+Oud+4",
      ],
      rating: 4.9,
      reviews: 156,
      category: "oriental",
      size: "30ml",
      concentration: "Parfum",
      topNotes: ["Saffron", "Rose", "Cardamom"],
      middleNotes: ["Oud", "Patchouli", "Incense"],
      baseNotes: ["Vanilla", "Amber", "Sandalwood"],
      description: "An opulent oriental fragrance featuring precious oud and exotic spices in a luxurious composition.",
      gender: "Unisex",
      inStock: true,
      stockCount: 12,
    },
    {
      id: "4",
      name: "Citrus Burst",
      brand: "Fresh & Clean",
      price: 69.99,
      image: "/placeholder.svg?height=300&width=300&text=Citrus+Burst",
      images: [
        "/placeholder.svg?height=600&width=600&text=Citrus+Burst+1",
        "/placeholder.svg?height=600&width=600&text=Citrus+Burst+2",
        "/placeholder.svg?height=600&width=600&text=Citrus+Burst+3",
        "/placeholder.svg?height=600&width=600&text=Citrus+Burst+4",
      ],
      rating: 4.7,
      reviews: 203,
      badge: "Energizing",
      category: "citrus",
      size: "100ml",
      concentration: "EDT",
      topNotes: ["Grapefruit", "Lemon", "Orange"],
      middleNotes: ["Neroli", "Petitgrain", "Mint"],
      baseNotes: ["White Musk", "Cedar", "Vetiver"],
      description: "An invigorating citrus fragrance perfect for daily wear and energizing moments with zesty freshness.",
      gender: "Unisex",
      inStock: true,
      stockCount: 30,
    },
    {
      id: "5",
      name: "Smoky Leather",
      brand: "Masculine Edge",
      price: 149.99,
      image: "/placeholder.svg?height=300&width=300&text=Smoky+Leather",
      images: [
        "/placeholder.svg?height=600&width=600&text=Smoky+Leather+1",
        "/placeholder.svg?height=600&width=600&text=Smoky+Leather+2",
        "/placeholder.svg?height=600&width=600&text=Smoky+Leather+3",
        "/placeholder.svg?height=600&width=600&text=Smoky+Leather+4",
      ],
      rating: 4.5,
      reviews: 67,
      category: "woody",
      size: "50ml",
      concentration: "EDP",
      topNotes: ["Black Pepper", "Bergamot", "Cardamom"],
      middleNotes: ["Leather", "Tobacco", "Rose"],
      baseNotes: ["Oud", "Patchouli", "Vanilla"],
      description: "A bold and masculine fragrance with rich leather and smoky tobacco notes for the confident man.",
      gender: "Men",
      inStock: true,
      stockCount: 15,
    },
    {
      id: "6",
      name: "Garden Party",
      brand: "Bloom & Blossom",
      price: 94.99,
      image: "/placeholder.svg?height=300&width=300&text=Garden+Party",
      images: [
        "/placeholder.svg?height=600&width=600&text=Garden+Party+1",
        "/placeholder.svg?height=600&width=600&text=Garden+Party+2",
        "/placeholder.svg?height=600&width=600&text=Garden+Party+3",
        "/placeholder.svg?height=600&width=600&text=Garden+Party+4",
      ],
      rating: 4.8,
      reviews: 145,
      category: "floral",
      size: "75ml",
      concentration: "EDP",
      topNotes: ["Peach", "Green Leaves", "Freesia"],
      middleNotes: ["Peony", "Magnolia", "Lily"],
      baseNotes: ["White Musk", "Cedar", "Blonde Woods"],
      description: "A delightful floral bouquet that captures the joy of a spring garden party with fresh blooms.",
      gender: "Women",
      inStock: true,
      stockCount: 22,
    },
  ]
  
  export const perfumeCategories = [
    {
      id: "floral",
      name: "Floral",
      description: "Romantic and feminine scents",
      image: "/placeholder.svg?height=300&width=400&text=Floral+Fragrances",
      productCount: 45,
    },
    {
      id: "oriental",
      name: "Oriental",
      description: "Exotic and mysterious fragrances",
      image: "/placeholder.svg?height=300&width=400&text=Oriental+Fragrances",
      productCount: 32,
    },
    {
      id: "woody",
      name: "Woody",
      description: "Warm and sophisticated scents",
      image: "/placeholder.svg?height=300&width=400&text=Woody+Fragrances",
      productCount: 28,
    },
    {
      id: "citrus",
      name: "Citrus",
      description: "Fresh and energizing fragrances",
      image: "/placeholder.svg?height=300&width=400&text=Citrus+Fragrances",
      productCount: 35,
    },
    {
      id: "aquatic",
      name: "Aquatic",
      description: "Clean and refreshing scents",
      image: "/placeholder.svg?height=300&width=400&text=Aquatic+Fragrances",
      productCount: 18,
    },
  ]
  