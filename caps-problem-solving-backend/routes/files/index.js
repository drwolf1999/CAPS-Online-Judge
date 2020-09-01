const router = require('express').Router(),
    multer = require('multer');

module.exports = function (storages, options = {}) {
    let uploadPath = options.uploadPath || require("os").tmpdir();
    for (let storage of storages) {

        // `list` endpoint
        router.get(`/${storage.code}/:problemNumber/list`, async function (req, res) {
            let result = await storage.list(req.query.path, req.params.problemNumber);
            return res.json(result);
        });

        // `upload` endpoint
        router.post(`/${storage.code}/:problemNumber/upload`, multer({ dest: uploadPath }).array("files"), async function (req, res) {
            await storage.upload(req.query.path, req.files, req.params.problemNumber);
            return res.sendStatus(200);
        });

        // `mkdir` endpoint
        router.post(`/${storage.code}/:problemNumber/mkdir`, async function (req, res) {
            await storage.mkdir(req.query.path, req.params.problemNumber);
            return res.sendStatus(200);
        });

        // `delete` endpoint
        router.post(`/${storage.code}/:problemNumber/delete`, async function (req, res) {
            await storage.delete(req.query.path, req.params.problemNumber);
            return res.sendStatus(200);
        });
    }
    return router;
}