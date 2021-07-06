const exec = require('child_process').exec;

const ShellHelper = {
    sh: async (cmd) => {
        return new Promise(function (resolve, reject) {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return err;
                } else {
                    return resolve({stdout, stderr});
                }
            });
        })
            .catch(error => {
                console.log(error);
                return false;
            });
    },
};

module.exports = {
    ShellHelper: ShellHelper,
};