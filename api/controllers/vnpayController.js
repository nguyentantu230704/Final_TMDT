const vnpayService = require('../services/vnpayService');
const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');


const createPaymentUrl = async ( req, res ) => {
    try {
        // const { amount, address } = req.body;
        const { address } = req.body;
        const ipAddr = (req.ip || req.headers['x-forwarded-for'] || '127.0.0.1').replace(/^::ffff:/, '');
        const returnUrl = `${req.protocol}://${req.get('host')}/api/vnpay/return`;
        const userID = req.user.id;
        const cart = await Cart.findOne({ userID }).populate('products.productID');

        if ( !cart || cart.products.length === 0 ) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        };

        const amount = cart.products.reduce((sum, item) => {
            return sum + item.productID.price * item.quantity;
        }, 0);

        const orderId = Date.now().toString();

        const newOrder = await Order.create({
            orderId,
            userID,
            amount,
            address,
            products: cart.products.map(item => ({
                productID: item.productID._id,
                quantity: item.quantity,
                price: item.productID.price,
            })),
            paymentStatus: "pending",
            paymentMethod: "vnpay",
        });
        const orderInfo = `Thanh toan don hang ${newOrder.orderId}`;
        const paymentUrl = vnpayService.buildPaymentUrl({
            amount: Number(amount),
            orderId: String(orderId),
            // cartItems: cart.products.map(item => ({
            //     price: item.productID.price,
            //     quantity: item.quantity
            // })),
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
            orderId: newOrder.orderId,
        });
    } catch (error) {
        console.error('VNPay Error', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const handleReturn = async (req, res) => {
    try {
        const result = vnpayService.verifyReturn(req.query);
        const orderId = req.query.vnp_txnRef;

        const order = await Order.findOne({ orderId });
        if ( !order ) {
            return res.status(404).json({
                success: false,
                message: 'Khong tìm thấy đơn hàng.'
            });
        }

        if (result.isSuccess && result.isVerified) {
            order.paymentStatus = 'paid';
            order.status = 'completed';
            order.vnp_TransactionNo = req.query.vnp_TransactionNo;
            await order.save();
            
            // clear gio hang
            await Cart.findOneAndUpdate({
                userID: order.userID
            }, { $set: { products: [] } });

            res.json({ success: true, message: 'Thanh toán thành công!' });
        } else {
            order.paymentStatus = 'failed';
            await order.save();

            res.status(400).json({ success: false, message: 'Sai chữ ký hoặc thất bại!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xử lý VNPay return.' });
    }
};

// const handleReturn = async (req, res) => {
//   try {
//     const result = vnpayService.verifyReturn(req.query);
//     const orderId = req.query.vnp_TxnRef;

    
//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
//     }

//     if (result.isSuccess && result.isVerified) {
//       order.paymentStatus = "paid";
//       order.vnp_TransactionNo = req.query.vnp_TransactionNo;
//       await order.save();

//       res.json({
//         success: true,
//         message: "Thanh toán thành công!",
//         order,
//       });
//     } else {
//       order.paymentStatus = "failed";
//       await order.save();

//       res.status(400).json({
//         success: false,
//         message: "Thanh toán thất bại hoặc sai chữ ký!",
//       });
//     }
//   } catch (error) {
//     console.error("Return error:", error);
//     res.status(500).json({ success: false, message: "Lỗi xử lý VNPay return." });
//   }
// };


module.exports = {
    createPaymentUrl,
    handleReturn
};