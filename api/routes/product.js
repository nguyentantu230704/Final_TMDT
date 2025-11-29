const router = require("express").Router();
const { celebrate } = require("celebrate");

const Product = require("../models/Product.model");
const { product: productSchema } = require("../models/schema");
const {
  verifyToken,
  verifyAuthorization,
  verifyAdminAccess,
} = require("../middlewares/verifyAuth");

// Get all products - any user
router.get("/", celebrate({ query: productSchema.query }), async (req, res) => {
  const query = req.query;
  try {
    let products;
    if (query.new) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (query.category) {
      products = await Product.find({
        categories: { $in: [query.category] },
      });
    } else {
      products = await Product.find();
    }
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// ============= MUST BE BEFORE /:id routes =============

// Get product by slug - any user
router.get("/slug/:slug", async (req, res) => {
  try {
    console.log("Fetching product with slug:", req.params.slug);
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      console.log("Product not found with slug:", req.params.slug);
      return res.status(404).json(productResponse.productNotFound);
    }
    console.log("Found product:", product.title);
    return res.json(product);
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Get any product by ID - any user
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching product with ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json(productResponse.productNotFound);
    }
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Route OG SEO
router.get("/:id/og", async (req, res) => {
  console.log("Hit OG route:", req.headers["user-agent"]);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    // Build image URL đầy đủ
    const imageUrl = product.image;

    // HTML trả về cho Facebook
    const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>${product.title}</title>

            <!-- OG tags -->
            <meta property="og:title" content="${product.title}" />
            <meta property="og:description" content="${
              product.description || product.title
            }" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            <meta property="og:type" content="product" />
            <meta property="og:url" content="https://final-tmdt.onrender.com/api/products/${
              product._id
            }" />

            <!-- Twitter -->
            <meta name="twitter:card" content="summary_large_image" />

            <!-- Required for FB -->
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
              <p>Redirecting...</p>

              <noscript>
                <meta http-equiv="refresh" content="0; url=https://tmdt-app.vercel.app/products/PRODUCT_SLUG_HERE" />
              </noscript>

              <script>
                window.location.href = "https://tmdt-app.vercel.app/products/PRODUCT_SLUG_HERE";
              </script>
          </body>
        </html>
      `;

    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// ============= POST/PUT/DELETE/OG ROUTES =============

// Add a new product - admin only
router.post(
  "/",
  verifyAdminAccess,
  celebrate({ body: productSchema.new }),
  async (req, res) => {
    try {
      await Product.create(req.body);
      return res.json(productResponse.productAdded);
    } catch (err) {
      console.log(err);
      return res.status(500).json(productResponse.unexpectedErrorS);
    }
  }
);

// Update a product - admin only
router.put(
  "/:id",
  verifyAdminAccess,
  celebrate({ body: productSchema.update }),
  async (req, res) => {
    try {
      await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.json(productResponse.productUpdated);
    } catch (err) {
      console.error(err);
      return res.status(500).json(productResponse.unexpectedError);
    }
  }
);

// Delete a product - admin only
router.delete("/:id", verifyAdminAccess, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json(productResponse.productDeleted);
  } catch (err) {
    console.log(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

const productResponse = {
  productAdded: {
    status: "ok",
    message: "product has been added",
  },
  productUpdated: {
    status: "ok",
    message: "product has been updated",
  },
  productDeleted: {
    status: "ok",
    message: "product has been deleted",
  },
  productNotFound: {
    status: "error",
    message: "product not found",
  },
  unexpectedError: {
    status: "error",
    message: "an unexpected error occurred",
  },
};

module.exports = router;
