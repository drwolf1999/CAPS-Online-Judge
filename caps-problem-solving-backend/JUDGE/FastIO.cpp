#include "FastIO.h"

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
    ssize_t prev = __buffer__ + M_SIZE - __ptr__;

    if (prev > 0) {
        memcpy(__buffer__, __ptr__, prev);
    } else {
        prev = 0;
    }

    __buffer_length__ = read(__file__descriptor__, __buffer__ + prev, M_SIZE - prev) + prev;
    __ptr__ = __buffer__;

    __buffer__[__buffer_length__] = 0;

    if (__buffer_length__ < M_SIZE) __file__finish__ = true;
}

#pragma mark - Ending Check

bool FastIO::isFileFinish() { return __file__finish__; };
bool FastIO::isFinish() { return __finish__; };

#pragma mark - Process Line

bool FastIO::__parseLine__(char *&ptr) {
    register char ch;

    do {
        ch = *ptr;
        if (ch == 0) return false;
        ++ptr;
    } while (ch != '\n' && ch != 0);

    return true;
}

bool FastIO::getLine() {
    register char *str;
    return getLine(str);
}

bool FastIO::getLine(char *&line) {
    char * begin = __ptr__;
    char * end = __ptr__;
    size_t size;

    if (__parseLine__(end)) return false;

    if (end >= __buffer__ + __buffer_length__ + 1) {
        if (__file__finish__) {
            __finish__ = true;
            return false;
        }

        __readToBuffer__();
        return getLine(line);
    }

    size = end - begin - 1;

    line = new char[size];
    memcpy(line, begin, size);
    line[size] = 0;

    __ptr__ = end;

    return true;
}