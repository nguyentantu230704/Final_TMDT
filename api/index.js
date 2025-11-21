const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const checkoutRouter = require("./routes/checkout");
const paymentRouter = require("./routes/payment");
const vnpayRouter = require("./routes/vnpayRoutes");
const userRoutes = require("./routes/user"); //để export email user
const {
  handleMalformedJson,
  formatCelebrateErrors,
} = require("./middlewares/handleError");

const app = express();

// mongodb
mongoose.set('strictQuery', false);
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

// server status
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// format celebrate paramater validation errors
app.use(formatCelebrateErrors);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}`);
});
