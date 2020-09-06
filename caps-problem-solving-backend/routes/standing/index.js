const router = require('express').Router();
const controller = require('../../controllers/StandingController');

router.get('/all', controller.All);

module.exports = router;
