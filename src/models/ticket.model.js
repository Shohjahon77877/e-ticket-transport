import { Schema, Types, model } from "mongoose";

const TicketSchema = new Schema({
    transportID: {type: Types.ObjectId, ref: 'Transport'},
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true,
})

const Ticket = model('ticket', TicketSchema);
export default Ticket;