const Status = require('../models/Status');
const Problem = require('../models/Problem');
const UserProblemUpdate = require('./StandingController');
const StatusController = {
        /// Original
        All: (req, res, next) => {
            // console.log(req.params.page);
            Status.getAllStatus(req.params.page)
                .then(Status => {
                    // console.log(Status);
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
        GetBySocket: (io) => {
            const instanceIO = io.of('/getStatus');
            let statusNumber;
            instanceIO.on('connection', socket => {
                console.log('connection');
                // socket.on('disconnect', (data) => {
                //     //
                // });
                // let instanceID = socket.id;
                // socket.on('joinStatus', async (info) => {
                //     socket.join(info.statusNumber);
                //     statusNumber = info.statusNumber;
                //     console.log('connect   ' + info.statusNumber);
                // });
                // socket.on('getStatus', async (info) => {
                //     const sN = info.statusNumber;
                //     try {
                //         const ret = await Status.getStatus(sN);
                //         console.log(statusNumber + '`room : ' + JSON.stringify(ret));
                //         instanceIO.to(statusNumber).emit('result', {
                //             statusNumber: statusNumber,
                //             success: true,
                //             Status: ret,
                //         });
                //         if (ret.judge_result < 6) socket.leave();
                //     } catch (error) {
                //         console.log(error);
                //         instanceIO.to(statusNumber).emit('result', {
                //             success: false,
                //             error: error,
                //         });
                //     }
                // });
            });
        },
        Create: async (req, res, next) => {
            try {
                const problem = await Problem.getProblem(req.body.problem);
                if (problem === null || problem === undefined)
                    return res.status(404).json({
                        status: null,
                        message: 'forbidden',
                    });
                let status = new Status({
                    username: req.body.username,
                    problemNumber: req.body.problem,
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
                await UserProblemUpdate.SubmitUpdate(req.body.username, req.body.problem, status.submit_time);
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
        Rejudging: async (req, res, next) => {
            try {
                let filter = {};
                if (parseInt(req.body.type) === 0) {
                    filter['problemNumber'] = req.body.problemNumber;
                }
                await Status
                    .updateMany({problemNumber: req.body.problemNumber}, {$set: {judge_result: 7}});
                await UserProblemUpdate.Reset(req.body.problemNumber);
                await Problem.update({number: req.body.problemNumber}, {$set:{answers: 0}});
                return res.status(200).json({
                    result: true,
                    message: 'success',
                });
            } catch (error) {
                return res.status(500).json({
                    result: false,
                    error: error,
                    message: 'error',
                })
            }
        },
        /////// for judgement
        GetInQueue: (req, res, next) => {
            Status.find()
                .where('judge_result').equals('7')
                .sort('number')
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
                    .populate('user')
                    .exec();
                if (result === null || result === undefined) {
                    res.status(404).json({
                        message: 'forbidden',
                    });
                }
                if (result.judge_result === 1) await Problem.findOneAndUpdate({number: result.problem.number}, {$inc: {answers: 1}}).exec();
                if (result.judge_result < 6) await UserProblemUpdate.ResultUpdate(result.username, result.problemNumber, result.judge_result, result.submit_time);
                //// broadcast all clients
                const io = req.app.io.of('/getStatus');
                console.log(io);
                io.emit('result', {
                    statusNumber: result.number,
                    judge_result: result.judge_result,
                });
                //// end broadcast
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