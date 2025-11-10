const vnpay = require("../utils/vnpayConfig");

const buildPaymentUrl = ({ amount, orderId, orderInfo, ipAddr, returnUrl }) => {
  if (!amount || !orderId || !orderInfo || !ipAddr || !returnUrl) {
    throw new Error("Thieu tham so bat buoc");
  }

  // Convert amount to number for validation
  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum < 1 || amountNum > 1000000) {
    throw new Error("So tien phai tu 10k -> 1M khi test sandbox");
  }

  // Convert to number first to ensure correct multiplication
  const amountNumber = Number(amount);
  if (isNaN(amountNumber)) {
    throw new Error("Amount must be a valid number");
  }

  const params = {
    vnp_Amount: String(Math.round(amountNumber * 26000)),
    vnp_OrderInfo: String(orderInfo),
    vnp_ReturnUrl: returnUrl,
    vnp_TxnRef: String(orderId),
    vnp_IpAddr: ipAddr,
    vnp_Locale: "vn",
    vnp_OrderType: "billpayment",
  };

  try {
    console.log("🔹 VNPay Input Params:", params);
    const url = vnpay.buildPaymentUrl(params);
    console.log("🔹 Payment URL:", url);
    return url;
  } catch (error) {
    console.error("VNPay Error:", error);
    throw error;
  }
};

const verifyReturn = (query) => {
  try {
    return vnpay.verifyReturnUrl(query);
  } catch (error) {
    console.error("VNPay Verify Error:", error);
    throw error;
  }
};

module.exports = {
  buildPaymentUrl,
  verifyReturn,
};
