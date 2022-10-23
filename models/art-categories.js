const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const ArtCategorySchema = new Schema({
    category: {
        type: String,
        required: [true, 'category is required']
    },
}, options);

module.exports = ArtCategory = mongoose.model("art-categories", ArtCategorySchema);
