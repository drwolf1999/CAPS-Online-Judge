const router = require('express').Router();
const controller = require('../../controllers/StatusController');

router.get('/maxNumber', controller.MaxNumber);
router.get('/all/:top', controller.All);
router.get('/get/:submitNumber', controller.Get);
router.post('/create', controller.Create);
router.post('/rejudge', controller.Rejudging);

module.exports = router;
