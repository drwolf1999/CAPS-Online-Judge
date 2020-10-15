const router = require('express').Router();
const controller = require('../../controllers/UserController');
const multer = require('multer');
const path = require('path');
const { PROFILE_DIR } = require('../../constants/Path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PROFILE_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString());
    }
});

const fileFilter = (req, file, cb) => {
    // accept file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).array('image');

router.post('/update', upload, controller.ProfileUpdate);

router.get('/:username', controller.Profile);
router.get('/:username/image', controller.ProfileImage);

module.exports = router;
