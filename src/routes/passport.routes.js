import { Router } from "express";
import { PassportController } from '../controllers/passport.controller.js';
import { AuthGuard} from '../guards/auth.guard.js';
import { RolesGuard} from '../guards/role.guard.js';
import { CustomerGuard } from '../guards/customer.guard.js';

const router = Router();
const controller = new PassportController();

router
    .post('/', AuthGuard, CustomerGuard, controller.createPassportInfo)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllPassport)
    .get('/:id',AuthGuard, RolesGuard(['superadmin']), controller.getPassportByID)
    .patch('/:id', AuthGuard, CustomerGuard, controller.updatePassportInfo)
    .delete('/:id', AuthGuard, CustomerGuard, controller.deletePassport)
export default router;
