
// src/data/mockData.js

// ===== PRODUCTS =====

export const initialProducts = [
  {
    id: 101,
    name: "Fortune Basmati Rice",
    brand: "FORTUNE",
    price: 110,
    description: "Premium long grain basmati rice.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80",
    category: "Grocery & Staples",
  },
  {
    id: 102,
    name: "Aashirvaad Atta",
    brand: "AASHIRVAAD",
    price: 299,
    description: "Whole wheat flour for soft rotis.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80",
    category: "Grocery & Staples",
  },
  {
    id: 103,
    name: "Toor Dal",
    brand: "TATA SAMPANN",
    price: 145,
    description: "Protein rich premium toor dal.",
    image:
      "https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=500&q=80",
    category: "Grocery & Staples",
  },
  {
    id: 104,
    name: "MAGGI Noodles",
    brand: "MAGGI",
    price: 14,
    description: "2-minute instant noodles.",
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&q=80",
    category: "Beverages & Snacks",
  },
  {
    id: 105,
    name: "Lay’s Classic Chips",
    brand: "LAYS",
    price: 20,
    description: "Classic salted potato chips.",
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80",
    category: "Beverages & Snacks",
  },
  {
    id: 106,
    name: "Coca-Cola Soft Drink",
    brand: "COCA-COLA",
    price: 95,
    description: "Refreshing cold drink bottle.",
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80",
    category: "Beverages & Snacks",
  },
  {
    id: 107,
    name: "Fresh Tomatoes",
    brand: "FRESH FARM",
    price: 45,
    description: "Fresh farm tomatoes.",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80",
    category: "Fruits & Veggies",
  },
  {
    id: 108,
    name: "Fresh Bananas",
    brand: "FRESH FARM",
    price: 48,
    description: "Naturally sweet bananas.",
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e37f?w=500&q=80",
    category: "Fruits & Veggies",
  },
  {
    id: 109,
    name: "Amul Fresh Yogurt",
    brand: "AMUL",
    price: 80,
    description: "Creamy fresh yogurt.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80",
    category: "Dairy & Bakery",
  },
  {
    id: 110,
    name: "Surf Excel Liquid Detergent",
    brand: "SURF EXCEL",
    price: 199,
    description: "Powerful stain remover detergent.",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80",
    category: "Household & Care",
  },
  {
    id: 111,
    name: "Farm Fresh Eggs",
    brand: "FRESH FARM",
    price: 79,
    description: "12 fresh farm eggs.",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80",
    category: "Frozen & Meat",
  },
  {
    id: 112,
    name: "Halal Boneless Chicken",
    brand: "HALAL CHOICE",
    price: 340,
    description: "Fresh halal boneless chicken.",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80",
    category: "Frozen & Meat",
  },
];

// ===== ORDERS =====

export const initialOrders = [
  {
    id: "ORD-1001",
    customer: "John Doe",
    items: 5,
    total: "₹850",
    payment: "UPI",
    date: "2026-07-04",
    status: "Delivered",
  },
  {
    id: "ORD-1002",
    customer: "Jane Smith",
    items: 5,
    total: "₹578",
    payment: "COD",
    date: "2026-07-04",
    status: "Pending",
  },
  {
    id: "ORD-1003",
    customer: "Alice Johnson",
    items: 5,
    total: "₹1150",
    payment: "Card",
    date: "2026-07-03",
    status: "Shipped",
  },
  {
    id: "ORD-1004",
    customer: "Bob Williams",
    items: 5,
    total: "₹1145",
    payment: "UPI",
    date: "2026-07-03",
    status: "Processing",
  },
  {
    id: "ORD-1005",
    customer: "Michael Brown",
    items: 5,
    total: "₹1524",
    payment: "COD",
    date: "2026-07-02",
    status: "Delivered",
  },
];

// ===== SHOP PRODUCTS =====

export const ShopProducts = [
  {
    id: 201,
    name: "Eggs (12 pcs)",
    category: "Dairy & Bakery",
    price: 78,
    description: "Farm fresh eggs",
    vat: 18,
  },
  {
    id: 202,
    name: "MAGGI Noodles",
    category: "Beverages & Snacks",
    price: 14,
    description: "2-minute noodles",
    vat: 18,
  },
  {
    id: 203,
    name: "Surf Excel Liquid Detergent",
    category: "Household & Care",
    price: 265,
    description: "Top load detergent liquid",
    vat: 18,
  },
  {
    id: 204,
    name: "Fortune Sunflower Oil",
    category: "Grocery & Staples",
    price: 170,
    description: "Refined sunflower cooking oil",
    vat: 18,
  },
  {
    id: 205,
    name: "Twix Minis Chocolate",
    category: "Beverages & Snacks",
    price: 125,
    description: "Chocolate caramel snack",
    vat: 18,
  },
  {
    id: 206,
    name: "Nescafe Coffee",
    category: "Beverages & Snacks",
    price: 290,
    description: "Rich aromatic coffee",
    vat: 18,
  },
];

// ===== BILLS =====

