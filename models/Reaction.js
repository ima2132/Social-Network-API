const mongoose = require('mongoose');
const { Schema } = mongoose;

const reactionSchema = new Schema({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => createdAtVal.toLocaleString()
    }
});

module.exports = reactionSchema;