#include "include/judger.h"

#include <string>
#include <fstream>
#define DEBUG_MODE true
#ifdef DEBUG_MODE
#include <string>
#include <iostream>
#include <vector>
#endif // DEBUG_MODE

enum JUDGE_RESULT {
    WRONG_ANSWER,
    CORRECT,
    // COMPILE_ERROR,
    // RUNTIME_ERROR,
    // MEMORY_LIMIT_ERROR,
    // TIME_LIMIT_ERROR,
    // RUNNING,
    // INQUEUE,
};

void ERROR_LOG(const char * log_info) {
    using namespace std;
    const string LOG_FILE_DIR = "E:/programing/caps/caps-problem-solving-backend/JUDGE/";
    ofstream log_file((LOG_FILE_DIR + "error.log").c_str(), ofstream::out | ofstream::app);
    if (DEBUG_MODE) {
        log_file << log_info << '\n';
    }
    log_file.close();
}

bool AllowChecker(const char &ch, const std::vector<char> allowList) {
    for (size_t i = 0; i < allowList.size(); i++) {
        if (allowList[i] == ch) return true;
    }
    return false;
}

int Judger(const std::string answerResultFile, const std::string userResultFile) {
    //------------------------ Preprocessing -----------------------//
    const std::string JUDGE_FILE_DIR = "E:/programing/caps/caps-problem-solving-backend/JUDGE/";
    int ans_fd, user_fd;
    if (FastIO::fileOpen(ans_fd, (JUDGE_FILE_DIR + answerResultFile).c_str()) == -1) {
        ERROR_LOG("Failed open Answer File");
        exit(1);
    }
    if (FastIO::fileOpen(user_fd, (JUDGE_FILE_DIR + userResultFile).c_str()) == -1) {
        ERROR_LOG("Failed open User File");
        exit(1);
    }
    //------------------------ End Preprocessing -----------------------//
    //------------------------ Start Judging ---------------------------//
    FastIO ans_io(ans_fd), user_io(user_fd);
    int ret = JUDGE_RESULT::CORRECT;
    std::string ans, user;
    register char ans_char, user_char;
    bool ans_chk = true, user_chk = true;
    while (ans_chk || user_chk) {
        ans_chk = ans_io.getChar(ans_char);
        user_chk = user_io.getChar(user_char);
        if (ans_chk) {
            if (user_chk) { // check both
                switch (ans_char)
                {
                case '\n': // If ans_char is new line, then judger allows only [blank(' '), new line('\n')]
                    if (!AllowChecker(user_char, {' ', '\n'})) ret = JUDGE_RESULT::WRONG_ANSWER;
                    else {
                        if (user_char == ' ') {
                            user_chk = user_io.getChar(user_char); // one letter skip (because pass)
                            if (user_char != '\n') ret = JUDGE_RESULT::WRONG_ANSWER;
                        }
                    }
                    break;
                default:
                    if (user_char != ans_char) ret = JUDGE_RESULT::WRONG_ANSWER; // Just Wrong Answer
                    break;
                }
            } else { // this is not allow now....
                ret = JUDGE_RESULT::WRONG_ANSWER;
                break;
            }
        } else {
            if (user_chk) { // If ans_char does not exist and user_char exists, user_char allows only one [blank(' '), new line('\n')].
                if (!AllowChecker(user_char, {' ', '\n'})) ret = JUDGE_RESULT::WRONG_ANSWER;
            } else {
                break; // Neither of them received input. Then it's over.
            }
        }
        ans.push_back(ans_char);
        user.push_back(user_char);
        if (ret == JUDGE_RESULT::WRONG_ANSWER) break; // Avoid meaningless operations
    }
    //------------------------ End Judging -----------------------------//
    if (ret == 0) {
        std::cout << "WRONG ANSWER";
    } else {
        std::cout << "SUCCESS";
    }
    close(ans_fd);
    close(user_fd);
    return ret;
}