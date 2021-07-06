const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Auth',
        required: true,
    },
    problem: {
        type: mongoose.Schema.Types.ObjectID,
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

StatusSchema.statics.getStatus = function (problemNumber) {
    return this.findOne({number: problemNumber})
        .populate('user')
        .populate('program')
        .exec();
};

StatusSchema.statics.getAllStatus = function (page) {
    return this.find({}, null)
        .sort({'number': -1})
        .populate('user')
        .populate('problem')
        // .skip((page - 1) * 10)
        // .limit(10)
        .exec();
};

StatusSchema.plugin(AutoIncrement, {
    inc_field: 'number',
    id: 'status_number'
});

let Status = mongoose.model('Status', StatusSchema);

module.exports = Status;