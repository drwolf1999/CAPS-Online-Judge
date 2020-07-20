const mongoose = require('mongoose');

/**
 * In order
 * problem number
 * name (title)
 * description
 *
 * */

function parseJSON(value) {
    return JSON.parse(value);
}

let ProblemSchema = new mongoose.Schema({
    number: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        default: '',
    },
    memory_limit: {
        type: Number,
        required: true,
        default: 128000000,
        get: (value) => { return value / 1000.0 / 1000.0; }
    },
    time_limit: {
        type: Number,
        required: true,
        default: 1000,
        get: (value) => { return value / 1000.0; }
    },
    description: {
        type: String,
        get: parseJSON,
    },
    input: {
        type: String,
        required: true,
        default: '',
        get: parseJSON,
    },
    output: {
        type: String,
        required: true,
        default: '',
        get: parseJSON,
    },
    examples: {
        type: [{input: String, output: String}],
        default: [],
    },
    answers: {
        type: Number,
        required: true,
        default: 0,
    },
    submits: {
        type: Number,
        required: true,
        default: 0,
    }
}, {toJSON: {getters: true}});

ProblemSchema.statics.getProblem = function (problemNumber) {
    return this.findOne({number: problemNumber})
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