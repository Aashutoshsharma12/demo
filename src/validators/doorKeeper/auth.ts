import Joi from 'joi';
//vendor auth
const addDoorKeeperSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    // email: Joi.string().required().email({ minDomainSegments: 2 }),
    countryCode: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    role: Joi.string().required().valid('DoorKeeper'),
})
const logInSchema = Joi.object({
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string()
        .min(10)
        .max(10)
        .required()
        .messages({
            'string.empty': `Phone Number cannot be an empty field`,
            'string.min': `Phone Number should have a minimum length of {#limit}`,
            'string.max': `Phone Number should have a maximum length of {#limit}`,
            'any.required': `Phone Number is a required field`
        }),
    role: Joi.string().required().valid('DoorKeeper'),
    password: Joi.string().required(),
    // fcmToken: Joi.string().allow(null, ''),
})
const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    // fcmToken: Joi.string().allow(null, ''),
})
const profileSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string()
    .min(10)
    .max(10)
    .required()
    .messages({
        'string.empty': `Phone Number cannot be an empty field`,
        'string.min': `Phone Number should have a minimum length of {#limit}`,
        'string.max': `Phone Number should have a maximum length of {#limit}`,
        'any.required': `Phone Number is a required field`
    })
    // fcmToken: Joi.string().allow(null, ''),
})

export  {
    addDoorKeeperSchema,
    logInSchema,
    changePasswordSchema,
    profileSchema
}