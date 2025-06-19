import Customer from '../models/customer.model.js';
import config from '../config/index.js';
import { errorHandle } from '../helpers/error-handle.js';
import { successHandle } from '../helpers/success-handle.js';
import {
    signUpCustomerValidator,
    signInCustomerValidator,
    confirmSignInCustomerValidator,
    updateCustomerValidator
} from '../validation/customer.validation.js';
import { Token } from '../utils/token-service.js';
import { generateOTP } from '../helpers/generate-otp.js';
import NodeCache from 'node-cache';
import { transporter } from '../helpers/send-to-mail.js';


const token = new Token();
const cache = new NodeCache();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = signUpCustomerValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const existPhoneNumber = await Customer.findOne({ phone_number: value.phone_number });
            if (existPhoneNumber) {
                return errorHandle(res, 'Phone number already registered ', 409);
            }

            const existEmail = await Customer.findOne({ email: value.email });
            if (existEmail) {
                return errorHandle(res, 'Email adress already registered ', 409);
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

    async signIn(req, res) {
        try {
            const { value, error } = signInCustomerValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const email = value.email;
            const customer = await Customer.findOne({ email });
            if (!customer) {
                return errorHandle(res, 'Customer not found', 409);
            }

            const otp = generateOTP();
            const mailOptions = {
                from: config.MAIL_USER,
                to: email,
                subject: 'e-ticket',
                text: otp
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return errorHandle(res, 'Error on sending to email', 400);
                } else {
                    console.log(info);
                }
            })
            
            cache.set(email, otp, 120);
            return successHandle(res, {
                message: 'OTP sent successfully to email'
            });
       } catch (error) {
           return errorHandle(res, error)
       } 
    }

    async confirmSignIn(req, res) {
        try {
            const { value, error } = confirmSignInCustomerValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const customer = await Customer.findOne({ email: value.email });
            if (!customer) {
                return errorHandle(res, 'Customer not found', 409);
            }

            const cacheOTP = cache.get(value.email);
            if (!cacheOTP || cacheOTP != value.otp) {
                return errorHandle(res, 'OTP expired', 400);
            }

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
            return errorHandle(res, error)
        }
    }

    async getAllCustomer(_, res) {
        try {
            const customers = await Customer.find();

            return successHandle(res, customers);
        } catch (error) {
            return errorHandle(res, error);
        }
    }
}