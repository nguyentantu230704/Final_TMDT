const vnpayService = require('../services/vnpayService');

const createPaymentUrl = async ( req, res ) => {
    try {
        const { amount, orderId, orderInfo } = req.body;
        const ipAddr = (req.ip || req.headers['x-forwarded-for'] || '127.0.0.1').replace(/^::ffff:/, '');
        const returnUrl = `${req.protocol}://${req.get('host')}/api/vnpay/return`;

        const paymentUrl = vnpayService.buildPaymentUrl({
            amount: Number(amount),
            orderId: String(orderId),
            orderInfo: String(orderInfo),
            ipAddr,
            returnUrl,
            extra: {
                vnp_Locale: 'vn',
                vnp_OrderType: 'billpayment',
            }
        });

        return res.json({ 
            success: true,
            paymentUrl,
        });
    } catch (error) {
        console.error('VNPay Error', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const handleReturn = (req, res) => {
    try {
        const result = vnpayService.verifyReturn(req.query);
        if (result.isSuccess && result.isVerified) {
            res.json({ success: true, message: 'Thanh toán thành công!' });
        } else {
            res.status(400).json({ success: false, message: 'Sai chữ ký hoặc thất bại!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xử lý VNPay return.' });
    }
};

// const handleReturn = (req, res) => {
//     const result = vnpayService.verifyReturn(req.query);

//     if (result.isSuccess && result.isVerified) {
//         res.json({ 
//             success: true,
//             message: 'Thanh toan thanh cong', 
//             data: {
//                 orderId: result.orderId,
//                 amount: result.amount/100,
//                 transactionNo: result.transactionNo,
//             }
//         });
//     } else {
//         res.status(400).json({ 
//             success: false,
//             message: 'Thanh toan that bai' || verify.message, 
//         });
//     }
// };

module.exports = {
    createPaymentUrl,
    handleReturn
};