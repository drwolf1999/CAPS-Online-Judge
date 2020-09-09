const router = require('express').Router();
const {isLoginSession} = require('../../middleware/passport/auth');
const controller = require('../../controllers/ProblemController');

router.get('/count', isLoginSession, controller.Count);
router.get('/all', isLoginSession, controller.All);
router.get('/get/:problemNumber', isLoginSession, controller.Get);
router.post('/create', isLoginSession, controller.Create);
router.post('/update/:problemNumber', isLoginSession, controller.Update);
// router.post('/testcase/:problemNumber', controller.ForTestCase);

module.exports = router;
