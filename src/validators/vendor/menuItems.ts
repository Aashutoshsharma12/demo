import Joi from 'joi';
import { join } from 'path';
import { errors } from '../../constants/index';
//menu Items schema
const menuItemsSchema = Joi.object({
    storeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    foodCategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'foodCategoryId')
        }),
    itemCategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'itemCategoryId')
        }),
    cuisineCategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'cuisineCategoryId')
        }),
    itemName: Joi.string().required(),
    ar_itemName: Joi.string().required(),
    amount: Joi.string().required(),
    recommended:Joi.string().required(),
    preparationTime: Joi.string().required(),
    description: Joi.string().optional(),
    ar_description: Joi.string().optional()

});

// edit menuItem schema
const updateMenuItemsSchema = Joi.object({
    storeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'itemId')
        }),
    storeTypeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeTypeId')
        }),
    foodCategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'foodCategoryId')
        }),
    itemCategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'itemCategoryId')
        }),
    cuisineCategoryId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'cuisineCategoryId')
        }),
    itemName: Joi.string().required(),
    ar_itemName: Joi.string().required(),
    amount: Joi.string().required(),
    recommended:Joi.string().required(),
    preparationTime: Joi.string().required(),
    description: Joi.string().optional(),
    ar_description: Joi.string().optional()

});

// menuItem-size
const menuItem_sizeSchema = Joi.object({
    itemId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'itemId')
        }),
    item_size: Joi.string().required(),
    ar_item_size: Joi.string().required(),
    amount: Joi.string().required()
});

//addons
const addonsSchema = Joi.object({
    itemId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'itemId')
        }),
    addons_typeId: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'addons_typeId')
        }),
    title: Joi.string().required(),
    ar_title: Joi.string().required(),
    amount: Joi.string().required()
});

//offers
const addOfferSchema = Joi.object({
    storeId: Joi.string().min(24).required()
    .messages({
        'string.min': errors.en.invalidMongoId.replace('{{key}}', 'aId')
    }),
    image:Joi.string().optional().allow(null,""),
    minimum_amount:Joi.number().required(),
    title: Joi.string().required(),
    ar_title: Joi.string().required(),
    description: Joi.string().required(),
    ar_description: Joi.string().required(),
    couponCode:Joi.string().required(),
    offer_amount:Joi.number().required(),
    startDate:Joi.date().required(),
    expiryDate: Joi.date().required(),
    upto_Amount:Joi.number().required(),
    offer_type:Joi.string().required(),
    isActive:Joi.boolean().required()
});
//edit offers
const editOfferSchema = Joi.object({
    image:Joi.string().optional().allow(null,""),
    title: Joi.string().required(),
    minimum_amount:Joi.number().required(),
    description: Joi.string().required(),
    ar_description: Joi.string().required(),
    ar_title: Joi.string().required(),
    offer_amount:Joi.number().required(),
    startDate:Joi.date().required(),
    expiryDate: Joi.date().required(),
    upto_Amount:Joi.number().required(),
    offer_type:Joi.string().required(),
    couponCode:Joi.string().required(),
    isActive:Joi.boolean().required()
});
//gallery
const gallerySchema = Joi.object({
    storeId: Joi.string().min(24).required()
    .messages({
        'string.min': errors.en.invalidMongoId.replace('{{key}}', 'gallerySchema')
    })
});

//Timing Schema
// const timingSchema = Joi.object({
//     Monday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required(),
//     Tuesday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required(),
//     Wednesday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required(),
//     Thursday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required(),
//     Friday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required(),
//     Saturday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required(),
//     Sunday: Joi.object({openingTime:Joi.string().required(),closingTime:Joi.string().required()}).required()
// })

export {
    menuItemsSchema,
    updateMenuItemsSchema,
    menuItem_sizeSchema,
    addonsSchema,
    addOfferSchema,
    editOfferSchema,
    gallerySchema
    // timingSchema
}