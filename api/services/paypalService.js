const axios = require('axios');
require('dotenv').config();

const base = 'https://api-m.sandbox.paypal.com';

const getAccessToken = async () => {
    const response = await axios({
        url: `${base}/v1/oauth2/token`,
        method: "post",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_CLIENT_SECRET,
        },
        data: "grant_type=client_credentials",
    });
    return response.data.access_token;
};

const createOrder = async (items, totalAmount) => {
    const accessToken = await getAccessToken();
    
    const response = await axios({
        url: `${base}/v2/checkout/orders`,
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalAmount,
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: totalAmount
                            }
                        }
                    },
                    items: items.map(item => ({
                        name: item.name,
                        unit_amount: {
                            currency_code: "USD",
                            value: item.price
                        },
                        quantity: item.quantity
                    }))
                }
            ]
        }
    });

    return response.data;
};

const capturePayment = async (orderId) => {
    const accessToken = await getAccessToken();

    const response = await axios({
        url: `${base}/v2/checkout/orders/${orderId}/capture`,
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    });

    return response.data;
};

module.exports = {
    createOrder,
    capturePayment
};