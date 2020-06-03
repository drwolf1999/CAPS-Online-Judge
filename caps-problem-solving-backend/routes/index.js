const express = require('express');
const router = express.Router();

const problemRouter = require('./problem');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/problem', problemRouter);

module.exports = router;
