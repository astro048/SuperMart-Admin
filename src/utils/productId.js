export const categoryCodes = {
  'Oil & Ghee': 100,
  Vegetables: 200,
  Fruits: 300,
  Snacks: 400,
  Drinks: 500,
  Dairy: 600,
  Bakery: 700,
  'Frozen Food': 800,
  'Personal Care': 900,
  Cleaning: 1000,
  Grains: 1100
}

export const generateProductId = (category, existingProducts = []) => {
  const baseCode = categoryCodes[category] || 100

  // Filter products of same category
  const sameCategoryProducts = existingProducts.filter(
    p => p.category === category
  )

  // Find next sequence
  const nextNumber = sameCategoryProducts.length + 1

  return baseCode + nextNumber
}