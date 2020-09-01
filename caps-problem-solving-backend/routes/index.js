const express = require('express');
const router = express.Router();

const problemRouter = require('./problem');
const statusRouter = require('./status');
const authRouter = require('./auth');
const judgeRouter = require('./forJudge');
const fileRouter = require('./files');

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('init');
    return res.status(200).json({
        title: 'hi'
    });
});

router.use('/problem', problemRouter);
router.use('/status', statusRouter);
router.use('/auth', authRouter);
router.use('/for/judgement/secure', judgeRouter);

const LocalStorage = require('../middleware/files/FileManger');
const path = require('path');
const { UPLOAD_DIR } = require('../constants/Path');
router.use('/storage', fileRouter([
        new LocalStorage(path.resolve(UPLOAD_DIR, "./"))
    ],
    {
        uploadPath: path.resolve(UPLOAD_DIR, "./upload")
    }));

module.exports = router;
