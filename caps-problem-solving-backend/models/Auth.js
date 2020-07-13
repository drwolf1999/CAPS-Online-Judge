const mongoose = require('mongoose');

/**
 * In order
 * problem number
 * name (title)
 * description
 *
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
});

let Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;