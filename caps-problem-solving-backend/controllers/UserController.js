const passport = require('passport');
const LayoutArg = {layout: 'auth/layout'};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Secret = require('../middleware/Secret.js');
const fs = require('fs');

const UserController = {
    Login: (req, res, next) => {
        User.find({})
            .exec()
            .then(function (data) {
                res.render('auth/login', LayoutArg);
            });
        next();
    },
    DoLogin: (req, res, next) => {
        console.log(req.body.username + ' ' + req.body.password);
        User.findOne({username: req.body.username})
            .exec()
            .then(user => {
                // console.log(JSON.stringify(user));
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
                        const token = jwt.sign({username: user.username, permission: user.permission}, Secret.JWT_TOKEN, {expiresIn: "6h"});
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
                    console.log(error);
                    return res.status(500).json({
                        hash: hash,
                        message: 'Hash Error',
                        error: error,
                    });
                } else {
                    let user = new User({
                        username: req.body.username,
                        password: hash,
                        realName: req.body.realName,
                        grade: req.body.grade,
                    });
                    user.save()
                        .then(user => {
                            // console.log(user);
                            return res.status(201).json({
                                message: 'Created user successfully',
                                createdUser: user,
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            return res.status(500).json({
                                error: error,
                            });
                        });
                }
            })
        });
    },
    Profile: async (req, res, next) => {
        try {
            const Profile = await User.findOne({username: req.params.username})
                .select('-password -profile_url -profile_type -__v -_id -id');
            return res.status(200).json({
                Profile: Profile,
                find: Profile !== null,
                message: 'success',
            })
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'fail..',
            });
        }
    },
    ProfileUpdate: async (req, res, next) => {
        try {
            let Profile = await User.findOne({username: req.userData.username});
            if (!Profile) {
                return res.status(404).json({
                    message: 'not found',
                });
            }
            Profile.permission = req.body.permission;
            Profile.statusMessage = req.body.statusMessage;
            if (req.files.length > 0) {
                Profile.profile_url = req.files[0].path;
                Profile.profile_type = req.files[0].mimetype;
            }
            await Profile.save();
            Profile = await User.findOne({username: req.userData.username})
                .select('-password -profile_url -profile_type -__v -_id -id');
            return res.status(201).json({
                Profile: Profile,
                message: 'success',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'fail...',
            });
        }
    },
    ProfileImage: async (req, res, next) => {
        try {
            let Profile = await User.findOne({username: req.params.username})
                .select('-password');
            if (!Profile) {
                return res.status(404).json(null);
            }
            console.log(Profile.profile_url);
            if (!Profile.profile_url) {
                return res.status(204).json(null);
            }
            const img = fs.readFileSync(Profile.profile_url, 'base64');
            res.status(200);
            res.writeHead(200, {'Content-Type': Profile.profile_type});
            res.end(img, 'binary');
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'fail..',
            });
        }
    },
};

module.exports = UserController;