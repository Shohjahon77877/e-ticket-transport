import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
import { AuthGuard} from '../guards/auth.guard.js';
import { RolesGuard} from '../guards/role.guard.js';
import { CustomerGuard } from '../guards/customer.guard.js';

const router = Router();
const controller = new TicketController();

router
    .post('/', AuthGuard, CustomerGuard, controller.createTicket)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllTickets)
    .get('/:id', AuthGuard, RolesGuard(['superadmin']), controller.getTicketByID)
    .patch('/:id', AuthGuard, CustomerGuard, controller.updateTicketByID)
    .delete('/:id', AuthGuard, CustomerGuard, controller.deleteTicketByID)
export default router;