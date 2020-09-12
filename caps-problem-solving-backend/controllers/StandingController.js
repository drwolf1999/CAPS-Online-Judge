const UserProblem = require('../models/UserProblem');
const Auth = require('../models/Auth');
const CONTEST_START = new Date(process.env.CONTEST_TIME);

const IsContestMOD = process.env.CONTEST_MOD === 'true';


const StandingController = {
    All: async (req, res, next) => {
        try {
            let Users;
            let Group;
            if (IsContestMOD) {
                Group = {
                    _id: '$username',
                    username: {$first: '$username'},
                    score: {
                        $sum: {
                            $multiply: [
                                '$judge_result',
                                {
                                    $max: [
                                        0,
                                        {
                                            $subtract: [
                                                '$problem.score',
                                                {
                                                    $add: [
                                                        {
                                                            $subtract: [
                                                                '$lastSubmit_time',
                                                                CONTEST_START
                                                            ]
                                                        },
                                                        {
                                                            $multiply: [
                                                                20,
                                                                '$submit_count'
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                    ]
                                }
                            ]
                        }
                    },
                    answers: {$sum: '$judge_result'},
                    submits: {$sum: '$submit_count'},
                    problem: {
                        $push: {
                            number: '$problemNumber',
                            judge_result: '$judge_result',
                            submit_count: '$submit_count',
                        }
                    }
                };
            } else {
                Group = {
                    _id: '$username',
                    username: {$first: '$username'},
                    score: {
                        $sum: {
                            $multiply: [
                                '$problem.score',
                                '$judge_result'
                            ]
                        }
                    },
                    answers: {$sum: '$judge_result'},
                    submits: {$sum: '$submit_count'},
                };
            }
            Users = await UserProblem.aggregate()
                .lookup({
                    from: 'problems',
                    localField: 'problemNumber',
                    foreignField: 'number',
                    as: 'problem',
                })
                .unwind('problem')
                .group(Group)
                .sort('-score -answers submits');
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
    GetByUser: async (username, problemNumber) => {
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
    SubmitUpdate: async (username, problemNumber, submissionTime) => {
        try {
            let userProblem = await UserProblem.findOne({username: username, problemNumber: problemNumber}).limit(1);
            if (!userProblem) {
                userProblem = new UserProblem({
                    username: username,
                    problemNumber: problemNumber,
                    judge_result: null,
                    notAC_count: 0,
                    lastSubmit_time: submissionTime,
                });
                await userProblem.save();
            } else {
                userProblem.submit_count++;
                userProblem.lastSubmit_time = new Date(userProblem.lastSubmit_time) < new Date(submissionTime) ? submissionTime : userProblem.lastSubmit_time;
                await userProblem.save();
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    Reset: async (problemNumber) => {
        try {
            await UserProblem.update({problemNumber: problemNumber}, {
                $set: {
                    judge_result: null,
                    notAC_count: 0,
                }
            }, {multi: true});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    ResultUpdate: async (username, problemNumber, judge_result, submissionTime) => {
        try {
            let userProblem = await UserProblem.findOne({username: username, problemNumber: problemNumber}).limit(1);
            if (!userProblem) {
                userProblem = new UserProblem({
                    username: username,
                    problemNumber: problemNumber,
                    judge_result: judge_result,
                    notAC_count: judge_result !== 1,
                    lastSubmit_time: submissionTime,
                });
                await userProblem.save();
            } else {
                userProblem.judge_result = userProblem.judge_result !== null && userProblem.judge_result === 1 ? 1 : judge_result;
                userProblem.notAC_count += judge_result !== 1;
                userProblem.lastSubmit_time = new Date(userProblem.lastSubmit_time) < new Date(submissionTime) ? submissionTime : userProblem.lastSubmit_time;
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