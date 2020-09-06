const UserProblem = require('../models/UserProblem');
const Auth = require('../models/Auth');
const CONTEST_START = new Date('2020-09-03 01:30:00 GMT+09:00');

function Penalty(O) {
    const d1 = new Date(O.lastSubmit_time);
    const T = Math.abs(d1.getTime() - CONTEST_START.getTime()) / 1000 / 60;
    const R = 20 * (O.submit_count - 1);
    const G = 0;
    return (O.judge_result === 1 ? 1 : 0) * (T + R + G);
}

const StandingController = {
    All: async (req, res, next) => {
        try {
            const allUser = await Auth.find({}).exec();
            const info = await UserProblem.find({}).populate('problem').exec();
            let standing = {}, users = [];
            for (let i = 0; i < info.length; i++) {
                if (!(info[i].username in standing)) {
                    standing[info[i].username] = {};
                    standing[info[i].username][info[i].problemNumber] = {};
                }
                standing[info[i].username][info[i].problemNumber] = {
                    score: info[i].problem.score,
                    judge_result: info[i].judge_result,
                    submit_count: info[i].submit_count,
                    notAC_count: info[i].notAC_count,
                    penalty: Penalty(info[i]),
                };
            }
            for (let i = 0; i < allUser.length; i++) {
                let score = 0, solved_count = 0;
                if (allUser[i].username in standing) {
                    for (let j in standing[allUser[i].username]) {
                        score += Math.max(standing[allUser[i].username][j].judge_result === 1 ? standing[allUser[i].username][j].score - standing[allUser[i].username][j].penalty : 0, 0);
                        solved_count += standing[allUser[i].username][j].judge_result === 1 ? 1 : 0;
                    }
                }
                users.push({
                    username: allUser[i].username,
                    score: score,
                });
            }
            users.sort((a, b) => {
                if (a.score === b.score) return -(a.score - b.score);
                return -(a.score - b.score);
            });
            return res.status(200).json({
                Standing: standing,
                Users: users,
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