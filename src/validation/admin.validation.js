import Joi from 'joi';

export const createAdminValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",<.>/?\\|`~]).{8,20}$/).required(),
        isActive: Joi.boolean().required()
    })

    return admin.validate(data);
}

export const updateAdminValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",<.>/?\\|`~]).{8,20}$/).optional(),
        isActive: Joi.boolean().required()
    })

    return admin.validate(data);
}