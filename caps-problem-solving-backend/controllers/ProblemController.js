const Problem = require('../models/Problem');

const ProblemController = {
    Count: (req, res, next) => {
        Problem.countDocuments()
            .then(count => {
                res.status(200).json({
                    count: count,
                    message: 'success',
                });
            })
            .catch(error => {
                res.status(500).json({
                    error: error,
                    message: 'fail',
                });
            });
    },
    All: (req, res, next) => {
        Problem.getAllProblems()
            .then(Problems => {
                res.status(200).json({
                    Problems: Problems,
                    message: 'success',
                });
            })
            .catch(error => {
                res.status(500).json({
                    error: error,
                    message: 'fail',
                });
            })
    },
};

module.exports = ProblemController;