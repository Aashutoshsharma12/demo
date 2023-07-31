import Joi from 'joi';
import { join } from 'path';
import { errors } from '@constants';
//Add Order
const addOrderSchema = Joi.object({
    // vendorId: Joi.string().min(24).required()
    //     .messages({
    //         'string.min': errors.en.invalidMongoId.replace('{{key}}', 'VendorId')
    //     }),
    // storeId: Joi.string().min(24).required().messages({
    //     'string.min': errors.en.invalidMongoId.replace('{{key}}', 'storeId')
    // }),
    items: Joi.array().optional(),
    status: Joi.string().optional(),
    statusList: Joi.array().optional(),
    description: Joi.string().optional(),
    order_dateTime: Joi.string().optional(),
    order_time: Joi.string().optional(),
    order_date: Joi.string().optional(),
    couponCode: Joi.string().optional(),
    couponCodeAmount: Joi.number().optional(),
    subTotal: Joi.number().required(),
    taxes_Charges: Joi.number().optional(),
    taxes_Charges_amount:Joi.number().optional(),
    totalAmount: Joi.number().optional().allow('',null),
    paid:Joi.string().optional().allow(null,''),
    totalItems:Joi.number().optional(),
    address:Joi.object().optional().allow('',null),

})
//Edit Order
const editOrderSchema = Joi.object({
    order_id: Joi.string().min(24).required()
        .messages({
            'string.min': errors.en.invalidMongoId.replace('{{key}}', 'order_id')
        }),
    items: Joi.array().optional(),
    status: Joi.string().optional(),
    statusList: Joi.array().optional(),
    description: Joi.string().optional(),
    order_dateTime: Joi.string().optional(),
    order_time: Joi.string().optional(),
    order_date: Joi.string().optional(),
    couponCode: Joi.string().optional().allow(null,""),
    couponCodeAmount: Joi.number().optional().allow(null,""),
    subTotal: Joi.number().required(),
    taxes_Charges: Joi.number().optional(),
    taxes_Charges_amount:Joi.number().optional(),
    totalAmount: Joi.number().optional().allow('',null),
    totalItems:Joi.number().optional(),
    address:Joi.object().optional().allow('',null),
    paid:Joi.string().optional().allow('',null)
})

// Order update status schema
const updateStatusSchema = Joi.object({
    // // order_id:Joi.string().min(24).required()
    // .messages({
    //     'string.min': errors.en.invalidMongoId.replace('{{key}}', 'VendorId')
    // }),
    status: Joi.string().required(),
    dateAndTime: Joi.string().required(),
    time: Joi.string().required()
})
export {
    addOrderSchema,
    editOrderSchema,
    updateStatusSchema
}