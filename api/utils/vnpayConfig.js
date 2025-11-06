const dotenv = require('dotenv');
dotenv.config();
const { VNPay, ignoreLogger } = require('vnpay');


const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE,
    secureSecret: process.env.VNP_SECRET_KEY,
    vnpayHost: process.env.VNPAY_HOST,
    testMode: true,
    enableLog: true,
    loggerFn: ignoreLogger,
    hashAlgorithm: 'SHA512', // Thuật toán mã hóa
});

module.exports = vnpay;