const express = require('express');
const router = express.Router();

const problemRouter = require('./problem');
const statusRouter = require('./status');
const authRouter = require('./auth');

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

module.exports = router;
