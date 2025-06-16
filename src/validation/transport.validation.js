import Joi from 'joi';

const classOptions = ['economy', 'business', 'first'];

export const createTransportValidator = (data) => {
    const transport = Joi.object({
        transport_type: Joi.string().required(),
        class: Joi.string().valid(...classOptions).required(),
        seat: Joi.number().required().min(1)
    });

    return transport.validate(data, { abortEarly: false });
};

export const updateTransportValidator = (data) => {
    const transport = Joi.object({
        transport_type: Joi.string().optional(),
        class: Joi.string().valid(...classOptions).optional(),
        seat: Joi.number().optional().min(1)
    }).min(1);

    return transport.validate(data, { abortEarly: false });
};
