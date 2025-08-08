export interface Product {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    image: string
    images: string[]
    rating?: number
    reviews?: number
    badge?: string
    category: string
    type: "jewelry" | "perfume"
    inStock: boolean
    stockCount: number
    description: string
  }
  
  export interface JewelryProduct extends Product {
    type: "jewelry"
    material: string
    gemstone?: string
    size?: string
    weight?: string
    collection: string
  }
  
  export interface PerfumeProduct extends Product {
    type: "perfume"
    size: string
    concentration: "EDT" | "EDP" | "Parfum" | "EDC"
    topNotes: string[]
    middleNotes: string[]
    baseNotes: string[]
    gender: "Men" | "Women" | "Unisex"
  }
  
  export const mockJewelry: JewelryProduct[] = [
    {
      id: "j1",
      name: "Eternal Diamond Solitaire Ring",
      brand: "Ramona Jewels",
      price: 2499.99,
      originalPrice: 2999.99,
      image: "https://media.istockphoto.com/id/845498088/photo/gold-jewelry-diamond-shop-with-rings-and-necklaces-luxury-retail-store-window-display-showcase.jpg?s=612x612&w=0&k=20&c=yw28xctANl_hM7DXpueYNErP7uXtIwwRtmp3s2UCWt4=",
      images: [
        "https://media.istockphoto.com/id/845498088/photo/gold-jewelry-diamond-shop-with-rings-and-necklaces-luxury-retail-store-window-display-showcase.jpg?s=612x612&w=0&k=20&c=yw28xctANl_hM7DXpueYNErP7uXtIwwRtmp3s2UCWt4=",
        "https://media.istockphoto.com/id/1437123557/photo/jewelry-diamond-rings-show-in-luxury-retail-store-window-display-showcase.jpg?s=612x612&w=0&k=20&c=ZORtUyA8DVY379fj_5mQQft1jy2cRf8bGM9o8fi2ie8=",
        "https://media.istockphoto.com/id/1405510204/photo/jewelry-diamond-rings-show-in-luxury-retail-store-window-display-showcase.jpg?s=612x612&w=0&k=20&c=eUkcZ5QPTpNmR4hMwzpfhMIhM0jeZqX_siloqMu0wY0=",
        "https://media.istockphoto.com/id/874633156/photo/gold-jewelry-diamond-shop-with-rings-and-necklaces-luxury-retail-store-window-display.jpg?s=612x612&w=0&k=20&c=OjO8wY4ao2GdCOKp4fTPYCIOpCKS2P5KGCu4oJZa_OI=",
        "https://media.istockphoto.com/id/1405510204/photo/jewelry-diamond-rings-show-in-luxury-retail-store-window-display-showcase.jpg?s=612x612&w=0&k=20&c=eUkcZ5QPTpNmR4hMwzpfhMIhM0jeZqX_siloqMu0wY0=",
      ],
      rating: 4.9,
      reviews: 89,
      badge: "Bestseller",
      category: "rings",
      type: "jewelry",
      material: "18K White Gold",
      gemstone: "1.2ct Diamond",
      size: "Adjustable",
      weight: "3.2g",
      collection: "Eternal Collection",
      description:
        "A timeless solitaire ring featuring a brilliant-cut diamond set in premium 18K white gold. Perfect for engagements and special occasions.",
      inStock: true,
      stockCount: 12,
    },
    {
      id: "j2",
      name: "Rose Gold Tennis Bracelet",
      brand: "Atelier Rose",
      price: 1899.99,
      image: "/placeholder.svg?height=300&width=300&text=Tennis+Bracelet",
      images: [
        "/placeholder.svg?height=600&width=600&text=Tennis+Bracelet+1",
        "/placeholder.svg?height=600&width=600&text=Tennis+Bracelet+2",
        "/placeholder.svg?height=600&width=600&text=Tennis+Bracelet+3",
        "/placeholder.svg?height=600&width=600&text=Tennis+Bracelet+4",
      ],
      rating: 4.8,
      reviews: 156,
      badge: "New",
      category: "bracelets",
      type: "jewelry",
      material: "18K Rose Gold",
      gemstone: "2.5ct Total Diamonds",
      size: "7 inches",
      weight: "12.8g",
      collection: "Rose Garden Collection",
      description:
        "Elegant tennis bracelet featuring round brilliant diamonds set in lustrous 18K rose gold. A perfect statement piece for any occasion.",
      inStock: true,
      stockCount: 8,
    },
    {
      id: "j3",
      name: "Sapphire Halo Earrings",
      brand: "Royal Gems",
      price: 1299.99,
      originalPrice: 1599.99,
      image: "/placeholder.svg?height=300&width=300&text=Sapphire+Earrings",
      images: [
        "/placeholder.svg?height=600&width=600&text=Sapphire+Earrings+1",
        "/placeholder.svg?height=600&width=600&text=Sapphire+Earrings+2",
        "/placeholder.svg?height=600&width=600&text=Sapphire+Earrings+3",
        "/placeholder.svg?height=600&width=600&text=Sapphire+Earrings+4",
      ],
      rating: 4.7,
      reviews: 73,
      category: "earrings",
      type: "jewelry",
      material: "Platinum",
      gemstone: "Blue Sapphire & Diamonds",
      weight: "4.6g",
      collection: "Royal Collection",
      description:
        "Stunning halo earrings featuring Ceylon blue sapphires surrounded by brilliant diamonds in platinum setting.",
      inStock: true,
      stockCount: 15,
    },
    {
      id: "j4",
      name: "Pearl & Diamond Necklace",
      brand: "Ocean Pearls",
      price: 3299.99,
      image: "/placeholder.svg?height=300&width=300&text=Pearl+Necklace",
      images: [
        "/placeholder.svg?height=600&width=600&text=Pearl+Necklace+1",
        "/placeholder.svg?height=600&width=600&text=Pearl+Necklace+2",
        "/placeholder.svg?height=600&width=600&text=Pearl+Necklace+3",
        "/placeholder.svg?height=600&width=600&text=Pearl+Necklace+4",
      ],
      rating: 4.9,
      reviews: 124,
      badge: "Luxury",
      category: "necklaces",
      type: "jewelry",
      material: "18K Yellow Gold",
      gemstone: "Tahitian Pearls & Diamonds",
      size: "18 inches",
      weight: "28.5g",
      collection: "Ocean Dreams Collection",
      description:
        "Exquisite necklace featuring lustrous Tahitian pearls accented with brilliant diamonds in 18K yellow gold.",
      inStock: true,
      stockCount: 5,
    },
  ]
  
  export const mockPerfumes: PerfumeProduct[] = [
    {
      id: "p1",
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
      type: "perfume",
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
    {
      id: "p2",
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
      type: "perfume",
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
    {
      id: "p3",
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
      type: "perfume",
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
  ]
  
  export const allProducts: (JewelryProduct | PerfumeProduct)[] = [...mockJewelry, ...mockPerfumes]
  
  export const jewelryCategories = [
    {
      id: "rings",
      name: "Rings",
      description: "Engagement, wedding & fashion rings",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 45,
    },
    {
      id: "necklaces",
      name: "Necklaces",
      description: "Elegant chains & pendants",
      image: "https://images.unsplash.com/photo-1450297166380-cabe503887e5?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 32,
    },
    {
      id: "earrings",
      name: "Earrings",
      description: "Studs, hoops & drop earrings",
      image: "https://plus.unsplash.com/premium_photo-1661645433820-24c8604e4db5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 28,
    },
    {
      id: "bracelets",
      name: "Bracelets",
      description: "Tennis, charm & cuff bracelets",
      image: "https://images.unsplash.com/photo-1585632702624-cccae2e0ad15?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 35,
    },
  ]
  
  export const perfumeCategories = [
    {
      id: "floral",
      name: "Floral",
      description: "Romantic and feminine scents",
      image: "https://images.unsplash.com/photo-1711967152883-658d72561616?q=80&w=1444&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 45,
    },
    {
      id: "oriental",
      name: "Oriental",
      description: "Exotic and mysterious fragrances",
      image: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 32,
    },
    {
      id: "woody",
      name: "Woody",
      description: "Warm and sophisticated scents",
      image: "https://plus.unsplash.com/premium_photo-1674865345778-fa29c016a67c?q=80&w=663&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 28,
    },
    {
      id: "aquatic",
      name: "Aquatic",
      description: "Clean and refreshing scents",
      image: "https://images.unsplash.com/photo-1644332913400-22107614a236?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      productCount: 18,
    },
  ]
  