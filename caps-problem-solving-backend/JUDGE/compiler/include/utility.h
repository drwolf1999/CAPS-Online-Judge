#ifndef __UTILITY__
#define __UTILITY__
#include <sys/io.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <dirent.h>
#include <error.h>
#include <iostream>
#include "env.h"

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
        #ifdef __WINDOW__SYSTEM__
        string path = dir + "*" + extension;
        struct _finddata_t fd;
        intptr_t handle;
        if ((handle = _findfirst(path.c_str(), &fd)) == -1L) {
            return ret;
        }

        do {
            ret.push_back(dir + fd.name);
        } while (_findnext(handle, &fd) == 0);
        _findclose(handle);
        #else
        string ext(extension);
        reverse(ext.begin(), ext.end());
        string path = dir;
        DIR *dirP;
        struct dirent *ent;
        dirP = opendir (path.c_str());
        if (dirP != NULL) {
    
        /* print all the files and directories within directory */
        while ((ent = readdir (dirP)) != NULL) {
            // printf ("%s\n", ent->d_name);
            string f_name(ent->d_name);
            reverse(f_name.begin(), f_name.end());
            bool flag = true;
            for (size_t i = 0; i < ext.size(); i++) flag &= (i < f_name.size() && ext[i] == f_name[i]);
            if (flag) ret.push_back(dir + ent->d_name);
        }
        closedir (dirP);
        } else {
            /* could not open directory */
            // perror ("");
            return ret;
        }
        sort(ret.begin(), ret.end());
        #endif
        return ret;
    }

    static bool FileExist(const std::string& name) {
        struct stat buffer;
        return stat(name.c_str(), &buffer) == 0;
    }
};
#endif // __UTILITY__