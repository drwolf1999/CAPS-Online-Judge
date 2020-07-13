#ifndef __COMPILER__INTERFACE__
#define __COMPILER__INTERFACE__
#include "utility.h"
#include "env.h"
#include "judger.h"
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
    std::string &GetTarget() { return TARGET; }
    std::string &GetExecutableFile() { return EXECUTABLE_FILE; }
    const std::string DIR = "/home/doyeop/CAPS-problem-solving/caps-problem-solving-backend/JUDGE/";        // DIR directory Path
    const std::string RUN = "run/";                                                                         // Run directory Path (+DIR)    run code path
    const std::string DATA = "data/";                                                                       // Data Directory Path (+DIR)   path of answer input output
    const std::string LOGGER = "log/";                                                                      // Log Directory Path (+DIR)    path of log files
    std::vector<std::string> inputs, outputs;                                                               // Input Output files (answer)
private:
    std::string TARGET;                                                                                     // Target Name
    std::string EXECUTABLE_FILE;                                                                            // Executable File Name
};

#endif // !__COMPILER__INTERFACE__