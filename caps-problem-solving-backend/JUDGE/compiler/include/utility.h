#ifndef __UTILITY__
#define __UTILITY__
#include <string>
#include <vector>
#include <io.h>
#include <algorithm>
#include <sys/stat.h>
class Utility {
    public:
    static void ConnectStringList(std::string &to, const std::vector<std::string> &list) {
        using namespace std;
        for (size_t i = 0; i < list.size(); i++) {
            to += list[i];
            if (i + 1 != list.size()) to += " ";
        }
    }

    static std::vector<std::string> GetFilesByDirectory(const std::string &dir, const char * extension) {
        using namespace std;
        vector<string> ret;
        string path = dir + extension;
        struct _finddata_t fd;
        intptr_t handle;
        if ((handle = _findfirst(path.c_str(), &fd)) == -1L) {
            return ret;
        }

        do {
            ret.push_back(dir + fd.name);
        } while (_findnext(handle, &fd) == 0);
        _findclose(handle);
        sort(ret.begin(), ret.end());
        return ret;
    }

    static bool FileExist(const std::string& name) {
        struct stat buffer;
        return stat(name.c_str(), &buffer) == 0;
    }
};
#endif // __UTILITY__