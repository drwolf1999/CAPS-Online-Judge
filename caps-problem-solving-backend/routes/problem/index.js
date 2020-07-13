const router = require('express').Router();
const controller = require('../../controllers/ProblemController');

router.get('/count', controller.Count);
router.get('/all', controller.All);
router.get('/get/:problemNumber', controller.Get);
router.post('/create', controller.Create);

module.exports = router;
