const router = require('express').Router();
const controller = require('../../controllers/StandingController');

router.get('/all', controller.All);
router.get('/get/:username', controller.Get);

module.exports = router;
