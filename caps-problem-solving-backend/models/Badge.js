const mongoose = require('mongoose');

/**
 * In order
 * Badge Number
 * Badge Name
 *
 * */

let BadgeSchema = new mongoose.Schema({
    number: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        default: '',
    },
    global: {
        type: Boolean,
        default: true,
    }
}, {toJSON: {getters: true}});

BadgeSchema.statics.getBadge = function (badgeNumber) {
    return this.findOne({number: badgeNumber})
        .exec();
};

BadgeSchema.statics.getAllBadges = function () {
    return this.find({}, null)
        .select('name number global -id -_id -__v')
        .exec();
};

BadgeSchema.plugin(require('mongoose-auto-increment').plugin, {
    model: 'Badge',
    field: 'number',
    startAt: 1,
    increment: 1,
});

const Badge = mongoose.model('Badge', BadgeSchema);

module.exports = Badge;