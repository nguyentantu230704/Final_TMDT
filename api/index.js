const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const checkoutRouter = require("./routes/checkout");
const paymentRouter = require("./routes/payment");
const vnpayRouter = require("./routes/vnpayRoutes");
const imageRouter = require("./routes/image");
const userRoutes = require("./routes/user"); //để export email user

const {
  handleMalformedJson,
  formatCelebrateErrors,
} = require("./middlewares/handleError");

const app = express();

//prerender.io
app.use(
  require("prerender-node").set("prerenderToken", "OKon3AnN5Zqx2CiR3uUv")
);

// mongodb
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

// global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(handleMalformedJson); // handle common req errors

// routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
// app.use("/api/checkout", checkoutRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/vnpay", vnpayRouter);
// app.use("/api/shipping", ghnRouter);
app.use("/api/image", imageRouter);

// server status
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// ===== Serve React build =====
app.use(express.static(path.join(__dirname, "../client/dist")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// format celebrate paramater validation errors
app.use(formatCelebrateErrors);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}`);
});
