import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";

const router = Router();
const controller = new TicketController();

router
    .post('/', controller.createTicket)
    .get('/', controller.getAllTickets)
    .get('/:id', controller.getTicketByID)
    .patch('/:id', controller.updateTicketByID)
    .delete('/:id', controller.deleteTicketByID)
export default router;