import { Schema, Types, model } from "mongoose";

const TicketSchema = new Schema({
    transportID: {type: Types.ObjectId, ref: 'Transport'},
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    price: { type: Number, enum: [15, 25, 30],required: true },
    customerID: {type: Types.ObjectId, ref: 'Customer'}
}, {
    timestamps: true,
})

const Ticket = model('Ticket', TicketSchema);
export default Ticket;