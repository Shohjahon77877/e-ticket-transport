import Passport from '../models/passport-info.model.js';
import Customer from '../models/customer.model.js';
import { createPassportValidator, upadatePassportValidator } from '../validation/passport.validation.js';
import { errorHandle } from '../helpers/error-handle.js';
import { successHandle } from '../helpers/success-handle.js';
import { isValidObjectId } from 'mongoose';

export class PassportController {
    async createPassportInfo(req, res) {
        try {
            const { value, error } = createPassportValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const existPassport = await Passport.findOne({ jshshr: value.jshshr });
            if (existPassport) {
                return errorHandle(res, 'Passport Information already exists', 400);
            }

            const customerID = Customer.findById(value.customerID);
            if (!customerID) {
                return errorHandle(res, 'Error on finding customer', 404)
            }

            const passport = await Passport.create({
                serial: value.serial,
                jshshr: value.jshshr,
                fullName: value.fullName,
                customerID: value.customerID
            });
            
            return successHandle(res, passport, 201);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getAllPassport(_, res) {
        try {
            const passports = await Passport.find().populate('customerID');
            if (!passports) {
                return errorHandle(res, 'Passport not found', 404);
            }
            return successHandle(res, passports);
        } catch (error) {
            return errorHandle(res, error)
        }
    }

    async getPassportByID(req, res) {
        try {
            const id = req.params.id;
            const passport = await PassportController.findPassportById(res, id);
            return successHandle(res, passport);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async updatePassportInfo(req, res){
        try {
            const id = req.params.id;
            const passport = await PassportController.findPassportById(res, id);
            if (!passport) {
                return errorHandle(res, 'Error on finding passport', 404);
            }

            const { value, error } = upadatePassportValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422)
            }

            if (value.customerID) {
                const customer = await Customer.findById(value.customerID);
                if (!customer) {
                    return errorHandle(res, 'Customer not found', 404);
                }
            }

            const updatedPassport = await Passport.findByIdAndUpdate(id, value, { new: true }).populate('customerID');
            return successHandle(res, updatedPassport);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async deletePassport(req, res) {
        try {
            const id = req.params.id;
            const passport = await PassportController.findPassportById(res, id);
            if (!passport) {
                return errorHandle(res, 'Error on finding passport', 404);
            }

            await Passport.findByIdAndDelete(id);
            return successHandle(res, {
                message: 'Passport successfully deleted',
                deletedPassport: passport
            })
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    static async findPassportById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return errorHandle(res, 'Invalid customer ID', 400);
            }
    
            const passport = await Passport.findById(id).populate('customerID');
            if (!passport) {
                return errorHandle(res, 'Passport not found', 404);
            }

            return passport;
        } catch (error) {
            return errorHandle(res, error);
        }
    }
}