import Ticket from '../models/ticket.model.js';
import Transport from '../models/transport.model.js';
import { successHandle } from '../helpers/success-handle.js';
import { errorHandle } from '../helpers/error-handle.js';
import { createTicketValidator, updateTicketValidator } from '../validation/ticket.validation.js';
import { isValidObjectId } from 'mongoose';

export class TicketController {
    async createTicket(req, res) {
        try {
            const { value, error } = createTicketValidator(req.body);
            if (error) return errorHandle(res, error, 422);

            const transport = await Transport.findById(value.transportID);
            if (!transport) return errorHandle(res, 'Transport not found', 404);

            const ticket = await Ticket.create(value);
            return successHandle(res, ticket, 201);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getAllTickets(_, res) {
        try {
            const tickets = await Ticket.find().populate('transportID');
            return successHandle(res, tickets);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getTicketByID(req, res) {
        try {
            const id = req.params.id;
            const ticket = await TicketController.findTicketById(res, id);
            if (!ticket) return;

            return successHandle(res, ticket);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async updateTicketByID(req, res) {
        try {
            const id = req.params.id;
            const ticket = await TicketController.findTicketById(res, id);
            if (!ticket) return;

            const { value, error } = updateTicketValidator(req.body);
            if (error) return errorHandle(res, error, 422);

            if (value.transportID) {
                const transport = await Transport.findById(value.transportID);
                if (!transport) return errorHandle(res, 'Transport not found', 404);
            }

            const updatedTicket = await Ticket.findByIdAndUpdate(id, value, { new: true }).populate('transportID');
            return successHandle(res, updatedTicket);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async deleteTicketByID(req, res) {
        try {
            const id = req.params.id;
            const ticket = await TicketController.findTicketById(res, id);
            if (!ticket) return;

            await Ticket.findByIdAndDelete(id);
            return successHandle(res, {
                message: 'Ticket deleted successfully',
                deletedTicket: ticket
            });
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    static async findTicketById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return errorHandle(res, 'Invalid ticket ID', 400);
            }

            const ticket = await Ticket.findById(id).populate('transportID');
            if (!ticket) {
                return errorHandle(res, 'Ticket not found', 404);
            }

            return ticket;
        } catch (error) {
            return errorHandle(res, error);
        }
    }
}
