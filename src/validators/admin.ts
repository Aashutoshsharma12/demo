import Joi, { string } from 'joi';
import { join } from 'path';
import { errors } from '@constants';

/**
 * category schema
 */
const categorySchema = Joi.object({
    title: Joi.string().required(),
    ar_title: Joi.string().required(),
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    storeTypeId1: Joi.string().optional().allow(null, "")
})
const edit_categorySchema = Joi.object({
    title: Joi.string().required(),
    ar_title: Joi.string().required(),
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    sub_CategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    storeTypeId1: Joi.string().optional().allow(null, "")

})
const storeTypeSchema = Joi.object({
    storeType: Joi.string().required(),
    ar_storeType: Joi.string().required(),
    storeType01: Joi.string().optional().allow(null, ''),
    image: Joi.string().optional()

})
const editStoreTypeSchema = Joi.object({
    storeType: Joi.string().required(),
    ar_storeType: Joi.string().required(),
    storeType11: Joi.string().optional().allow('', null),
    storeType1: Joi.string().optional().allow(null, ""),
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    image: Joi.string().optional()
})
const getstoreTypeSchema = Joi.object({
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
})
/**
 * faq schema
 */
const faqSchema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    ar_question: Joi.string().required(),
    ar_answer: Joi.string().required(),
    role: Joi.string().required().valid("Vendor", "Customer", "Both")   // Vendor Customer
})
/**
 * Admin auth schema
 */
const admin_authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    role: Joi.string().required().valid("Admin"),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required().messages({
        'string.empty': `Phone Number cannot be an empty field`,
        'string.min': `Phone Number should have a minimum length of {#limit}`,
        'string.max': `Phone Number should have a maximum length of {#limit}`,
        'any.required': `Phone Number is a required field`
    }),
    countryCode: Joi.string().required()
})
/**
 * Admin Login schema
 */
const admin_loginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required()
})
/**
 * change_passwordschema
 */
const admin_passowrdSchema = Joi.object({
    newPassword: Joi.string().required(),
    password: Joi.string().required()
})
/**
 * sub_Admin schema
 */
const sub_AdminSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    phoneNumber: Joi.string().min(3)
        .max(100).required().messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    countryCode: Joi.string().required(),
    isActive: Joi.boolean().required(),
    permission: Joi.array().required()

})

/**
 * Edit sub_AdminSchema
 */
const edit_sub_AdminSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    // password:Joi.string().required(),
    // confirmPassword:Joi.string().required(),
    phoneNumber: Joi.string().min(3)
        .max(100).required().messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    countryCode: Joi.string().required(),
    isActive: Joi.boolean().required(),
    subAdminId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'subAdminId')
        }),
    permission: Joi.array().required()

})

