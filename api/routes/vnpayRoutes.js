const express = require('express');
const router = express.Router();
const { createPaymentUrl, handleReturn } = require('../controllers/vnpayController');


router.post("/create_payment_url", createPaymentUrl);
router.get("/vnpay_return", handleReturn);

module.exports = router;