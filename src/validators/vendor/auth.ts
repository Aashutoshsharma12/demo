import Joi from 'joi';

//vendor auth
const signUpSchema = Joi.object({
    ownerName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    countryCode: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('Vendor'),
    acceptTerms_Condition:Joi.boolean().required(),
    businessName: Joi.string().required(),
    ar_businessName:Joi.string().optional().allow('',null)
});

const logInSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('Vendor'),
    password: Joi.string().required()
});

const accountVerificationSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('Vendor')
});

const otpVerificationSchema = Joi.object({
    otp: Joi.string()
        .min(6)
        .max(6)
        .required()
        .messages({
            'string.empty': `OTP cannot be an empty field`,
            'string.min': `OTP should have a minimum length of {#limit}`,
            'string.max': `OTP should have a maximum length of {#limit}`,
            'any.required': `OTP is a required field`
        })
});

const resetPasswordSchema = Joi.object({
    countryCode:Joi.string().required(),
    phoneNumber: Joi.string().required(),
    newPassword:Joi.string().required(),
    confirmPassword:Joi.string().required()
});

const changePasswordSchema = Joi.object({
    oldPassword:Joi.string().required(),
    newPassword:Joi.string().required(),
    confirmPassword:Joi.string().required()
});

const profileSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required()
});

export {
    signUpSchema,
    logInSchema,
    accountVerificationSchema,
    otpVerificationSchema,
    resetPasswordSchema,
    changePasswordSchema,
    profileSchema
}