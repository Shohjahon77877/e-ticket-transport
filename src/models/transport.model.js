import { Schema, model } from "mongoose";

const TransportSchema = new Schema({
    transport_type: { type: String, required: true },
    class: { type: String, enum: ['economy', 'business', 'first'], required: true },
    seat: { type: String, required: true }
}, {
    timestamps: true,
})

const Transport = model('Transport', TransportSchema);
export default Transport;