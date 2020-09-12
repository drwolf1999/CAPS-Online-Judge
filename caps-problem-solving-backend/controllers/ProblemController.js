const Problem = require('../models/Problem');
const {ShellHelper} = require('../middleware/Utility');
const {UPLOAD_DIR} = require('../constants/Path');
const JudgeResult = require('./StandingController').GetByUser;

const ProblemController = {
    Count: (req, res, next) => {
        Problem.countDocuments()
            .then(count => {
                res.status(200).json({
                    Count: count,
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
    All: async (req, res, next) => {
        try {
            const Problems = await Problem.getAllProblems();
            let userJudgeResult = {};
            for (let i = Problems.length - 1; i >= 0; i--) {
                userJudgeResult[Problems[i].number] = await JudgeResult(req.userData.username, Problems[i].number);
            }
            await console.log(userJudgeResult);
            console.log(Problems);
            return res.status(200).json({
                Problems: Problems,
                userJudgeResult: userJudgeResult,
                message: 'success',
            });
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'fail',
            });
        }
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
    Create: async (req, res, next) => {
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
            score: parseInt(req.body.score),
            description: req.body.description,
            input: req.body.input,
            output: req.body.output,
            examples: examples,
        })
        try {
            problem = await problem.save();
            await ShellHelper.sh('mkdir -p ' + UPLOAD_DIR + '/' + problem.number);
            res.status(200).json({
                Problem: problem,
                message: 'success',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'fail',
            });
        }
    },
    Update: async (req, res, next) => {
        let examples = [], example_string = JSON.parse(req.body.examples);
        for (let i = 0; i < example_string.length; i++) {
            examples.push({
                input: example_string[i].input,
                output: example_string[i].output,
            });
        }
        try {
            console.log('init');
            const newProblem = await Problem.findOneAndUpdate({number: req.params.problemNumber}, {
                name: req.body.name,
                memory_limit: parseInt(req.body.memory_limit) * 1000 * 1000,
                time_limit: parseInt(req.body.time_limit) * 1000,
                score: parseInt(req.body.score),
                description: req.body.description,
                input: req.body.input,
                output: req.body.output,
                examples: examples,
            }, {new: true});
            return res.status(201).json({
                Problem: newProblem,
                message: 'success',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'success',
            });
        }
    },
    // About Testcase
};

module.exports = ProblemController;