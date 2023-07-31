import Joi from 'joi';
import { errors } from '@constants';
//vendor auth
const addStoreSchema = Joi.object({
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    fullAddress: Joi.string().required(),
    streetAddress: Joi.string().required(),
    countryCode: Joi.string().required(),
    state: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    googlePlaceId: Joi.string().optional().allow(null, ''),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    notes: Joi.string().optional().allow(null, ''),
    main_branchName: Joi.string().optional(),
    country: Joi.string().optional()
});

//add branch schema
const addBranchSchema = Joi.object({
    phoneNumber: Joi.string().required(),
    phoneNoCountryCode: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    fullAddress: Joi.string().required(),
    countryCode: Joi.string().required(),
    state: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    googlePlaceId: Joi.string().optional().allow(null, ''),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    branchName: Joi.string().required(),
    ar_branchName: Joi.string().required(),
    country: Joi.string().optional(),
    isActive: Joi.boolean().required()
});

//add Report
const addReportSchema = Joi.object({
    // storeId: Joi.string().min(24).required()
    //     .messages({
    //         'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeId')
    //     }),
    storeId:Joi.string().optional(),
    description: Joi.string().required(),
    ar_description: Joi.string().required(),
    role: Joi.string().required().valid('Vendor', 'Customer')
});

/**
 * category schema
 */
const categorySchema = Joi.object({
    title: Joi.string().required(),
    ar_title: Joi.string().required(),
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        })
})
const edit_categorySchema = Joi.object({
    title: Joi.string().required(),
    ar_title: Joi.string().required(),
    sub_CategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'sub_CategoryId')
        })
})

export {
    addStoreSchema,
    addBranchSchema,
    addReportSchema,
    categorySchema,
    edit_categorySchema
}