import Joi from "joi";

export const createCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().required(),
        phone_number: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required()
    })
    
    return customer.validate(data, { abortEarly: false })
}

export const updateCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().optional(),
        phone_number: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).optional()
    })

    return customer.validate(data, { abortEarly: false })
}