const mongoose = require('mongoose');

/**
 * In order
 * user name
 * password
 * permission (0=>normal, 1=>admin, 2=>superuser)
 * */
let AuthSchema = new mongoose.Schema({
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
});

let Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;