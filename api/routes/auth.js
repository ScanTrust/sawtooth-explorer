const express  = require('express')
const router   = express.Router()
const jwt      = require('jsonwebtoken');
const passport = require('passport')
const { check, validationResult } = require('express-validator/check')

const User     = require('@root/models/user')
const config   = require('@root/config')
const { saltHashPassword } = require('@root/lib/common/hashing')

router.post(['/register', '/login'], [
    check('username').exists(),
    check('password').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next()
})

router.post('/register', function(req, res, next) {
    User._getLastId(lastId => {
        const { salt, passwordHash } = saltHashPassword(req.body.password)
        User._create({
            id: lastId + 1,
            username: req.body.username,
            passHash: passwordHash,
            salt,
        }, function (ok, err) {
            if (err)
                return res.status(400).json({ ok, message: err })
            return res.status(200).json({ ok, message: 'registration_successful' })
        })
    })
})

router.post('/login', function (req, res, next) {
    User._getByUsername(req.body.username, user => {
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'no_user_with_such_username'
            })
        }
        const { passwordHash } = saltHashPassword(req.body.password, user.salt)
        req.body.passHash = passwordHash
        req.body.password = null
        next()
    })
})

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                ok: false,
                message: info ? info.message : 'login_failed',
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET);
            return res.json({ok: true, token, username: user.username});
        });
    })(req, res);
})

module.exports = router