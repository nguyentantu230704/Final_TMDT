const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

const products = [
  {
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    price: 199.99,
    inStock: true,
    categories: ["Electronics", "Audio"],
    size: ["One Size"],
    color: ["Black", "Silver", "Blue"]
  },
  {
    title: "Stainless Steel Water Bottle",
    description: "Eco-friendly insulated water bottle keeps drinks hot for 12 hours or cold for 24 hours. Durable and stylish design.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    price: 34.99,
    inStock: true,
    categories: ["Home & Kitchen", "Sports"],
    size: ["500ml", "750ml", "1L"],
    color: ["Stainless Steel", "Black", "Rose Gold"]
  },
  {
    title: "Professional Yoga Mat",
    description: "Non-slip yoga mat with extra cushioning for maximum comfort. Perfect for yoga, pilates, and fitness exercises.",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    price: 45.99,
    inStock: true,
    categories: ["Sports", "Fitness"],
    size: ["One Size"],
    color: ["Purple", "Black", "Pink", "Green"]
  },
  {
    title: "Portable Phone Charger 20000mAh",
    description: "Fast-charging portable power bank with dual USB ports. Charges most phones 5+ times on a single charge.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
    price: 29.99,
    inStock: true,
    categories: ["Electronics", "Mobile Accessories"],
    size: ["One Size"],
    color: ["Black", "White", "Blue"]
  },
  {
    title: "Wireless Mechanical Keyboard",
    description: "RGB mechanical keyboard with wireless connectivity, customizable switches, and programmable keys.",
    image: "https://images.unsplash.com/photo-1587829191301-4b11a8d9e0a6?w=500&h=500&fit=crop",
    price: 129.99,
    inStock: true,
    categories: ["Electronics", "Computer Peripherals"],
    size: ["One Size"],
    color: ["Black", "White", "RGB"]
  },
  {
    title: "4K Webcam with Microphone",
    description: "Ultra HD 4K webcam with built-in noise-cancelling microphone. Perfect for streaming and video calls.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop",
    price: 89.99,
    inStock: true,
    categories: ["Electronics", "Computer Peripherals"],
    size: ["One Size"],
    color: ["Black"]
  },
  {
    title: "Premium Coffee Maker",
    description: "Programmable coffee maker with built-in grinder, thermal carafe, and smart brew technology.",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop",
    price: 149.99,
    inStock: true,
    categories: ["Home & Kitchen", "Kitchen Appliances"],
    size: ["12 Cup"],
    color: ["Black", "Stainless Steel"]
  },
  {
    title: "Smart Watch Fitness Tracker",
    description: "Feature-packed smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    price: 199.99,
    inStock: true,
    categories: ["Electronics", "Wearables"],
    size: ["One Size"],
    color: ["Black", "Silver", "Gold", "Rose Gold"]
  },
  {
    title: "Ergonomic Gaming Mouse",
    description: "High-precision gaming mouse with adjustable DPI settings, ergonomic design, and customizable buttons.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
    price: 59.99,
    inStock: true,
    categories: ["Electronics", "Gaming"],
    size: ["One Size"],
    color: ["Black", "RGB"]
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360-degree sound, 12-hour battery, and rugged design.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    price: 79.99,
    inStock: true,
    categories: ["Electronics", "Audio"],
    size: ["One Size"],
    color: ["Black", "Blue", "Red"]
  }
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Add slugs to products
const productsWithSlugs = products.map(product => ({
  ...product,
  slug: generateSlug(product.title)
}));

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/tmdt-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`Added ${createdProducts.length} products successfully!`);

    createdProducts.forEach(product => {
      console.log(`   ${product.title} (Slug: ${product.slug})`);
    });

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
}

seedProducts();
