const Status = require('../models/Status');

const StatusController = {
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
};

module.exports = StatusController;