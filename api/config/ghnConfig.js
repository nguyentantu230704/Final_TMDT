const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const ghnAPI = axios.create({
    baseURL: process.env.GHN_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Token: process.env.GHN_TOKEN,
        ShopId: process.env.GHN_SHOP_ID,
    }
});

module.exports = ghnAPI;