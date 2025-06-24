import Joi from 'joi';

const priceOptions = [15, 25, 30];

export const createTicketValidator = (data) => {
    const ticket = Joi.object({
        transportID: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        price: Joi.number().valid(...priceOptions).required().min(15),
        departure: Joi.date().required(),
        arrival: Joi.date().required(),
        customerID: Joi.string().required(),
    });

    return ticket.validate(data, { abortEarly: false });
};

export const updateTicketValidator = (data) => {
    const ticket = Joi.object({
        transportID: Joi.string().optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        price: Joi.number().valid(...priceOptions).optional().min(15),
        departure: Joi.date().optional(),
        arrival: Joi.date().optional(),
        customerID: Joi.string().optional(),
    }).min(1);

    return ticket.validate(data, { abortEarly: false });
};
