const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * In order
 * Badge Number
 * Badge Name
 *
 * */

let BadgeSchema = new mongoose.Schema({
    number: {
        type: Number,
        default: 1,
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

BadgeSchema.plugin(AutoIncrement, {
    inc_field: 'number',
    id: 'badge_number'
});

const Badge = mongoose.model('Badge', BadgeSchema);

module.exports = Badge;