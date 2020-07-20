const router = require('express').Router();
const controller = require('../../controllers/AuthController');

router.get('/logout', controller.Logout);
router.post('/login', controller.DoLogin);
router.post('/register', controller.DoRegister);

module.exports = router;
