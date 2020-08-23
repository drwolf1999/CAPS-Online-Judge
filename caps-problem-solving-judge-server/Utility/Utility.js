const Utility = {
    sleep: async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};

module.exports = Utility;