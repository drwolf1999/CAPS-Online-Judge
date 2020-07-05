#include "include/FastIO.h"

#include <unistd.h>
#include <memory.h>

#include <iostream>

#pragma mark - Constructor

FastIO::FastIO(int fileDescriptor) :
    __file__descriptor__(fileDescriptor),
    __ptr__(__buffer__ + M_SIZE),
    __buffer_length__(0),
    __file__finish__(false),
    __finish__(false) {
    __readToBuffer__();
}

FastIO::~FastIO() {
    //
}

#pragma mark - Buffer Handle

void FastIO::__readToBuffer__() {
    __buffer_length__ = read(__file__descriptor__, __buffer__, M_SIZE);
    __ptr__ = __buffer__;

    __buffer__[__buffer_length__] = 0;

    if (__buffer_length__ < M_SIZE) __file__finish__ = true;
}

#pragma mark - Ending Check

bool FastIO::isFileFinish() { return __file__finish__; };
bool FastIO::isFinish() { return __finish__; };

bool FastIO::getChar(char &ch) {
    if (*__ptr__ == 0) {
        __readToBuffer__();
        if (*__ptr__ == 0) return false;
    }
    ch = *__ptr__;
    ++__ptr__;
    return true;
}