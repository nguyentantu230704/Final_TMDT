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

// Get any product - any user
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Route share
router.get("/product/:id/share", async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy thông tin sản phẩm từ API
    const product = await Product.findById(req.params.id);

    // Trả HTML có meta OG
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta property="og:title" content="${product.title}" />
        <meta property="og:description" content="${product.description}" />
        <meta property="og:image" content="${product.image}" />
        <meta property="og:url" content="https://tmdt-app.vercel.app/products/${id}" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>${product.title}</title>
        <meta http-equiv="refresh" content="0; url=/products/${id}" />
      </head>
      <body>
        Redirecting to product...
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Product not found");
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
  unexpectedError: {
    status: "error",
    message: "an unexpected error occurred",
  },
};

module.exports = router;
