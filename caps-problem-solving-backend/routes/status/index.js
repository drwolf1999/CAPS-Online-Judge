const router = require('express').Router();
const controller = require('../../controllers/StatusController');

router.get('/all/:page', controller.All);
router.get('/get/:statusNumber', controller.Get);
router.post('/create', controller.Create);

module.exports = router;
