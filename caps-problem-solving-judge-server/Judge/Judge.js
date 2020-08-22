const exec = require('child_process').exec;
const PATH = '';
class RESULTTYPE {
    constructor(x, y) {
        this.real = x;
        this.priority = y;
    }
}
const RESULT = {
    'AC': RESULTTYPE(0, 1),
    'WA': RESULTTYPE(0, 2),
    'TLE': RESULTTYPE(0, 2),
    'MLE': RESULTTYPE(0, 2),
    'RE': RESULTTYPE(0, 2),
    'CE': RESULTTYPE(0, 3),
};

const TABLE = {
    'ACCEPTED': 'AC',
    'WRONG_ANSWER': 'WA',
    'TIME_LIMIT_EXCEEDED': 'TLE',
};

async function sh(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                // console.log('TT ' + cmd);
                return resolve({ stdout, stderr });
            }
        });
    });
}

async function judge() {
    let code_name = 'a';
    let extension = '.cpp';
    let time_limit = 1.0;
    let memory_limit = 128;
    let testcase = [
        {'input': 'a.in', 'output': 'a.out'}
    ];
    let cmd = 'ljudge';
    cmd += ' --max-cpu-time ' + time_limit;
    cmd += ' --max-memory ' + memory_limit + 'm';
    cmd += ' --user-code ' + code_name + extension;
    for (let i = 0; i < testcase.length; i++) {
        cmd += ' --testcase';
        cmd += ' --input ' + testcase[i]['input'];
        cmd += ' --output ' + testcase[i]['output'];
    }
    cmd += ' --threads 1';
    return await sh(cmd)
        .then(data => {
            return data['stdout'];
        })
        .catch(error => {
            console.log(error);
        });
}

async function Update(now, msg) {
    switch (msg) {
        case 'ACCEPTED':

            break;

        default:
            break;
    }
}

async function getJudgeResult() {
    let ret = {
        'result': 0,
        'time': 0.0,
        'memory': 0,
    };
    let result = JSON.parse(await judge());
    if (result['success'] == false) {
        ret.result = RESULT.CE.real;
        return ret;
    }
    for (let i = 0; i < result['testcases'].length; i++) {
        ret.result = Update(ret.result, result['testcases'][i].result);
        ret.time = Math.max(ret.time, result['testcases'][i].time);
        ret.memory = Math.max(ret.memory, result['testcases'][i].memory);
    }
    return ret;
}