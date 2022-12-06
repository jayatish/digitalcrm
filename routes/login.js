'use strict';

const router = require('express').Router();
const passport = require('passport');

const {
    ADMINAUTH: adminauth
} = require('../controllers')


router.get('/', adminauth.renderLogin)
router.post('/login', adminauth.postLogin)

// router.post('/login', passport.authenticate('userAuth', {
//     failureRedirect: '/',
//     failureFlash: true
// }), function (req, res, next) {
//     let redirectTo = req.session.redirectTo || '/dashboard';
//     delete req.session.redirectTo;
//     // is authenticated ?
//     res.redirect(redirectTo);
//     // res.redirect('/dashboard');
// });

// router.get('/logout', (req, res, next) => {
//     if (req.isAuthenticated()) {
//         req.logout();
//     }
//     res.redirect('/');
// });;

// router.get('/', (req, res, next) => {
//     if (!req.isAuthenticated())
//         next();
//     else {
//         let redirectTo = req.session.redirectTo || '/dashboard';
//         delete req.session.redirectTo;
//         // is authenticated ?
//         res.redirect(redirectTo);
//     }
//     // res.redirect('/dashboard');
// }, (req, res, next) => {
//     res.render('login');
// });

module.exports = router;