const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const PaymentSchema = new Schema({
    profile: {},
    amount: {
        type: Number,
        required: [true, 'amount is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    date: {
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
}, options);

module.exports = Payment = mongoose.model("monthly-payments", PaymentSchema);
