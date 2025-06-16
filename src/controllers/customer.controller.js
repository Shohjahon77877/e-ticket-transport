import Customer from '../models/customer.model.js';
import { errorHandle } from '../helpers/error-handle.js';
import { successHandle } from '../helpers/success-handle.js';
import { createCustomerValidator, updateCustomerValidator } from '../validation/customer.validation.js';
import { Token } from '../utils/token-service.js';

const token = new Token();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = createCustomerValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const existPhoneNumber = await Customer.findOne({ phone_number: value.phone_number });
            if (existPhoneNumber) {
                return errorHandle(res, 'Phone number already registered ', 409);
            }

            const customer = await Customer.create(value);
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            return successHandle(res, {
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            return errorHandle(res, error);
        }
    }
}