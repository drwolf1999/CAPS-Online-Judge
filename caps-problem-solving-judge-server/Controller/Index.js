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
            });
        const ret = queue.data.status;
        if (ret.length === 0) return false;
        return ret[0];
    },
    UpdateSubmission: async (data) => {
        let judgeResult = await Judger.getJudgeResult(data);
        console.log(judgeResult);
    },
};

module.exports = JudgeController;

const MainController = {
    Do: async () => {
        while (true) {
            const queue_front = await JudgeController.GetInQueue();
            if (queue_front !== false) {
                await JudgeController.UpdateSubmission(queue_front);
            } else {
                await Utility.sleep(1000);
            }
        }
    },
};

module.exports = MainController;