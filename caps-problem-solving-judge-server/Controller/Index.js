const axios = require('axios');
const RestAPI = require('../constants/RestAPI.js');
const Judger = require('../Judge/Judger.js');
const Utility = require('../Utility/Utility.js');

const JudgeController = {
    GetInQueue: async () => {
        // console.log(RestAPI.SERVER_DOMAIN + RestAPI.JUDGE_ARG + 'getInQueue');
        let queue = await axios.get(RestAPI.SERVER_DOMAIN + RestAPI.JUDGE_ARG + 'getInQueue')
            .catch(error => {
                console.log(error);
                return false;
            });
        const ret = queue.data.status;
        if (ret === null) return false;
        if (ret.length === 0) return false;
        if (ret[0] === null) return false;
        return ret[0];
    },
    UpdateSubmission: async (data) => {
        let judgeResult = await Judger.getJudgeResult(data);
        new Promise((resolve, reject) => {
            axios.post(RestAPI.SERVER_DOMAIN + RestAPI.JUDGE_ARG + 'updateResult', judgeResult)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
};

module.exports = JudgeController;

const MainController = {
    Do: async () => {
        while (true) {
            const queue_front = await JudgeController.GetInQueue();
            if (queue_front !== false) {
                await JudgeController.UpdateSubmission(queue_front);
                await Utility.sleep(1000);
            } else {
                await Utility.sleep(1000);
            }
        }
    },
};

module.exports = MainController;