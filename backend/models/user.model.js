const mongoose = require('mongoose')
const pfp = require('../blank-pfp.png')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be at least 6 characters"],
        maxLength: [23, "Password must not exceed 23 characters"],
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: pfp
    },
    phone: {
        type: String,
        default: "+1"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio cannot exceed 250 characters"],
        default: "bio"
    },
}, 
{
    timestamps: true,
}) 

const User = mongoose.model("User", userSchema)
module.exports = User