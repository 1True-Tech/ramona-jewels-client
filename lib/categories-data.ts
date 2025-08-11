export interface ProductType {
  id: string
  name: string
  label: string
  description: string
  icon: string
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  label: string
  description: string
  productTypeId: string
}

export interface ProductTypeField {
  id: string
  name: string
  label: string
  type: "text" | "number" | "select" | "multiselect" | "textarea" | "boolean"
  required: boolean
  options?: string[]
  placeholder?: string
  description?: string
}

export const productTypes: ProductType[] = [
  {
    id: "jewelry",
    name: "jewelry",
    label: "Jewelry",
    description: "Luxury jewelry items including rings, necklaces, bracelets, and more",
    icon: "💎",
    categories: [
      {
        id: "rings",
        name: "rings",
        label: "Rings",
        description: "Engagement rings, wedding bands, fashion rings",
        productTypeId: "jewelry"
      },
      {
        id: "necklaces",
        name: "necklaces",
        label: "Necklaces",
        description: "Chains, pendants, chokers, statement necklaces",
        productTypeId: "jewelry"
      },
      {
        id: "bracelets",
        name: "bracelets",
        label: "Bracelets",
        description: "Tennis bracelets, bangles, charm bracelets",
        productTypeId: "jewelry"
      },
      {
        id: "earrings",
        name: "earrings",
        label: "Earrings",
        description: "Studs, hoops, drops, chandelier earrings",
        productTypeId: "jewelry"
      },
      {
        id: "watches",
        name: "watches",
        label: "Watches",
        description: "Luxury timepieces, smart watches, vintage watches",
        productTypeId: "jewelry"
      },
      {
        id: "gemstones",
        name: "gemstones",
        label: "Gemstones",
        description: "Loose diamonds, precious stones, semi-precious stones",
        productTypeId: "jewelry"
      },
      {
        id: "sets",
        name: "sets",
        label: "Jewelry Sets",
        description: "Matching jewelry collections and sets",
        productTypeId: "jewelry"
      }
    ]
  },
  {
    id: "perfume",
    name: "perfume",
    label: "Perfume",
    description: "Luxury fragrances for men, women, and unisex",
    icon: "🌸",
    categories: [
      {
        id: "floral",
        name: "floral",
        label: "Floral",
        description: "Rose, jasmine, lily, and other floral scents",
        productTypeId: "perfume"
      },
      {
        id: "woody",
        name: "woody",
        label: "Woody",
        description: "Sandalwood, cedar, oak, and woody fragrances",
        productTypeId: "perfume"
      },
      {
        id: "oriental",
        name: "oriental",
        label: "Oriental",
        description: "Spicy, warm, and exotic oriental fragrances",
        productTypeId: "perfume"
      },
      {
        id: "fresh",
        name: "fresh",
        label: "Fresh",
        description: "Citrus, aquatic, and fresh clean scents",
        productTypeId: "perfume"
      },
      {
        id: "gourmand",
        name: "gourmand",
        label: "Gourmand",
        description: "Sweet, edible, and dessert-like fragrances",
        productTypeId: "perfume"
      },
      {
        id: "aquatic",
        name: "aquatic",
        label: "Aquatic",
        description: "Ocean, marine, and water-inspired scents",
        productTypeId: "perfume"
      },
      {
        id: "citrus",
        name: "citrus",
        label: "Citrus",
        description: "Lemon, orange, bergamot, and citrus fragrances",
        productTypeId: "perfume"
      }
    ]
  },
  {
    id: "accessories",
    name: "accessories",
    label: "Accessories",
    description: "Fashion accessories and luxury items",
    icon: "👜",
    categories: [
      {
        id: "handbags",
        name: "handbags",
        label: "Handbags",
        description: "Luxury handbags, purses, and clutches",
        productTypeId: "accessories"
      },
      {
        id: "scarves",
        name: "scarves",
        label: "Scarves",
        description: "Silk scarves, wraps, and shawls",
        productTypeId: "accessories"
      },
      {
        id: "sunglasses",
        name: "sunglasses",
        label: "Sunglasses",
        description: "Designer sunglasses and eyewear",
        productTypeId: "accessories"
      },
      {
        id: "belts",
        name: "belts",
        label: "Belts",
        description: "Leather belts and designer accessories",
        productTypeId: "accessories"
      },
      {
        id: "wallets",
        name: "wallets",
        label: "Wallets",
        description: "Luxury wallets and card holders",
        productTypeId: "accessories"
      }
    ]
  },
  {
    id: "skincare",
    name: "skincare",
    label: "Skincare",
    description: "Premium skincare and beauty products",
    icon: "✨",
    categories: [
      {
        id: "moisturizers",
        name: "moisturizers",
        label: "Moisturizers",
        description: "Face and body moisturizers",
        productTypeId: "skincare"
      },
      {
        id: "serums",
        name: "serums",
        label: "Serums",
        description: "Anti-aging and treatment serums",
        productTypeId: "skincare"
      },
      {
        id: "cleansers",
        name: "cleansers",
        label: "Cleansers",
        description: "Face washes and cleansing products",
        productTypeId: "skincare"
      },
      {
        id: "masks",
        name: "masks",
        label: "Face Masks",
        description: "Treatment and hydrating masks",
        productTypeId: "skincare"
      },
      {
        id: "sunscreen",
        name: "sunscreen",
        label: "Sunscreen",
        description: "SPF protection and sun care",
        productTypeId: "skincare"
      }
    ]
  }
]

