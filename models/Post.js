const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Comment = require('./Comment');


const postSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        minlength: 5
    },
    createdDate: {
        type: Date,
        required: false,
        default: new Date(),
    },
    likes: {
        type: Number,
        required: false,
        default: 0,
    },
    comments: {
        type: [Comment.commentSchema],
        required: false
    }
});

module.exports = model('Posts', postSchema);