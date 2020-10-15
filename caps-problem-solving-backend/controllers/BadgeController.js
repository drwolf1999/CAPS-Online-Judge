const {ShellHelper} = require('../middleware/Utility');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');

const BadgeController = {
    All: async (req, res, next) => { // return all Badge
        try {
            const badges = await Badge.getAllBadges();
            return res.status(200).json({
                Badge: badges,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'error',
            });
        }
    },
    Create: async (req, res, next) => { // new Badge
        try {
            let badge = new Badge({
                name: req.body.name,
                global: req.body.global !== undefined && req.body.global !== null ? req.body.global : true,
            });
            badge = await badge.save();
            return res.status(201).json({
                Badge: badge,
                message: 'success create',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'error',
            });
        }
    },
    GetByUser: async (req, res, next) => { // get Badge by User
        try {
            let userBadges = await UserBadge.find({
                username: req.params.username,
            })
                .sort('-badgeNumber')
                .populate('badge')
                .select('-username -_id -id -__v -active');
            let badge = [];
            for (let i = userBadges.length - 1; i >= 0; i--) {
                badge.push({
                    name: userBadges[i].badge.name,
                    number: userBadges[i].badge.number,
                    global: userBadges[i].badge.global,
                });
            }
            return res.status(200).json({
                Badge: badge,
                message: 'success create',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'error',
            });
        }
    },
    Add: async (req, res, next) => {
        try {
            let userBadge = await UserBadge.findOne({
                username: req.body.username,
                badgeNumber: req.body.badgeNumber,
            });
            if (!userBadge) {
                userBadge = new UserBadge({
                    username: req.body.username,
                    badgeNumber: req.body.badgeNumber,
                    active: true,
                });
            } else if (!userBadge.active) {
                userBadge.active = true;
            }
            userBadge = await userBadge.save();
            return res.status(201).json({
                userBadge: userBadge,
                message: 'success',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'error',
            });
        }
    },
};

module.exports = BadgeController;