#ifndef __Fast_IO__
#define __Fast_IO__

#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <fcntl.h>
#define WINDOW // If this file is on the server, comment this line
#ifdef WINDOW
#ifndef ssize_t
#define ssize_t unsigned int
#endif // !ssize_t
#endif // WINDOW

class FastIO {
    enum { M_SIZE = 4096 };             // BUFFER SIZE

    int __file__descriptor__;
    char __buffer__[M_SIZE];
    char __stop__;                      // If the buffer is full, the NULL to stop reading goes here
    char *__ptr__;                      // Pointer to next byte in buffer to read
    ssize_t __buffer_length__;          // Length of data in buffer
    bool __file__finish__;
    bool __finish__;

    void __readToBuffer__();
    bool __parseLine__(char *&ptr);

public:
    FastIO(int fileDescriptor);
    FastIO(const char * filePath);
    ~FastIO();

    bool isFileFinish();
    bool isFinish();

    bool getLine();
    bool getLine(char *&line);

    static int fileOpen(int &fileDescription, const char * fileNameWithPath) {
        return fileDescription = open(fileNameWithPath, O_RDONLY);
    }
};

#endif // !__Fast_IO__