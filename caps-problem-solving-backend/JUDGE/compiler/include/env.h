#ifndef __ENV__
#define __ENV__
/**
 * +-------------------+
 * |      Setting      |
 * |  Window or Unix   |
 * +-------------------+
*/
// #define __WINDOW__SYSTEM__ // If this file is in Windows system, release the comment.
#ifdef __WINDOW__SYSTEM__
#include <windows.h>
#define sleep Sleep
#define TOSECONDS 1000
#else
#include <unistd.h>
#define TOSECONDS 1
#endif // __WINDOW__SYSTEM__
/**
 * +-------------------+
 * |      Default      |
 * |      Include      |
 * +-------------------+
*/
#include <assert.h>
#include <vector>
#include <string>
#include <algorithm>

#define __DEBUG__MODE__
#ifdef __DEBUG__MODE__
#include <iostream>
#endif
#endif