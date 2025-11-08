const express = require('express');
const router = express.Router();
const { createPaymentUrl, handleReturn } = require('../controllers/vnpayController');
const { verifyToken } = require('../middlewares/verifyAuth');

router.post("/create_payment_url", verifyToken, createPaymentUrl);
router.get("/return", handleReturn);

module.exports = router;