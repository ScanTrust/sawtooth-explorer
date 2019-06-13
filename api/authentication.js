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

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : config.JWT_SECRET
    },
    function (jwtPayload, callback) {

        //find the user in db if needed
        return User._getById(jwtPayload.id, user => {
            return callback(null, (user, err) => {
                if (err)
                    return callback(err)
                return callback(null, user);
            });
        });
    }
));