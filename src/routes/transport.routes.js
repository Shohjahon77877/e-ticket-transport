import { Router } from "express";
import { TransportController } from "../controllers/transport.controller.js";

const router = Router();
const controller = new TransportController();

router
    .post('/', controller.createTransport)
    .get('/', controller.getAllTransports)
    .get('/:id', controller.getTransportByID)
    .patch('/:id', controller.updateTransportByID)
    .delete('/:id', controller.deleteTransportById)
export default router;