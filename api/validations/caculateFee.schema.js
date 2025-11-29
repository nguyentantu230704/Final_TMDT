const Joi = require('joi');

module.export = Joi.object({
    from_district_id: Joi.number().optional(),
    from_ward_code: Joi.string().optional(),

    to_district_id: Joi.number().required(),
    to_ward_code: Joi.string().required(),

    weight: Joi.number().optional(),
    length: Joi.number().optional(),
    width: Joi.number().optional(),
    height: Joi.number().optional(),

    insurance_value: Joi.number().optional(),
});