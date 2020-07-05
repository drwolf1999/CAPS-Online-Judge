#include "include/cplusplus.h"

CPP_COMPILER::CPP_COMPILER() {
    SetTarget("Main.cpp");
    #ifdef __WINDOW__SYSTEM__
    SetExecutableFile("Main.exe");
    #else
    SetExecutableFile("Main.out");
    #endif // __WINDOW__SYSTEM__
}

CPP_COMPILER::~CPP_COMPILER() {
    //
}

#ifdef __WINDOW__SYSTEM__
void CPP_COMPILER::COMPILER::DoCompile() {
    using namespace std;
    vector<string> commandList = {
        "g++",                                                              // GCC
        COMPILER::TARGET,                                                   // Target file
        "-o",                                                               // Execute Mode
        COMPILER::EXECUTABLE_FILE,                                          // Execute file
        "-DNDEBUG -O2 -Wall -lm -static -std=g++14",                        // Compile Flag
    };
    string COMMAND;
    Utility::ConnectStringList(COMMAND, commandList);
    system(COMMAND.c_str());
    int cnt = 0;
    while (!Utility::FileExist(COMPILER::EXECUTABLE_FILE)) {
        cnt++;
        sleep(0.25 * TOSECONDS);
        if (cnt == 8) break; // 2 second --> error
    }
}

void CPP_COMPILER::COMPILER::GetInputOutputFiles() {
    inputs = Utility::GetFilesByDirectory(COMPILER::DIR, ".in");
    outputs = Utility::GetFilesByDirectory(COMPILER::DIR, ".out");
}

/*
Windows
Get-Content E:/programing/algorithm/file/input.txt | E:/programing/algorithm/main.exe > E:/programing/algorithm/file/output.txt
Linux
E:/programing/algorithm/main.exe > E:/programing/algorithm/file/output.txt < E:/programing/algorithm/file/input.txt
*/
void CPP_COMPILER::COMPILER::DoRun() {
    GetInputOutputFiles();
    bool flag = true;
    int i = 0, o = 0;
    while (1) ;
    system("");
}

void CPP_COMPILER::COMPILER::GetResult() {
    //
}
#else
void CPP_COMPILER::COMPILER::DoCompile() {
    //
}

void CPP_COMPILER::COMPILER::GetInputOutputFiles() {
    //
}

void CPP_COMPILER::COMPILER::DoRun() {
    //
}

void CPP_COMPILER::COMPILER::GetResult() {
    //
}
#endif // __WINDOW__SYSTEM__