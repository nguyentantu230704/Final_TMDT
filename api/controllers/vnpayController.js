const vnpayService = require('../services/vnpayService');
const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');


const createPaymentUrl = async ( req, res ) => {
    try {
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
        const orderId = req.query.vnp_TxnRef;

        // const order = await Order.findOne({ orderId });
        const order = await Order.findById({ orderId });

        if ( !order ) {
            // return res.redirect(`http://localhost:3000/orders?payment=notfound&orderId=${orderId}`)
            return res.redirect(`${process.env.FE_URL}/orders?payment=notfound&orderId=${orderId}`)
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

            // res.json({ success: true, message: 'Thanh toán thành công!' });
            // res.redirect(`http://localhost:3000/orders?payment=success&orderId=${orderId}`);
            res.redirect(`${process.env.FE_URL}/orders?payment=success&orderId=${orderId}`);
        } else {
            order.paymentStatus = 'failed';
            await order.save();

            // res.status(400).json({ success: false, message: 'Sai chữ ký hoặc thất bại!' });
            return res.redirect(`${process.env.FE_URL}/orders?payment=failed&orderId=${orderId}`);
        }
    } catch (error) {
        // res.status(500).json({ success: false, message: 'Lỗi xử lý VNPay return.' });
        return res.redirect(`${process.env.FE_URL}/orders?payment=error`);
    }
};


module.exports = {
    createPaymentUrl,
    handleReturn
};