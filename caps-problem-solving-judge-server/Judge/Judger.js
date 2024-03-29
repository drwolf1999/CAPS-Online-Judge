const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const TC_PATH = '/data/testcase/';
const WORK_PATH = '/data/target/';
const USER_OUTPUT = '/data/target/output/user.out';
const LOG_PATH = '/data/log/';
const ANSWER_CHECKER = '/judge/answerChecker.o';

class RESULTTYPE {
    constructor(x, y) {
        this.real = x;
        this.priority = y;
    }
}

//WA, OK, CE, RE, MLE, TLE, JUDGING, WAIT
const RESULT = {
    'WA': new RESULTTYPE(0, 2),
    'AC': new RESULTTYPE(1, 1),
    'CE': new RESULTTYPE(2, 3),
    'RE': new RESULTTYPE(3, 2),
    'MLE': new RESULTTYPE(4, 2),
    'TLE': new RESULTTYPE(5, 2),
};

const TABLE = {
    0: 'AC',
    1: 'TLE',
    3: 'MLE',
    4: 'RE',
    5: 'JUDGE_ERROR',
    6: 'WA',
};

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
const JudgerHelper = {
    judge: async (FILE, problem, input, language) => {
        let time_limit = problem.time_limit;
        let memory_limit = problem.memory_limit;
        if (language === 2) {
            time_limit = time_limit * 2 + 1;
            memory_limit = memory_limit * 2 + 32;
        }
        let judger = '/usr/lib/judger/libjudger.so';
        judger += ' --max_cpu_time=' + (time_limit * 1000);
        judger += ' --max_memory=' + (memory_limit * 1000 * 1000); // byte to mb
        judger += ' --exe_path=' + FILE;
        judger += ' --input_path=' + input;
        judger += ' --output_path=' + USER_OUTPUT;
        judger += ' --error_path=' + LOG_PATH + 'log.log';
        judger += ' --uid=0 --gid=0';
        let cmd = judger;//'runuser -l ljudge -c ' + ljudge;
        return await ShellHelper.sh(cmd)
            .then(data => {
                return data['stdout'];
            })
            .catch(error => {
                console.log(error);
            });
    },
    Update: async (now, msg, answerOUTPUT) => {
        switch (msg) {
            case 0:
                // console.log(ANSWER_CHECKER + ' ' + answerOUTPUT + ' ' + USER_OUTPUT);
                // console.log((await ShellHelper.sh('cat ' + answerOUTPUT)).stdout + ' ' + (await ShellHelper.sh('cat ' + USER_OUTPUT)).stdout);
                let checker = await ShellHelper.sh(ANSWER_CHECKER + ' ' + answerOUTPUT + ' ' + USER_OUTPUT);
                // console.log('checker : ' + JSON.stringify(checker));
                if (checker.stdout === 'WA') {
                    return 0;
                }
                return 1;
                break;
            case 1: // TLE
                return RESULT.TLE.real;
            case 2:
                throw Error('undefined');
                break;
            case 3: // MLE
                return RESULT.MLE.real;
            case 4: // RE
                return RESULT.RE.real;
            case 5:
                return 8;
                break;
        }
        return -1;
    },
};
module.exports = JudgerHelper;

const Judger = {
    getJudgeResult: async (status_info) => {
        // console.log(status_info);
        const language = status_info.language;
        const user_code = status_info.code;
        let ret = {
            'number': status_info.number,
            'judge_result': 0,
            'time': 0.0,
            'memory': 0,
        };
        let FILE = path.join(WORK_PATH, 'Main');
        let OBJ = WORK_PATH;
        let compile_log;
        let cmd;
        switch (language) {
            case 0:
                FILE = FILE + '.c';
                cmd = 'gcc -o ' + WORK_PATH + 'Main.o ' + FILE + ' -O2 -Wall -lm -static -std=c11 -DONLINE_JUDGE -DBOJ';
                OBJ = OBJ + 'Main.o';
                break;
            case 1:
                FILE = FILE + '.cpp';
                cmd = 'g++ -o ' + WORK_PATH + 'Main.o ' + FILE + ' -O2 -Wall -lm -static -std=gnu++14 -DONLINE_JUDGE -DBOJ';
                OBJ = OBJ + 'Main.o';
                break;
            case 2:
                FILE = FILE + '.3.py';
                cmd = 'pyinstaller --onefile ' + FILE + ' --distpath ' + WORK_PATH;
                OBJ = OBJ + 'Main.3';
                break;
            default:
                throw Error('not support language');
        }
        fs.writeFileSync(FILE, user_code, {encoding: 'utf-8'});
        compile_log = await ShellHelper.sh(cmd);
        // console.log(OBJ);
        // console.log(fs.existsSync(OBJ) + compile_log);
        if (!fs.existsSync(OBJ) || !compile_log || compile_log['stdout'].length !== 0) {
            ret.judge_result = 2;
            return ret;
        }
        await ShellHelper.sh('chmod +x ' + OBJ);
        // if (language === 2) {
        //     await ShellHelper.sh('mv ' + WORK_PATH + 'dist/Main.3 ' + OBJ); // move
        // }
        let files = await fs.readdirSync(TC_PATH + status_info.problem.number);
        const working_dir = TC_PATH + status_info.problem.number + '/';
        let inputs = [], outputs = [];
        // console.log(files);
        files.forEach(file => {
            if (file.indexOf('.in') > 0) {
                inputs.push(working_dir + file);
            } else if (file.indexOf('.out') > 0) {
                outputs.push(working_dir + file);
            }
        });
        inputs.sort();
        outputs.sort();
        let i = 0, o = 0;
        while (i < inputs.length && o < outputs.length) {
            const ii = inputs[i].replace('.in', '');
            const oo = outputs[o].replace('.out', '');
            if (ii < oo) {
                i++;
                continue;
            } else if (ii > oo) {
                o++;
                continue;
            }
            let result = JSON.parse(await JudgerHelper.judge(OBJ, status_info.problem, inputs[i], language));
            // console.log(result);
            ret.judge_result = await JudgerHelper.Update(ret.judge_result, result.result, outputs[o]);
            if (ret.judge_result !== 1) break;
            ret.time = Math.max(ret.time, result.cpu_time);
            ret.memory = Math.max(ret.time, result.memory);
            i++;
            o++;
        }
        if ((inputs.length === 0 || outputs.length === 0) && ret.judge_result === 0) ret.judge_result = 1;
        return ret;
    },
};
//              /usr/lib/judger/libjudger.so
module.exports = Judger;