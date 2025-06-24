import { errorHandle } from "../helpers/error-handle.js"

export const CustomerGuard = (req, res, next) => {
    const customerID = req.body.customerID;
    if (req.user?.role === 'superadmin' || req.user?.id == customerID) {
        return next();
    } else {
        return errorHandle(res, 'Forbidden user', 403);
    }
}