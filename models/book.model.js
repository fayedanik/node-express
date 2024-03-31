const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true
    },
    userDisplayName: {
        type: String,
        required: true
    }
});

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: reviewSchema,
            default: []
        }
    ],
    photo: {
        type: String,
        required: false
    }
});

module.exports = new mongoose.model("Book",bookSchema);