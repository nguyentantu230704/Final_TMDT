const express = require("express");
const router = express.Router();
const { createOrder, capturePayment } = require("../services/paypalService");
const { verifyToken } = require("../middlewares/verifyAuth");
const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");

// Create PayPal order

router.post("/create-paypal-order", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userID: req.user.id }).populate(
      "products.productID"
    );
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.products.map((item) => ({
      name: item.productID.title,
      price: item.productID.price.toString(),
      quantity: item.quantity,
    }));

    const totalAmount = cart.products
      .reduce((total, item) => total + item.productID.price * item.quantity, 0)
      .toFixed(2);

    // Định dạng dữ liệu trả về cho frontend
    const finalOrder = {
      products: cart.products.map((item) => ({
        productID: item.productID,
        quantity: item.quantity,
      })),
      amount: totalAmount,
    };

    // Gọi PayPal tạo order
    const order = await createOrder(items, totalAmount);

    //debug
    // console.log("DebugOrder:", order);

    res.json({ finalOrder, paypalOrder: order });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ message: "Error creating PayPal order" });
  }
});

// Capture PayPal payment
router.post("/capture-paypal-payment", verifyToken, async (req, res) => {
  try {
    const { orderID } = req.body;
    const captureData = await capturePayment(orderID);

    // Create order in database
    const cart = await Cart.findOne({ userID: req.user.id }).populate(
      "products.productID"
    );
    const newOrder = new Order({
      userID: req.user.id,
      products: cart.products.map((item) => ({
        productID: item.productID._id,
        quantity: item.quantity,
        price: item.productID.price,
      })),
      amount: captureData.purchase_units[0].payments.captures[0].amount.value,
      address: "", // Có thể lấy từ user nếu có UI nhập địa chỉ
      payment: {
        method: "PayPal",
        id: captureData.id,
        status: captureData.status,
      },
    });

    await newOrder.save();

    // Clear cart
    await Cart.findOneAndUpdate(
      { userID: req.user.id },
      { $set: { products: [] } }
    );

    res.json({
      orderId: newOrder._id, // ID của order trong DB
      paypalCapture: captureData,
      status: captureData.status,
      message: "Payment captured successfully",
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    // Gửi thêm thông tin lỗi chi tiết về client để debug
    res.status(500).json({
      message: "Error capturing payment",
      error: error?.message,
      stack: error?.stack,
    });
  }
});

module.exports = router;
