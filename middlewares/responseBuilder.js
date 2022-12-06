'use strict';

const langs = require('../language');

module.exports = (req, res, next) => {
    res.body = {
        data: {},
        message: "",
        errors: {}
    };
    res.response = (response, lang) => {
        response.success = Object.keys(response.errors).length ? false : true;
        let message = langs[req.query.lang || 'en-us'][response.success ? 'success' : 'errors'][response.message || 'CUSTOM MESSAGE'];
        // print("Message: ", response.message);
        // print("req.originalUrl: ", req.originalUrl);
        try {
            response.message = message.message;
            response.statusCode = message.code || 200;
        } catch (err) {
            response.statusCode = req.originalUrl.startsWith('/api') ? 200 : 500;
        }
        // (response.statusCode === 500) ? res.redirect('/404') : res.status(response.statusCode).send(response);
        (response.statusCode === 500) ? res.render('admin/error') : res.status(response.statusCode).send(response);
    };
    next();
}