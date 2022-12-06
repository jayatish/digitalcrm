'use strict';

const langs = require('../language');

process.on('uncaugthException', (err) => {
    if (err) {
        logger.log('error', 'Unhandled Error', {
            errorName: err.name,
            errorStack: err.stack
        });
    }
});

/**
 * This function handles all the express errors
 * example: next(err)
 * where err = {
 *              name/mainMsg/msg: 'ERROR_MESSAGE',
 *         ---- errors: {
 *        |              errorType: {
 *    or -|                           message: 'SPECIFIC_ERROR_MESSAGE'   
 *        |                         }
 *        |             }
 *         ---- err: errorType
 *             }
 */
module.exports = (err, req, res, next) => {
    if (err) {
        print(err);
        print(err.stackTrace);
        res.body.message = err.mainMsg || err.name || err.msg || 'CUSTOM_MESSAGE';
        res.body.errors = err.errors || err.err || err.details;
        try {
            if (typeof res.body.errors === 'object') {
                Object.keys(JSON.parse(JSON.stringify(res.body.errors))).forEach((e) => {
                    if (typeof res.body.errors[e] === 'object') {
                        let temp = JSON.parse(JSON.stringify(res.body.errors[e]));
                        res.body.errors[e] = {};
                        res.body.errors[e].message = (langs[req.query.lang || 'en-us']["errors"][temp.message] || temp).message;
                    } else {
                        let temp = res.body.errors[e];
                        res.body.errors[e] = {};
                        let msg = (langs[req.query.lang || 'en-us']["errors"][err.msg]);
                        msg = msg ? msg : langs[req.query.lang || 'en-us']["errors"]['CUSTOM_MESSAGE'];
                        res.body.errors[e].message = msg.message;
                    }
                });
            } else {
                let temp = res.body.errors;
                res.body.errors = {};
                res.body.errors[temp] = {};
                let msg = (langs[req.query.lang || 'en-us']["errors"][err.msg]);
                msg = msg ? msg : langs[req.query.lang || 'en-us']["errors"]['CUSTOM_MESSAGE'];
                res.body.errors[temp].message = msg.message;
            }
            process.nextTick(function () {
                res.response(res.body);
            });
        } catch (exception) {
            res.body.message = 'INTERNAL_ERROR';
            res.body.errors['internal'] = {};
            res.body.errors['internal'].message = langs[req.query.lang || 'en-us']["errors"]['INTERNAL_ERROR'].message;
            res.response(res.body);
            logger.log('error', 'Un Handled Error', {
                errorName: err.name,
                errorStack: err.stack
            });
        }
    }
    next();
}