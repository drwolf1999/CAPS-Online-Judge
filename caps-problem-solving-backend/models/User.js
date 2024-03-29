const mongoose = require('mongoose');

/**
 * In order
 * user name (ID)
 * password
 * permission (0=>normal, 1=>admin, 2=>superuser)
 * real Name (name)
 * grade
 * */
let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    permission: {
        type: Number,
        required: true,
        default: 0,
    },
    profile_url: {
        type: String,
        default: '',
    },
    profile_type: {
        type: String,
    },
    statusMessage: {
        type: String,
        default: '.',
    },
    realName: {
        type: String,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
});

let User = mongoose.model('User', UserSchema);

module.exports = User;