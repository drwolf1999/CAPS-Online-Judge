const router = require('express').Router();
const {isLoginSession} = require('../../middleware/passport/auth');
const controller = require('../../controllers/StatusController');

router.get('/maxNumber', isLoginSession, controller.MaxNumber);
router.get('/all/:top', isLoginSession, controller.All);
router.get('/get/:submitNumber', isLoginSession, controller.Get);
router.post('/create', isLoginSession, controller.Create);
router.post('/rejudge', isLoginSession, controller.Rejudging);

module.exports = router;
