import Admin from '../models/admin.model.js';
import { Crypto } from '../utils/encrypt-decrypt.js';
import { successHandle } from '../helpers/success-handle.js'; 
import { errorHandle } from '../helpers/error-handle.js';
import { createAdminValidator, updateAdminValidator } from '../validation/admin.validation.js';
import { isValidObjectId } from 'mongoose';
import { Token } from '../utils/token-service.js';

const token = new Token();
const crypto = new Crypto();

export class AdminController {
    async createAdmin(req, res) {
        try {
            const { value, error } = createAdminValidator(req.body);
            if (error) {
            return errorHandle(res, error, 422);
            }

            const existUsername = await Admin.findOne({ username: value.username });
            if (existUsername) {
            return errorHandle(res, 'Username already exists', 409);
            }

            const hashedPassword = await crypto.encrypt(value.password);
            const admin = await Admin.create({
                username: value.username,
                hashedPassword,
                isActive: value.isActive
            });

            return successHandle(res, admin, 201);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

     async signInAdmin(req, res) {
        try {
            const { value, error } = createAdminValidator(req.body);
            if (error) {
                return errorHandle(res, error, 422);
            }
            
            const admin = await Admin.findOne({ username: value.username });
            if (!admin) {
                return errorHandle(res, 'Admin not found', 404);
            }

            const payload = { id: admin._id, role: admin.role };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return successHandle(res, {
                data: admin,
                token: accessToken
            }, 200);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return errorHandle(res, 'Refresh token epxired', 400);
            }

            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return errorHandle(res, 'Invalid token', 400);
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return errorHandle(res, 'Admin not found', 404);
            }

            const payload = { id: admin._id, role: admin.role };
            const accessToken = await token.generateAccessToken(payload);
            return successHandle(res, {
                token: accessToken
            });
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async logOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return errorHandle(res, 'Refresh token epxired', 400);
            }

            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return errorHandle(res, 'Invalid token', 400);
            }

            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return errorHandle(res, 'Admin not found', 404);
            }
            res.clearCookie('refreshTokenAdmin');
            return successHandle(res, {});
        } catch (error) {
            return errorHandle(res, error);
        }
    }


    async getAllAdmins(_, res) {
        try {
            const admins = await Admin.find();
            return successHandle(res, admins);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async getAdminByID(req, res) {
        try {
            const id = req.params.id;
            const admin = await AdminController.findAdminById(res, id);

            return successHandle(res, admin);
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    async updateAdminByID(req, res) {
        try {
            const id = req.params.id;
            const admin = await AdminController.findAdminById(res, id);
            const { value, error } = updateAdminValidator(req.body);

            if (error) {
                return errorHandle(res, error, 422)
            }

            let hashedPassword = admin.hashedPassword;
            if (value.password) {
                hashedPassword = await crypto.encrypt(value.password);
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(id, {
                ...value,
                hashedPassword
            }, { new: true });

            return successHandle(res, updatedAdmin);
        }catch (error) {
            return errorHandle(res, error);
        }   
    }

    async deleteAdminById(req, res) {
        try {
            const id = req.params.id;
            await AdminController.findAdminById(res, id);
            await Admin.findByIdAndDelete(id);
            return successHandle(res, { message: 'Admin deleted successfully' });
        } catch (error) {
            return errorHandle(res, error);
        }
    }

    static async findAdminById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return errorHandle(res, 'Invalid userId', 400);
            }

            const admin = await Admin.findById(id);
            if (!admin) {
                return errorHandle(res, 'Admin not found', 404);
            }

            return admin;
        } catch (error) {
            return errorHandle(res, error);
        }
    }
}