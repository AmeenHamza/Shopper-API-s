// This file defines the structure of Database how many fields and what is the type

const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role : {
        type : String,
        required : true,
        default : "user"
    },
    profile: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/6915/6915987.png'
    },
    joining: {
        type: Date,
        default: Date.now
    }
})

const User = model('user', UserSchema);
module.exports = User