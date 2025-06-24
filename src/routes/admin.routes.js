import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { AuthGuard} from '../guards/auth.guard.js';
import { RolesGuard} from '../guards/role.guard.js';
import { SelfGuard} from '../guards/self.guard.js';


const router = Router();
const controller = new AdminController();

router
    .post('/', AuthGuard, RolesGuard(['superadmin']), controller.createAdmin)
    .post('/signin', controller.signInAdmin)
    .post('/token', controller.newAccessToken)
    .post('/logout', AuthGuard,controller.logOut)
    .get('/', AuthGuard, RolesGuard(['superadmin']), controller.getAllAdmins)
    .get('/:id', AuthGuard, SelfGuard, controller.getAdminByID)
    .patch('/:id', AuthGuard, SelfGuard, controller.updateAdminByID)
    .delete('/:id', AuthGuard, RolesGuard(['superadmin']), controller.deleteAdminById)
export default router;