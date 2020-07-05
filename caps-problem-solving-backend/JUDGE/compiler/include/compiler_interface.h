#ifndef __COMPILER__INTERFACE__
#define __COMPILER__INTERFACE__
#include <string>
#include <vector>
#include "utility.h"
#define __WINDOW__SYSTEM__ // If this file is in Windows system, release the comment.
#ifdef __WINDOW__SYSTEM__
#include <windows.h>
#define sleep Sleep
#define TOSECONDS 1000
#else
#include <unistd.h>
#define TOSECONDS 1
#endif // __WINDOW__SYSTEM__
class COMPILER {
public:
    virtual void DoCompile() = 0;
    virtual void GetInputOutputFiles() = 0;
    virtual void DoRun() = 0;
    virtual void GetResult() = 0;
protected:
    void SetTarget(const std::string &target) {
        TARGET = target;
    }
    void SetExecutableFile(const std::string &executableFile) {
        EXECUTABLE_FILE = executableFile;
    }
    void SetTarget(const char *target) {
        TARGET = target;
    }
    void SetExecutableFile(const char *executableFile) {
        EXECUTABLE_FILE = executableFile;
    }
    static const std::string DIR;                           // DIR directory Path
    static const std::string RUN;                           // Run directory Path (+DIR)    run code path
    static const std::string DATA;                          // Data Directory Path (+DIR)   path of answer input output
    std::vector<std::string> inputs, outputs;  // Input Output files (answer)
private:
    std::string TARGET;                                     // Target Name
    std::string EXECUTABLE_FILE;                            // Executable File Name
};

const std::string COMPILER::DIR = "E:/programing/caps/caps-problem-solving-backend/JUDGE/";
const std::string COMPILER::RUN = "run/";
const std::string COMPILER::DATA = "data/";
#endif // !__COMPILER__INTERFACE__