const passport = require('passport');
const LayoutArg = {layout: 'auth/layout'};
const Auth = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Secret = require('../middleware/Secret.js');
const AuthController = {
    Login: (req, res, next) => {
        Auth.find({})
            .exec()
            .then(function (data) {
                res.render('auth/login', LayoutArg);
            });
        next();
    },
    DoLogin: (req, res, next) => {
        console.log(req.body.username + ' ' + req.body.password);
        Auth.findOne({username: req.body.username})
            .exec()
            .then(user => {
                console.log(JSON.stringify(user));
                if (!user) {
                    return res.status(401).json({
                        message: 'Auth Failed',
                    });
                }
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) {
                        return res.status(401).json({
                            message: 'Auth Failed',
                        });
                    }
                    if (result) {
                        const token = jwt.sign({username: user.username, user__id: user._id}, Secret.JWT_TOKEN, {expiresIn: "1h"});
                        return res.status(200)
                            .header('Access-Token', token)
                            .json({
                                message: 'Auth Successful',
                            });
                    }
                    return res.status(401).json({
                        message: 'Auth Failed',
                    });
                });
            });
    },
    Logout: (req, res, next) => {
        req.logout();
        req.flash('logout success!!');
        res.redirect('/auth/login');
        next();
    },
    Register: (req, res, next) => {
        res.render('auth/register', LayoutArg);
        next();
    },
    DoRegister: (req, res, next) => {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(req.body.password, salt, (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        hash: hash,
                        message: 'Hash Error',
                        error: error,
                    });
                } else {
                    let auth = new Auth({
                        username: req.body.username,
                        password: hash,
                    });
                    auth.save()
                        .then(user => {
                            return res.status(201).json({
                                message: 'Created user successfully',
                                createdUser: user,
                            });
                        })
                        .catch(error => {
                            return res.status(500).json({
                                error: error,
                            });
                        });
                }
            })
        });
    },
};

module.exports = AuthController;