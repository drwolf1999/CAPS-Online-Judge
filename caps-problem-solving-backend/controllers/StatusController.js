const Status = require('../models/Status');

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
        Status.getStatus(req.params.submitNumber)
            .then(statusData => {
                res.status(200).json({
                    Problem: statusData,
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
        console.log(req.body.user);
        console.log(req.body.problem);
        let status = new Status({
            user: req.body.user,
            problem: req.body.problem,
            code: req.body.code,
            language: req.body.language,
        });
        status.save()
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
    /////// for judgement
    GetInQueue: (req, res, next) => {
        console.log('init');
        Status.find()
            .where('judge_result').equals('7')
            .sort('-submit_time')
            .populate('problem')
            .limit(1)
            .then(status => {
                console.log('judge ret status : ' + status);
                if (Object.keys(status).length === 0) {
                    return res.status(200).json({
                        status: {},
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
    UpdateResult: (req, res, next) => {
        //
    },
};

module.exports = StatusController;