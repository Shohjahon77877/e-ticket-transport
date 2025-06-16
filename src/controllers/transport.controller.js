import Transport from '../models/transport.model.js';
import Ticket from '../models/ticket.model.js';
import { successHandle } from '../helpers/success-handle.js';
import { errorHandle } from '../helpers/error-handle.js';
import { createTransportValidator, updateTransportValidator } from '../validation/transport.validation.js';
import { isValidObjectId } from 'mongoose';

export class TransportController {
    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) return errorHandle(res, error, 422);

            const existTransport = await Transport.findOne({
                transport_type: value.transport_type,
                class: value.class
            });

            if (existTransport) {
                return errorHandle(res, 'Transport with this type and class already exists', 409);
            }

            const transport = await Transport.create({
                transport_type: value.transport_type,
                class: value.class,
                seat: value.seat
            });

            return successHandle(res, transport, 201);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getAllTransports(_, res) {
        try {
            const transports = await Transport.find();

            const transportsWithTickets = await Promise.all(
                transports.map(async (transport) => {
                    const tickets = await Ticket.find({ transportID: transport._id });
                    return { ...transport.toObject(), tickets };
                })
            );

            return successHandle(res, transportsWithTickets);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getTransportByID(req, res) {
        try {
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            if (!transport) return;

            const tickets = await Ticket.find({ transportID: transport._id });
            return successHandle(res, { ...transport.toObject(), tickets });
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async updateTransportByID(req, res) {
        try {
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            if (!transport) return;

            const { value, error } = updateTransportValidator(req.body);
            if (error) return errorHandle(res, error, 422);

            const updateData = {
                transport_type: value.transport_type,
                class: value.class,
                seat: value.seat
            };

            const updatedTransport = await Transport.findByIdAndUpdate(id, updateData, { new: true });

            const tickets = await Ticket.find({ transport: updatedTransport._id });
            return successHandle(res, { ...updatedTransport.toObject(), tickets });
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async deleteTransportById(req, res) {
        try {
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            if (!transport) return;

            const tickets = await Ticket.find({ transport: id });

            await Transport.findByIdAndDelete(id);

            return successHandle(res, {
                message: 'Transport deleted successfully',
                deletedTransport: transport,
                associatedTickets: tickets
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
