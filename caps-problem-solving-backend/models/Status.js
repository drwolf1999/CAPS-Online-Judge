const mongoose = require('mongoose');

/**
 * In order
 * Submit Number
 * Submit User
 * About Problem
 * result (WA, OK, CE, RE, MLE, TLE, JUDGING, WAIT)
 * Used Memory (KB)
 * Used Time (MS)
 * Used Language
 * Code Length (BYTE)
 * Submit Time
 * */
let StatusSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        ref: 'User',
        required: true,
    },
    problemNumber: {
        type: Number,
        ref: 'Problem',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    judge_result: {
        type: Number,
        required: true,
        default: 7,
    },
    memory: {
        type: Number,
        required: true,
        default: 0,
    },
    time: {
        type: Number,
        required: true,
        default: 0,
    },
    language: {
        type: Number,
        required: true,
    },
    code_length: {
        type: Number,
        required: true,
        default: 0,
    },
    submit_time: {
        type: mongoose.Schema.Types.Date,
        default: new Date(Date.now()),
    },
}, {toJSON: {getters: true}});

StatusSchema.virtual('problem', {
    ref: 'Problem',
    localField: 'problemNumber',
    foreignField: 'number',
    justOne: true // for many-to-1 relationships
});

StatusSchema.virtual('user', {
    ref: 'User',
    localField: 'username',
    foreignField: 'username',
    justOne: true // for many-to-1 relationships
});

StatusSchema.pre('save', async function (next) {
    await this
        .populate({
            path: 'problem'
        })
        .populate({
            path: 'user'
        })
        .execPopulate();
    next();
});

StatusSchema.statics.getStatus = function (statusNumber) {
    return this.findOne({number: statusNumber})
        .populate('user')
        .populate('problem')
        .exec();
};

StatusSchema.statics.getAllStatus = function (top) {
    return this.find({}, null)
        .sort('-number')
        .where('number').lte(top)
        .limit(21)
        .populate('user')
        .populate('problem')
        .exec();
};

StatusSchema.statics.getMaxNumber = async function () {
    let infos = await this.find({}, null)
        .sort('-number')
        .limit(1);
    if (infos.length === 1) {
        return infos[0].number;
    }
    return 1000000;
}

StatusSchema.plugin(require('mongoose-auto-increment').plugin, {
    model: 'Status',
    field: 'number',
    startAt: 1000,
    increment: 1,
});

let Status = mongoose.model('Status', StatusSchema);

module.exports = Status;