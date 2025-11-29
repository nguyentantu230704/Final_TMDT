const express = require("express");
const sharp = require("sharp");
const router = express.Router();

// Node 18+ có fetch builtin, KHÔNG cần node-fetch
router.get("/resize", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing image URL");

    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    const resized = await sharp(buffer)
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(resized);
  } catch (err) {
    console.error("Resize error:", err);
    res.status(500).send("Resize failed");
  }
});

module.exports = router;
