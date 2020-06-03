const mongoose = require('mongoose');

/**
 * In order
 * problem number
 * name (title)
 * description
 *
 * */

let ProblemSchema = new mongoose.Schema({
    number: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
    },
    description: String,
    input: {
        type: String,
    },
    output: {
        type: String,
    },
    examples: {
        type: [{input: String, output: String}],
        default: [],
    },
    answers: {
        type: Number,
        default: 0,
    },
    submits: {
        type: Number,
        default: 0,
    }
});

ProblemSchema.statics.getProblem = function (ProblemId) {
    return this.findById(ProblemId)
        .exec();
};

ProblemSchema.statics.getAllProblems = function () {
    return this.find({}, null)
        .exec();
};

ProblemSchema.plugin(require('mongoose-auto-increment').plugin, {
    model: 'Problem',
    field: 'number',
    startAt: 1000,
    increment: 1,
});

let Problem = mongoose.model('Problem', ProblemSchema);

module.exports = Problem;