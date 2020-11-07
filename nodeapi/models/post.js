const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is required",
        // minlength: 4,
        // maxlength: 150/**no son necesarias porque ya esta aplicado el validator */
    },
    body: {
        type: String,
        required: "Body is required",
        minlength: 4,
        maxlength: 2000
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: "User"/**reference to User model */
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
});

module.exports = mongoose.model("Post", postSchema);