//edit vendor
const Edit_VendorSchema = Joi.object({
    vendorId: Joi.string().required().min(24).messages({
        'string.min': errors.en.invalidMongoId.replace('{{key}}', 'vendorId')

    }),
    // storeTypeId: Joi.string().min(24).required()
    // .messages({
    //     'string.min': errors.en.invalidMongoId.replace('{{key}}', 'subAdminId')
    // }),
    storeTypeId1: Joi.string().optional().allow(null, ""),

    image: Joi.string().optional().allow(null, ""),
    businessName: Joi.string().required(),
    ar_businessName: Joi.string().required(),
    fullAddress: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    ownerName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    countryCode: Joi.string().required(),
    openTime: Joi.string().required(),
    closeTime: Joi.string().required(),
    openTime1: Joi.string().optional().allow('', null),
    closeTime1: Joi.string().optional().allow('', null),
    addressLine1: Joi.string().required().allow(null, ''),
    lat: Joi.string().required(),
    lng: Joi.string().required(),
    googlePlaceId: Joi.string().optional().allow(null, ''),
    countryCodes: Joi.string().optional().allow(null, ""),
    password: Joi.string().optional().allow('', null)
})
//add vendor
const Add_VendorSchema = Joi.object({
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'subAdminId')
        }),
    storeTypeId1: Joi.string().optional().allow(null, ""),
    image: Joi.string().optional().allow(null, ""),
    businessName: Joi.string().required(),
    ar_businessName: Joi.string().required(),
    addressLine1: Joi.string().required().allow(null, ''),
    fullAddress: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    ownerName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    countryCode: Joi.string().required(),
    openTime1: Joi.string().optional().allow('', null),
    closeTime1: Joi.string().optional().allow('', null),
    openTime: Joi.string().required(),
    closeTime: Joi.string().required(),
    lat: Joi.string().optional(),
    lng: Joi.string().optional(),
    googlePlaceId: Joi.string().optional().allow(null, ''),
    countryCodes: Joi.string().optional().allow(null, ""),
    password: Joi.string().required()



})
//addOffers
//offers
const addOfferSchema = Joi.object({
    storeId: Joi.array().optional(),
    storeIds: Joi.string().optional().allow(null, ''),
    storeTypeId1: Joi.string().optional().allow(null, ''),
    storeTypeId: Joi.string().optional(),
    image: Joi.string().optional(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    couponCode: Joi.string().required(),
    ar_title: Joi.string().required(),
    ar_description: Joi.string().required(),
    offer_amount: Joi.string().required(),
    offer_type: Joi.string().required(),
    startDate: Joi.date().required(),
    expiryDate: Joi.date().required(),
    upto_Amount: Joi.number().optional().allow(null, '')
});
const notificationSchema = Joi.object({
    title: Joi.string().required(),
    sendTo: Joi.string().optional().allow('', null),
    title11: Joi.string().optional().allow('', null),
    title1: Joi.string().optional().allow('', null),
    description1: Joi.string().optional().allow('', null),
    description11: Joi.string().optional().allow('', null),
    role: Joi.string().optional(),
    ar_title: Joi.string().optional(),
    image: Joi.string().optional().allow('', null),
    countryCode:Joi.string().required(),
    phoneNumber: Joi.string().optional().allow(null, ''),
    description: Joi.string().required(),
    ar_description: Joi.string().required(),
    sendBy: Joi.string().required(),

})

//cuisine
const addCuisine = Joi.object({
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'subAdminId')
        }),
    title: Joi.string().required(),
    title01: Joi.string().optional().allow('', null),
    ar_title: Joi.string().required(),
    storeTypeId01: Joi.string().optional().allow('', null),
    storeTypeId12: Joi.string().optional().allow('', null)

});
const editCuisine = Joi.object({
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeType')
        }),
    title: Joi.string().required(),
    title10: Joi.string().optional().allow('', null),
    title12: Joi.string().optional().allow('', null),
    storeTypeId11: Joi.string().optional().allow('', null),
    storeTypeId22: Joi.string().optional().allow('', null),
    ar_title: Joi.string().required(),
    cuisineId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'cusineCategory')
        }),
})
const settingScheme = Joi.object({
    //create
    andriodUserAppUrl: Joi.string(),
    andriodUserVersion: Joi.string(),
    andriodUserUpdate: Joi.string(),
    iosUserAppUrl: Joi.string(),
    iosUserVersion: Joi.string(),
    iosUserUpdate: Joi.string(),
    andriodVendorAppUrl: Joi.string(),
    andriodVendorVersion: Joi.string(),
    andriodVendorUpdate: Joi.string(),
    iosVendorAppUrl: Joi.string(),
    iosVendorVersion: Joi.string(),
    iosVendorUpdate: Joi.string(),
    andriodDoorKeeperAppUrl: Joi.string(),
    andriodDoorKeeperVersion: Joi.string(),
    andriodDoorKeeperUpdate: Joi.string(),
    iosDoorKeeperAppUrl: Joi.string(),
    iosDoorKeeperVersion: Joi.string(),
    iosDoorKeeperUpdate: Joi.string()
})
export {
    categorySchema,
    edit_categorySchema,
    faqSchema,
    admin_authSchema,
    admin_loginSchema,
    admin_passowrdSchema,
    storeTypeSchema,
    editStoreTypeSchema,
    getstoreTypeSchema,
    sub_AdminSchema,
    edit_sub_AdminSchema,
    Edit_VendorSchema,
    Add_VendorSchema,
    addOfferSchema,
    notificationSchema,
    addCuisine,
    editCuisine,
    settingScheme

}