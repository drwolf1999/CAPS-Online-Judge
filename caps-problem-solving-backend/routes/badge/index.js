const router = require('express').Router();
const controller = require('../../controllers/BadgeController.js');

router.get('/all', controller.All);
router.post('/create', controller.Create);
router.get('/user/get/:username', controller.GetByUser);
router.post('/user/add', controller.Add);

module.exports = router;
