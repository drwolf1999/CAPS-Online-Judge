const express = require('express');
const router = express.Router();

const problemRouter = require('./problem');
const statusRouter = require('./status');
const authRouter = require('./auth');
const judgeRouter = require('./forJudge');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('init');
    return res.status(200).json({
        title: 'hi'
    });
});

router.use('/problem', problemRouter);
router.use('/status', statusRouter);
router.use('/auth', authRouter);
router.use('/for/judgement/secure', judgeRouter);

module.exports = router;
