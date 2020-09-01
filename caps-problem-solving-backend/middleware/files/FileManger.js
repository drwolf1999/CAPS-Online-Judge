const os = require("os"),
    nodePath = require("path"),
    fsPromises = require("fs").promises,
    readdir = fsPromises.readdir,
    stat = fsPromises.stat,
    rename = fsPromises.rename,
    unlink = fsPromises.unlink,
    lstat = fsPromises.lstat,
    util = require("util"),
    rimraf = util.promisify(require("rimraf"));


class LocalStorage {
    constructor(root) {
        this.code = "local";
        if (root) {
            this.root = root;
        } else if (process.env.FILEBROWSER_LOCAL_ROOT_PATH) {
            this.root = nodePath.resolve(process.cwd(), process.env.FILEBROWSER_LOCAL_ROOT_PATH);
        } else {
            this.root = os.homedir();
        }
    }

    async list(path, dir) {
        try {
            let dirs = [],
                files = [];

            if (path[path.length - 1] !== "/") {
                path += "/";
            }
            console.log(this.root + '/' + dir + path);
            let items = await readdir(this.root + '/' + dir + path, { withFileTypes: true });

            for (let item of items) {
                let isFile = item.isFile(),
                    isDir = item.isDirectory();

                if (!isFile && !isDir) {
                    continue;
                }

                let result = {
                    type: isFile ? "file" : "dir",
                    path: path + item.name,
                };

                result.basename = result.name = nodePath.basename(result.path);

                if (isFile) {
                    let fileStat = await stat(this.root + '/' + dir + result.path);
                    result.size = fileStat.size;
                    result.extension = nodePath.extname(result.path).slice(1);
                    result.name = nodePath.basename(result.path, "." + result.extension);
                    files.push(result);
                } else {
                    result.path += "/";
                    dirs.push(result);
                }
            }

            return dirs.concat(files);
        } catch (err) {
            console.error(err);
        }
    }

    async upload(path, files, dir) {
        try {
            for (let file of files) {
                await rename(file.path, this.root + '/' + dir + path + file.originalname);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async mkdir(path, dir) {
        console.log(this.root + '/' + dir + path);
        await fsPromises.mkdir(this.root + '/' + dir + path, { recursive: true });
    }

    async delete(path, dir) {
        try {
            let stat = await lstat(this.root + '/' + dir + path),
                isDir = stat.isDirectory(),
                isFile = stat.isFile();

            if (isFile) {
                await unlink(this.root + '/' + dir + path);
            } else if (isDir) {
                await rimraf(this.root + '/' + dir + path);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = LocalStorage;