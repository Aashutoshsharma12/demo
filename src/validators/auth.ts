import Joi from 'joi';

const signUpSchema = Joi.object({
    countryCode: Joi.string().required(),
    otp: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('Vendor', 'Customer'),
})

const accountVerificationSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('Vendor', 'Customer'),
})


const logInSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('Customer'),
    otp: Joi.string().required(),
    fcmToken: Joi.string().allow(null, ''),
})
const profileSchema = Joi.object({
    name: Joi.string().required(),
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required(),
    image:Joi.string().optional().allow(null,'')
})




export {
    signUpSchema,
    accountVerificationSchema,
    logInSchema,
    profileSchema

}