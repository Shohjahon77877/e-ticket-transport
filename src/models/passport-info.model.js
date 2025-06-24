import { Schema, Types, model } from "mongoose";

const PassportScheme = new Schema({
    serial: { type: String, unique: true, required: true },
    jshshr: { type: Number, unique: true, required: true },
    fullName: { type: String, required: true },
    customerID: { type: Types.ObjectId, ref: 'Customer' }
}, {
    timestamps: true
})

const Passport = model('Passport', PassportScheme);
export default Passport;