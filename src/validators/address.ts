import Joi from 'joi';
const addressSchema = Joi.object({
    //add + edit
    fullAddress:Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional().allow(null, ''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().optional().allow(null, ''),
    countryCode: Joi.string().required(),
    googlePlaceId: Joi.string().optional().allow(null, ''),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    id: Joi.string().optional().allow(null, '')
})
export {
    addressSchema
}