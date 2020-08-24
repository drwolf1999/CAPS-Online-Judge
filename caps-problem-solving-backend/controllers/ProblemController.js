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
    Get: (req, res, next) => {
        Problem.getProblem(req.params.problemNumber)
            .then(problemData => {
                res.status(200).json({
                    Problem: problemData,
                    message: 'success',
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    error: error,
                    message: 'fail',
                });
            })
    },
    Create: (req, res, next) => {
        let examples = [], example_string = JSON.parse(req.body.examples);
        for (let i = 0; i < example_string.length; i++) {
            examples.push({
                input: example_string[i].input,
                output: example_string[i].output,
            });
        }
        let problem = new Problem({
            name: req.body.name,
            memory_limit: parseInt(req.body.memory_limit) * 1000 * 1000,
            time_limit: parseInt(req.body.time_limit) * 1000,
            description: req.body.description,
            input: req.body.input,
            output: req.body.output,
            examples: examples,
        })
        problem.save()
            .then(problem => {
                console.log(problem);
                res.status(200).json({
                    Problem: problem,
                    message: 'success',
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    error: error,
                    message: 'fail',
                });
            });
    },
};

module.exports = ProblemController;