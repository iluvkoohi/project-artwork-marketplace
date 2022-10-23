const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false,
    _id: true
};

const CartSchema = new Schema({
    accountId: {
        type: String,
        required: [true, "accountId is required"],
    },
    art: {},
}, options);

module.exports = Cart = mongoose.model("carts", CartSchema);