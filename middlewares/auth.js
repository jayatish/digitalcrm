'use strict';

module.exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM TO LOGIN PAGE
    req.session.redirectTo = req.originalUrl;
    res.redirect('/');
}

module.exports.isLoggedIn = function(req, res, next) {
    if(!req.headers.auth_token || req.headers.auth_token==='') {
        return res.json({
            'status': 0,
            'message': 'Parameters missing',
            'data': {}
        })
    } else {
        return next()
    }
}