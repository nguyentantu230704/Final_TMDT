const ghnAxios = require("../config/ghnConfig");

class GHNServie {
    // get province
    async getProvinces() {
        const res = await ghnAxios.get('/master-data/province');
        return res.data;
    }

    async getWards(districtId) {
        const res = await ghnAxios.get('/master-data/ward', {
            params: {
                district_id: districtId
            },
        });
        return res.data;
    }

    async getDistricts(provinceId) {
        const res = await ghnAxios.get('/master-data/district', {
            params: {
                province_id: provinceId
            },
        });
        return res.data;
    }

    async calculateFee(data) {
        const res = await ghnAxios.post('/v2/shipping-order/fee', data);
        return res.data;
    }

    async getAvailableServices(data) {
        const res = await ghnAxios.post('/v2/shipping-order/available-services', data);
        return res.data;
    }

    async createOrder(orderData) {
        const res = await ghnAxios.post('/v2/shipping-order/create', orderData);
        return res.data;
    }

    async cancelOrder(orderCode) {
        const res = await ghnAxios.post('/v2/switch-status/cancel', {
            order_codes: [orderCode],
        });
        return res.data;
    }

    async printOrder(orderCodes, format = 'A5') {
        const res = await ghnAxios.post('/v2/a5/gen', {order_codes: orderCodes});
        return res.data;
    }

    async getOrderInfo(orderCode) {
        const res = await ghnAxios.get(`/v2/shipping-order/detail/${orderCode}`);
        return res.data;
    }
};

module.exports = new GHNServie();