export const productTypeFields: Record<string, ProductTypeField[]> = {
  jewelry: [
    {
      id: "material",
      name: "material",
      label: "Material",
      type: "select",
      required: true,
      options: ["18K Gold", "14K Gold", "White Gold", "Rose Gold", "Platinum", "Silver", "Titanium", "Stainless Steel"],
      placeholder: "Select material"
    },
    {
      id: "gemstone",
      name: "gemstone",
      label: "Gemstone",
      type: "text",
      required: false,
      placeholder: "e.g., 1.2ct Diamond"
    },
    {
      id: "size",
      name: "size",
      label: "Size",
      type: "text",
      required: false,
      placeholder: "e.g., 7, Adjustable, 18 inches"
    },
    {
      id: "weight",
      name: "weight",
      label: "Weight",
      type: "text",
      required: false,
      placeholder: "e.g., 3.2g"
    },
    {
      id: "collection",
      name: "collection",
      label: "Collection",
      type: "text",
      required: false,
      placeholder: "e.g., Eternal Collection"
    },
    {
      id: "certification",
      name: "certification",
      label: "Certification",
      type: "text",
      required: false,
      placeholder: "e.g., GIA Certified"
    }
  ],
  perfume: [
    {
      id: "size",
      name: "size",
      label: "Size",
      type: "select",
      required: true,
      options: ["30ml", "50ml", "75ml", "100ml", "125ml", "150ml"],
      placeholder: "Select size"
    },
    {
      id: "concentration",
      name: "concentration",
      label: "Concentration",
      type: "select",
      required: true,
      options: ["EDT", "EDP", "Parfum", "EDC"],
      placeholder: "Select concentration"
    },
    {
      id: "gender",
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: ["Men", "Women", "Unisex"],
      placeholder: "Select gender"
    },
    {
      id: "topNotes",
      name: "topNotes",
      label: "Top Notes",
      type: "multiselect",
      required: false,
      placeholder: "Add top notes"
    },
    {
      id: "middleNotes",
      name: "middleNotes",
      label: "Middle Notes",
      type: "multiselect",
      required: false,
      placeholder: "Add middle notes"
    },
    {
      id: "baseNotes",
      name: "baseNotes",
      label: "Base Notes",
      type: "multiselect",
      required: false,
      placeholder: "Add base notes"
    }
  ],
  accessories: [
    {
      id: "material",
      name: "material",
      label: "Material",
      type: "select",
      required: true,
      options: ["Leather", "Canvas", "Silk", "Cotton", "Synthetic", "Metal", "Plastic"],
      placeholder: "Select material"
    },
    {
      id: "color",
      name: "color",
      label: "Color",
      type: "text",
      required: true,
      placeholder: "e.g., Black, Brown, Red"
    },
    {
      id: "dimensions",
      name: "dimensions",
      label: "Dimensions",
      type: "text",
      required: false,
      placeholder: "e.g., 30cm x 20cm x 10cm"
    },
    {
      id: "weight",
      name: "weight",
      label: "Weight",
      type: "text",
      required: false,
      placeholder: "e.g., 500g"
    }
  ],
  skincare: [
    {
      id: "size",
      name: "size",
      label: "Size",
      type: "select",
      required: true,
      options: ["15ml", "30ml", "50ml", "100ml", "150ml", "200ml"],
      placeholder: "Select size"
    },
    {
      id: "skinType",
      name: "skinType",
      label: "Skin Type",
      type: "multiselect",
      required: false,
      options: ["Normal", "Dry", "Oily", "Combination", "Sensitive", "Mature"],
      placeholder: "Select skin types"
    },
    {
      id: "ingredients",
      name: "ingredients",
      label: "Key Ingredients",
      type: "multiselect",
      required: false,
      placeholder: "Add key ingredients"
    },
    {
      id: "spf",
      name: "spf",
      label: "SPF",
      type: "number",
      required: false,
      placeholder: "e.g., 30"
    }
  ]
}

export function getProductTypeById(id: string): ProductType | undefined {
  return productTypes.find(type => type.id === id)
}

export function getCategoriesByProductType(productTypeId: string): Category[] {
  const productType = getProductTypeById(productTypeId)
  return productType?.categories || []
}

export function getCategoryById(categoryId: string): Category | undefined {
  for (const productType of productTypes) {
    const category = productType.categories.find(cat => cat.id === categoryId)
    if (category) return category
  }
  return undefined
}

export function getFieldsByProductType(productTypeId: string): ProductTypeField[] {
  return productTypeFields[productTypeId] || []
}