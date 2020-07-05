#ifndef __CPP__COMPILER__
#define __CPP__COMPILER__
#include "compiler_interface.h"
class CPP_COMPILER : public COMPILER {
public:
    CPP_COMPILER();
    ~CPP_COMPILER();
    void DoCompile();
    void GetInputOutputFiles();
    void DoRun();
    void GetResult();
};
#endif // !__CPP__COMPILER__