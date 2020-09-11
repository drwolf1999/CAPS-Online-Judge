const router = require('express').Router(),
    multer = require('multer');
const {isLoginSession} = require('../../middleware/passport/auth');

module.exports = function (storages, options = {}) {
    let uploadPath = options.uploadPath || require("os").tmpdir();
    for (let storage of storages) {

        // `list` endpoint
        router.get(`/${storage.code}/:problemNumber/list`, isLoginSession, async function (req, res) {
            let result = await storage.list(req.query.path, req.params.problemNumber);
            return res.json(result);
        });

        // `upload` endpoint
        router.post(`/${storage.code}/:problemNumber/upload`, isLoginSession, multer({dest: uploadPath}).array("files"), async function (req, res) {
            await storage.upload(req.query.path, req.files, req.params.problemNumber);
            return res.sendStatus(200);
        });

        router.get(`/${storage.code}/:problemNumber/get`, isLoginSession, async function (req, res) {
            const result = await storage.getFilePartial(req.params.problemNumber, req.query.path, req.query.part);
            return res.json(result);
        });

        router.get(`/${storage.code}/:problemNumber/download`, isLoginSession, async function (req, res) {
            const result = await storage.getFile(req.params.problemNumber, req.query.path);
            res.setHeader('content-type', 'blob');
            console.log('get file');
            result.pipe(res);
        });

        // `mkdir` endpoint
        router.post(`/${storage.code}/:problemNumber/mkdir`, isLoginSession, async function (req, res) {
            await storage.mkdir(req.query.path, req.params.problemNumber);
            return res.sendStatus(200);
        });

        // `delete` endpoint
        router.post(`/${storage.code}/:problemNumber/delete`, isLoginSession, async function (req, res) {
            await storage.delete(req.query.path, req.params.problemNumber);
            return res.sendStatus(200);
        });
    }
    return router;
}