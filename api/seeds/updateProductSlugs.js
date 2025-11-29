const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

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

async function updateSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tmdt-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const productsWithoutSlug = await Product.find({ $or: [{ slug: null }, { slug: undefined }, { slug: "" }] });
    console.log(`📦 Found ${productsWithoutSlug.length} products without slug`);

    let updated = 0;
    for (const product of productsWithoutSlug) {
      const newSlug = generateSlug(product.title);
      await Product.findByIdAndUpdate(product._id, { slug: newSlug });
      updated++;
      console.log(`   ✓ Updated: ${product.title} => ${newSlug}`);
    }

    console.log(`\nUpdated ${updated} products with slugs`);

    // Also verify existing products have slug
    const allProducts = await Product.find({});
    const withoutSlug = allProducts.filter(p => !p.slug);
    
    if (withoutSlug.length > 0) {
      console.log(`Found ${withoutSlug.length} products still without slug, updating...`);
      for (const product of withoutSlug) {
        const newSlug = generateSlug(product.title);
        await Product.findByIdAndUpdate(product._id, { slug: newSlug });
        console.log(`   ✓ Fixed: ${product.title} => ${newSlug}`);
      }
    }

    // Show all products
    const finalProducts = await Product.find({}).select('title slug _id').sort({ createdAt: -1 });
    console.log('\nAll products:');
    finalProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title}`);
      console.log(`      Slug: ${p.slug}`);
      console.log(`      ID: ${p._id}`);
    });

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error updating slugs:', error.message);
    process.exit(1);
  }
}

updateSlugs();
