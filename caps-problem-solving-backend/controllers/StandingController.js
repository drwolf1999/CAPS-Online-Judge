const UserProblem = require('../models/UserProblem');
const User = require('../models/User');
const CONTEST_START = new Date(process.env.CONTEST_TIME);

const IsContestMOD = process.env.CONTEST_MOD === 'true';

function Penalty(O) {
    const d1 = new Date(O.lastSubmit_time);
    const T = Math.abs(d1.getTime() - CONTEST_START.getTime()) / 1000 / 60;
    const R = 20 * (O.submit_count - 1);
    const G = 0;
    return (O.judge_result === 1 ? 1 : 0) * (T + R + G);
}

const QueryBuilder = {
    Query: async (username, page) => {
        try {
            const matchQuery = username === undefined || username === null ? {} : {'user.username': username};
            let Users;
            let Group = {
                _id: '$username',
                user: {$first: '$user'},
                answers: {$sum: '$judge_result'},
                submits: {$sum: '$submit_count'},
                problems: {
                    $push: {
                        number: '$problemNumber',
                        judge_result: '$judge_result',
                        submit_count: '$submit_count',
                    }
                }
            };
            if (IsContestMOD) {
                Group.score = {
                    $sum: {
                        $multiply: [
                            '$judge_result',
                            {
                                $max: [
                                    0,
                                    {
                                        $subtract: [
                                            '$problem.score',
                                            '$penalty'
                                        ]
                                    },
                                ]
                            }
                        ]
                    }
                };
            } else {
                Group.score = {
                    $sum: {
                        $multiply: [
                            '$problem.score',
                            '$judge_result'
                        ]
                    }
                };
            }
            Users = await UserProblem.aggregate([
                {
                    $lookup: {
                        from: 'auths',
                        let: {"username": "$username"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {$eq: ["$username", "$$username"]},
                                }
                            },
                            {$project: {"password": 0, "_id": 0, "permission": 0, "profile_url": 0}}
                        ],
                        as: 'user',
                    }
                },
                {
                    $unwind: '$user'
                },
            ])
                .lookup({
                    from: 'problems',
                    localField: 'problemNumber',
                    foreignField: 'number',
                    as: 'problem',
                })
                .unwind('problem')
                .group(Group)
                .sort('problems.number')
                .sort('-score -answers submits')
                .group({
                    _id: false,
                    users: {
                        $push: {
                            user: '$user',
                            score: '$score',
                            answers: '$answers',
                            submits: '$submits',
                            problems: '$problems',
                        }
                    }
                })
                .unwind({
                    path: '$users',
                    includeArrayIndex: 'users.rank'
                })
                .replaceRoot('$users')
                .match(matchQuery)
                .skip((page - 1) * 100)
                .limit(100);
            // console.log(Users);
            return Users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
};

const StandingController = {
    All: async (req, res, next) => {
        try {
            let page = req.query.page;
            if (page === undefined || page === null) page = 1;
            const Users = await QueryBuilder.Query(null, page);
            return res.status(200).json({
                Users: Users,
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
    Get: async (req, res, next) => {
        try {
            let Standing = await QueryBuilder.Query(req.params.username, 1);
            if (Standing.length === 0) Standing = null;
            else Standing = Standing[0];
            return res.status(200).json({
                Standing: Standing,
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
    GetByUserProblem: async (username, problemNumber) => {
        try {
            const result = await UserProblem.find({username: username, problemNumber: problemNumber})
                .limit(1)
                .exec();
            if (result.length === 1) {
                return result[0].judge_result;
            } else {
                return -1;
            }
        } catch (error) {
            console.log(error);
        }
    },
    Reset: async (problemNumber) => {
        try {
            await UserProblem.update({problemNumber: problemNumber}, {
                $set: {
                    judge_result: 0,
                    notAC_count: 0,
                    penalty: 0,
                }
            }, {multi: true});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    ResultUpdate: async (username, problemNumber, submissionTime, judge_result) => {
        try {
            if (judge_result === undefined) judge_result = null;
            let userProblem = await UserProblem.findOne({username: username, problemNumber: problemNumber});
            if (!userProblem) {
                userProblem = new UserProblem({
                    username: username,
                    problemNumber: problemNumber,
                    judge_result: judge_result,
                    notAC_count: judge_result !== 1,
                    lastSubmit_time: submissionTime,
                    penalty: Penalty({
                        lastSubmit_time: submissionTime,
                        submit_count: 1,
                        judge_result: judge_result,
                    }),
                });
                await userProblem.save();
            } else {
                userProblem.submit_count++;
                userProblem.judge_result = (userProblem.judge_result !== null && userProblem.judge_result === 1) ? 1 : judge_result;
                userProblem.notAC_count += judge_result !== 1;
                userProblem.lastSubmit_time = new Date(userProblem.lastSubmit_time) < new Date(submissionTime) ? submissionTime : userProblem.lastSubmit_time;
                userProblem.penalty = Math.max(userProblem.penalty, Penalty({
                    lastSubmit_time: userProblem.lastSubmit_time,
                    submit_count: userProblem.submit_count,
                    judge_result: userProblem.judge_result,
                }));
                await userProblem.save();
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
};

module.exports = StandingController;