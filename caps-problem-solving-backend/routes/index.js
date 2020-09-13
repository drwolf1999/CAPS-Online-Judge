const express = require('express');
const router = express.Router();
const {isLoginSession} = require('../middleware/passport/auth');

const authRouter = require('./auth');
const profile = require('./profile');
const problemRouter = require('./problem');
const statusRouter = require('./status');
const standingRouter = require('./standing');
const judgeRouter = require('./forJudge');
const fileRouter = require('./files');

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('init');
    return res.status(200).json({
        title: 'hi'
    });
});

router.use('/auth', authRouter);
router.use('/problem', isLoginSession, problemRouter);
router.use('/status', isLoginSession, statusRouter);
router.use('/standing', isLoginSession, standingRouter);
router.use('/profile', isLoginSession, profile);
router.use('/for/judgement/secure', judgeRouter);

const LocalStorage = require('../middleware/files/FileManger');
const path = require('path');
const {TC_DIR} = require('../constants/Path');
router.use('/storage', fileRouter([
        new LocalStorage(path.resolve(TC_DIR, "./"))
    ],
    {
        uploadPath: path.resolve(TC_DIR, "./upload")
    }));

module.exports = router;
