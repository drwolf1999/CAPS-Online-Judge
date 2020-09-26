const jwt = require('jsonwebtoken');
const Secret = require('../Secret.js');
module.exports = {
    isLoginSession: function (req, res, next) {
        try {
            next();
            const decode = jwt.verify(req.headers['access-token'], Secret.JWT_TOKEN);
            req.userData = decode;
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Auth Failed',
            });
        }
    }
};