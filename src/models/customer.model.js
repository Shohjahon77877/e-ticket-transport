import { Schema, model } from "mongoose";

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    phone_number: { type: Number, required: true }
}, {
    timestamps: true
})

const Customer = model('customer', CustomerSchema);
export default Customer;