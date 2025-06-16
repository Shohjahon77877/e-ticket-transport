import { Schema, model } from "mongoose";


const AdminScheme = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' }
}, { timestamps: true });

const Admin = model('Admin', AdminScheme);
export default Admin;
