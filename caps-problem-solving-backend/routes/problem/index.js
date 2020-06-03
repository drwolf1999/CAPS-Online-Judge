const router = require('express').Router();
const controller = require('../../controllers/ProblemController');

router.use('/count', controller.Count);
router.use('/all', controller.All);

module.exports = router;
