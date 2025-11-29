const { resolveUrlString } = require("vnpay");
const GHNService = require("../services/ghnService");

const getProvinces= async (req, res) => {
    try {
        const data = await GHNService.getProvinces();
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Loi server khi lay tinh thanh',
        });
    }
};

const getDistricts = async (req, res) => {
    const {province_id} = req.query;
    if (!province_id) {
        return res.status(400).json({
            success: false,
            message: 'Thieu province_id',
        });
    }

    try {
        const data = await GHNService.getDistricts(province_id);
        res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: true,
            message: 'Loi lay quan huyen',
        });
    }
};

const getWards = async (req, res) => {
    const { district_id } = req.query;
    if (!district_id) {
        return res.status(400).json({
            success: false,
            message: 'Thieu district_id',
        });
    }

    try {
        const data = await GHNService.getWards(district_id);
        res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Loi khi lay thong tin phuong, xa',
        });
    }
};

const calculateFee = async (req, res) => {
    try {
        const services = await GHNService.getAvailableServices(req.body);

        if (!services?.length) {
            return res.status(400).json({
                success: false,
                message: 'khong co service phu hop',
            });
        }

        const bestService = services[0];
        const fee = await GHNService.calculateFee({
            ...req.body,
            service_id: bestService.service_id,
        });

        res.json({
            succes: true,
            fee: fee.total,
            service_id: bestService.service_id,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Loi tinh phi giao hang',
        }); 
    }
};

module.exports = {
    getProvinces,
    getDistricts,
    getWards,
    calculateFee,
};