export const initialBills = [
  {
    id: "BILL-001",
    billNumber: "A123\\456789",
    date: "2023-12-12",
    time: "23:24:15",
    shopName: "Zepto",
    shopAddress: "Mumbai, India",
    shopPhone: "Tel: +91 9876543210",
    shopVat: "GST NO 27ABCDE1234F1Z5",
    tableNumber: "543",
    cashier: "SUPERVISOR",
    customerName: "John Doe",
    customerPhone: "+91 9876512345",

    items: [
      {
        id: 201,
        name: "Eggs (12 pcs)",
        quantity: 1,
        price: 78,
        vat: 18,
      },
      {
        id: 202,
        name: "MAGGI Noodles",
        quantity: 3,
        price: 14,
        vat: 18,
      },
      {
        id: 203,
        name: "Surf Excel Liquid Detergent",
        quantity: 1,
        price: 265,
        vat: 18,
      },
      {
        id: 204,
        name: "Fortune Sunflower Oil",
        quantity: 2,
        price: 170,
        vat: 18,
      },
      {
        id: 205,
        name: "Twix Minis Chocolate",
        quantity: 1,
        price: 125,
        vat: 18,
      },
    ],

    subtotal: 850,
    vatPercentage: 18,
    vatAmount: 129.66,
    total: 850,
    cash: 1000,
    change: 150,
    notes: "Thank you for shopping!",
  },
];

// ===== USERS =====

export const initialUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
    joined: "2026-07-01",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Customer",
    status: "Active",
    joined: "2026-07-02",
  },
  {
    id: "USR-003",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Customer",
    status: "Pending",
    joined: "2026-07-03",
  },
  {
    id: "USR-004",
    name: "Bob Williams",
    email: "bob@example.com",
    role: "Customer",
    status: "Active",
    joined: "2026-07-04",
  },
  {
    id: "USR-005",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Customer",
    status: "Active",
    joined: "2026-07-05",
  },
];

// ===== USER PURCHASE HISTORY =====

export const userPurchaseHistory = {
  users: [
    {
      user_name: "John Doe",

      transactions: [
        {
          receipt_number: "A123\\456789",
          store_name: "Zepto",
          date: "12/12/2023",

          items_purchased: [
            {
              description: "Eggs (12 pcs)",
              quantity: 1,
              total_amount: 78,
            },
            {
              description: "MAGGI Noodles",
              quantity: 3,
              total_amount: 42,
            },
            {
              description: "Surf Excel Liquid Detergent",
              quantity: 1,
              total_amount: 265,
            },
          ],

          total_spent: 850,
        },

        {
          receipt_number: "A555\\222111",
          store_name: "Blinkit",
          date: "05/01/2024",

          items_purchased: [
            {
              description: "Fresh Tomatoes",
              quantity: 2,
              total_amount: 90,
            },
            {
              description: "Coca-Cola Soft Drink",
              quantity: 1,
              total_amount: 95,
            },
          ],

          total_spent: 185,
        },
      ],
    },

    {
      user_name: "Jane Smith",

      transactions: [
        {
          receipt_number: "B987\\654321",
          store_name: "Blinkit",
          date: "15/12/2023",

          items_purchased: [
            {
              description: "Fresh Bananas",
              quantity: 6,
              total_amount: 48,
            },
            {
              description: "Amul Butter 500g",
              quantity: 1,
              total_amount: 285,
            },
          ],

          total_spent: 578,
        },
      ],
    },

    {
      user_name: "Alice Johnson",

      transactions: [
        {
          receipt_number: "C741\\852963",
          store_name: "Instamart",
          date: "18/12/2023",

          items_purchased: [
            {
              description: "Fresh Tomatoes 1kg",
              quantity: 2,
              total_amount: 90,
            },
            {
              description: "Potatoes 5kg",
              quantity: 1,
              total_amount: 180,
            },
            {
              description: "Aashirvaad Whole Wheat Atta",
              quantity: 1,
              total_amount: 520,
            },
          ],

          total_spent: 1150,
        },
      ],
    },

    {
      user_name: "Bob Williams",

      transactions: [
        {
          receipt_number: "D159\\357456",
          store_name: "BigBasket",
          date: "20/12/2023",

          items_purchased: [
            {
              description: "Red Apples",
              quantity: 4,
              total_amount: 520,
            },
            {
              description: "Pepsi Can",
              quantity: 6,
              total_amount: 240,
            },
          ],

          total_spent: 1145,
        },
      ],
    },

    {
      user_name: "Michael Brown",

      transactions: [
        {
          receipt_number: "E951\\753852",
          store_name: "Zepto",
          date: "22/12/2023",

          items_purchased: [
            {
              description: "Fresh Carrots",
              quantity: 3,
              total_amount: 150,
            },
            {
              description: "Sprite Bottle",
              quantity: 2,
              total_amount: 190,
            },
            {
              description: "Basmati Rice 5kg",
              quantity: 1,
              total_amount: 699,
            },
          ],

          total_spent: 1524,
        },
      ],
    },
  ],
};

