const mongoose = require('mongoose');

/**
 * In order
 * username
 * Badge Number
 * active
 *
 * */

let UserBadgeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    badgeNumber: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
}, {toJSON: {getters: true}});

UserBadgeSchema.virtual('badge', {
    ref: 'Badge',
    localField: 'badgeNumber',
    foreignField: 'number',
    justOne: true, // for many-to-1 relationships
    option: {select: '-id -_id -__v'}
});

const UserBadge = mongoose.model('UserBadge', UserBadgeSchema);

module.exports = UserBadge;