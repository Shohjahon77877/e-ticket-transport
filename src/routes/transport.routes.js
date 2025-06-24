import { Router } from "express";
import { TransportController } from "../controllers/transport.controller.js";
import { AuthGuard} from '../guards/auth.guard.js';
import { RolesGuard} from '../guards/role.guard.js';
import { CustomerGuard } from '../guards/customer.guard.js';

const router = Router();
const controller = new TransportController();

router
    .post('/', AuthGuard, CustomerGuard, controller.createTransport)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllTransports)
    .get('/:id', AuthGuard, RolesGuard(['superadmin']), controller.getTransportByID)
    .patch('/:id', AuthGuard, CustomerGuard, controller.updateTransportByID)
    .delete('/:id', AuthGuard, CustomerGuard, controller.deleteTransportById)
export default router;