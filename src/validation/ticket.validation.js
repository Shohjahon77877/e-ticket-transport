import Joi from 'joi';

export const createTicketValidator = (data) => {
    const ticket = Joi.object({
        transportID: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        price: Joi.number().required().min(0),
        departure: Joi.date().required(),
        arrival: Joi.date().required()
    });

    return ticket.validate(data, { abortEarly: false });
};

export const updateTicketValidator = (data) => {
    const ticket = Joi.object({
        transportID: Joi.string().optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        price: Joi.number().optional().min(0),
        departure: Joi.date().optional(),
        arrival: Joi.date().optional()
    }).min(1);

    return ticket.validate(data, { abortEarly: false });
};
