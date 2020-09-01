const Status = require('../models/Status');
const Problem = require('../models/Problem');

const StatusController = {
        /// Original
        All: (req, res, next) => {
            console.log(req.params.page);
            Status.getAllStatus(req.params.page)
                .then(Status => {
                    res.status(200).json({
                        Status: Status,
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
        Get: (req, res, next) => {
            console.log(req.params.submitNumber);
            Status.getStatus(req.params.submitNumber)
                .then(status => {
                    console.log(status);
                    res.status(200).json({
                        Status: status,
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
        Create: async (req, res, next) => {
            try {
                const problem = await Problem.findById(req.body.problem).exec();
                if (problem === null || problem === undefined)
                    return res.status(404).json({
                        status: null,
                        message: 'forbidden',
                    });
                let status = new Status({
                    user: req.body.user,
                    problem: req.body.problem,
                    code: req.body.code,
                    language: req.body.language,
                });
                status = await status.save();
                await Problem.findOneAndUpdate({number: status.problem.number}, {
                    $inc: {
                        submits: 1,
                    }
                })
                    .exec();
                return res.status(200).json({
                    Status: status,
                    message: 'success',
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: error,
                    message: 'error',
                });
            }
        },
        /////// for judgement
        GetInQueue: (req, res, next) => {
            Status.find()
                .where('judge_result').equals('7')
                .sort('-submit_time')
                .populate('problem')
                .limit(1)
                .then(status => {
                    if (status === null || status === undefined || Object.keys(status).length === 0) {
                        return res.status(200).json({
                            status: null,
                        });
                    } else {
                        return res.status(200).json({
                            status: status,
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).json({
                        error: error,
                        message: 'error',
                    });
                });
        },
        UpdateResult: async (req, res, next) => {
            const submitNumber = req.body.number;
            try {
                const result = await Status.findOneAndUpdate({number: submitNumber}, {
                    $set: {
                        judge_result: req.body.judge_result,
                        time: req.body.time,
                        memory: req.body.memory,
                    }
                }, {new: true})
                    .populate('problem')
                    .exec();
                if (result === null || result === undefined) {
                    res.status(404).json({
                        message: 'forbidden',
                    });
                }
                if (result.judge_result === 1) await Problem.findOneAndUpdate({number: result.problem.number}, {$inc: {answers: 1}}).exec();
                res.status(200).json({
                    result: result,
                });
            } catch (error) {
                res.status(500).json({
                    error: error,
                });
                throw error;
            }
        },
    }
;

module.exports = StatusController;