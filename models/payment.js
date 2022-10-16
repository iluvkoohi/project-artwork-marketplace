const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

module.exports = Payment = mongoose.model("monthly-payments", PaymentSchema);
