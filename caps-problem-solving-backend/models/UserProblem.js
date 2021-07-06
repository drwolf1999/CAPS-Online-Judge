const mongoose = require('mongoose');

/**
 * In order
 * user name
 * problem number
 * result (-1=>not submit, 0=>not AC, 1=>AC)
 * */
let UserProblemSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    problemNumber: {
        type: Number,
        required: true,
    },
    judge_result: {
        type: Number,
        required: true,
        default: 7,
    },
    submit_count: {
        type: Number,
        default: 1,
    },
    notAC_count: {
        type: Number,
        default: 0,
    },
    lastSubmit_time: {
        type: mongoose.Schema.Types.Date,
        required: true,
    },
    penalty: {
        type: Number,
        default: 0,
    }
});

UserProblemSchema.virtual('problem', {
    ref: 'Problem',
    localField: 'problemNumber',
    foreignField: 'number',
    justOne: true // for many-to-1 relationships
});

UserProblemSchema.virtual('user', {
    ref: 'User',
    localField: 'username',
    foreignField: 'username',
    justOne: true // for many-to-1 relationships
});

let UserProblem = mongoose.model('UserProblem', UserProblemSchema);

module.exports = UserProblem;