const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const User = require('./models/user')
const config = require('./config')

passport.use(
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'passHash'
    },
    function (username, passHash, callback) {

        return User.findOne({username, passHash})
            .then(user => {
                if (!user) {
                    return callback(null, false, {ok: false, message: 'incorrect_username_or_password'});
                }

                return callback(null, user, {
                    ok: true,
                    message: 'logged_in_successfully'
                });
            })
            .catch(err => {
                return callback(err);
            });
    }
));

passport.use(new JWTStrategy(
    {
        jwtFromRequest   : ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey      : config.JWT_SECRET,
        passReqToCallback: true
    },
    function (req, jwtPayload, callback) {
        return User._getById(jwtPayload.id, (user, err) => {
            if (err) return callback(err)
            if (user) {
                //req.user = user;
                return callback(null, user);
            }
            return callback(null, false);
        });
    }
));

const errToStatus = {
    'No auth token': 401,
    'Unauthorized': 401,
    'invalid signature': 401
}

const errToMessage = {
    'No auth token': 'no_session_try_to_sign_in_again',
    'Unauthorized': 'lol',
    'invalid signature': 'no_session_try_to_sign_in_again'
}

function isAdmin (req, res, next) {
    if (req.user.role != 1) { // checking undefined == 1 is also fine
        return res.status(403).json({ ok: false, message: 'action_unallowed' });
    }
    next()
}

function normalizeError (err) {
    console.log({err})
    if (Object.values(errToMessage).includes(err.message)) // if normalized
        return err
    const error = new Error()
    error.message = errToMessage[err.message] || 'unknown_error'
    error.status = errToStatus[err.message] || 500
    return error
}

module.exports = { isAdmin, normalizeError }