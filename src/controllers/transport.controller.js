import Transport from '../models/transport.model.js';
import { successHandle } from '../helpers/success-handle.js';
import { errorHandle } from '../helpers/error-handle.js';
import { createTransportValidator, updateTransportValidator } from '../validation/transport.validation.js';
import { isValidObjectId } from 'mongoose';

export class TransportController {
    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const existTransport = await Transport.findOne({ licensePlate: value.licensePlate });
            if (existTransport) {
                return errorHandle(res, 'Transport with this license plate already exists', 409);
            }

            const transport = await Transport.create(value);
            return successHandle(res, transport, 201);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getAllTransports(_, res) {
        try {
            const transports = await Transport.find();
            return successHandle(res, transports);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getTransportByID(req, res) {
        try {
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            if (!transport) {
                return errorHandle(res, 'Error on finding transport');
            }
            
            return successHandle(res, transport);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async updateTransportByID(req, res) {
        try {
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            if (!transport) {
                return errorHandle(res, 'Error on finding transport');
            }

            const { value, error } = updateTransportValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }

            const updatedTransport = await Transport.findByIdAndUpdate(id, value, { new: true });
            return successHandle(res, updatedTransport);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async deleteTransportById(req, res) {
        try {
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            if (!transport) {
                return errorHandle(res, 'Error on finding transport');
            }

            await Transport.findByIdAndDelete(id);
            return successHandle(res, {
                message: 'Transport deleted successfully',
                deletedTransport: transport,
            });
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    static async findTransportById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return errorHandle(res, 'Invalid transportId', 400);
            }

            const transport = await Transport.findById(id);
            if (!transport) {
                return errorHandle(res, 'Transport not found', 404);
            }

            return transport;
        } catch (error) {
            return errorHandle(res, error);
        }
    }
}
