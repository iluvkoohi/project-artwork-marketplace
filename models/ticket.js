const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const VerificationSchema = new Schema({
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "accountId is required"],
    },
    url: {
        type: String,
        required: [true, "url url is required"],
    },
    profile: {
        type: {},
        required: [true, "Profile is required"],
    },
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    status: {
        type: String,
        enum: ["pending", "completed", "rejected"],
        default: "pending",
    },
}, options);

module.exports = Verification = mongoose.model("verifications", VerificationSchema);