import Joi from "joi";

export const createPassportValidator = (data) => {
    const passport = Joi.object({
        serial: Joi.string().required(),
        jshshr: Joi.number().required(),
        fullName: Joi.string().required(),
        customerID: Joi.string().required()
    })

    return passport.validate(data);
}

export const upadatePassportValidator = (data) => {
    const passport = Joi.object({
        serial: Joi.string().optional(),
        jshshr: Joi.number().optional(),
        fullName: Joi.string().optional(),
        customerID: Joi.string().optional()
    })

    return passport.validate(data);
}