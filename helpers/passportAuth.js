'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = new (require('../models').USER)();

module.exports.init = () => {
    passport.use('userAuth', new LocalStrategy((username, password, done) => {
        console.log('username ==> ', username);
        console.log('password ==> ', password);
        User.read({ email: username })
            .then(user => {
                return (user) ? (user.comparePassword(password)) ? done(null, user)
                    : done(null, false, { message: "Invalid Password" })
                    : done(null, false, { message: "Invalid Email" });
            })
            .catch(err => { 
                console.log('err data ===> ', err);
                return done(err); 
            })
    }))
};

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     User.read({ "_id": id })
//         .then(user => {
//             // console.log("pasport deserialize", user);
//             done(null, user);
//         })
//         .catch(done)
// });