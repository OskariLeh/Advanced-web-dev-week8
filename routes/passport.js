const passport = require('passport');
const path = require("path")
const mongoose = require("mongoose")
const User = require("../schemas/Users")

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
// This video was helpful here https://www.youtube.com/watch?v=Ne0tLHm1juE

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

const strategy = new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({_id: jwt_payload.id})
        .then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
    })
    .catch(err => done(err, null))
});

module.exports = (passport) => {
    passport.use(strategy)
}