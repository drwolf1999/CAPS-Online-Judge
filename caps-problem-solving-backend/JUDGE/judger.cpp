#include "FastIO.h"

#include <string>
#include <fstream>
#define DEBUG_MODE true

void ERROR_LOG(const char * log_info) {
    using namespace std;
    const string LOG_FILE_DIR = "E:/programing/caps/caps-problem-solving-backend/JUDGE/";
    ofstream log_file((LOG_FILE_DIR + "error.log").c_str(), ofstream::out | ofstream::app);
    if (DEBUG_MODE) {
        log_file << log_info << '\n';
    }
    log_file.close();
}

// args[0] : this, args[1] : answer result file, args[2] : user result file
int main(int argc, const char * args[]) {
    //------------------------ Preprocessing -----------------------//
    if (argc != 3) {
        ERROR_LOG("Arguments error! Must have 3 arguments!");
        exit(1);
    }
    const std::string JUDGE_FILE_DIR = "E:/programing/caps/caps-problem-solving-backend/JUDGE/";
    int ans_fd, user_fd;
    if (FastIO::fileOpen(ans_fd, (JUDGE_FILE_DIR + args[1]).c_str()) == -1) {
        ERROR_LOG("Failed open Answer File");
        exit(1);
    }
    if (FastIO::fileOpen(user_fd, (JUDGE_FILE_DIR + args[2]).c_str()) == -1) {
        ERROR_LOG("Failed open User File");
        exit(1);
    }
    //------------------------ End Preprocessing -----------------------//
    FastIO ans_io(ans_fd), user_id(user_fd);
    //------------------------ Start Judging ---------------------------//
    //
    //------------------------ End Judging -----------------------------//
    close(ans_fd);
    close(user_fd);
    return 0;
}