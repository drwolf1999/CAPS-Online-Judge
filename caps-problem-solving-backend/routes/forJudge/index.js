const router = require('express').Router();
const controller = require('../../controllers/StatusController');

router.get('/getInQueue', controller.GetInQueue);
router.post('/updateResult', controller.UpdateResult);

module.exports = router;