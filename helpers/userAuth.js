'use strict';

const user = new (require('../models').USER)();

module.exports.frontEndUserLoginAuth = (loginDetails) => {
    return new Promise((resolve, reject) => {
        user.read({ email: loginDetails.email })
            .then(doc => {
                return doc ? !doc.active ?
                    Promise.reject({
                        err: "USER_NOT_ACTIVATED",
                        msg: "USER_NOT_ACTIVATED"
                    }) : Promise.resolve(doc) : Promise.reject({
                        err: "INVALID_LOGIN",
                        msg: "INVALID_LOGIN"
                    })
            })
            .then(doc => {
                return doc.comparePassword(loginDetails.password) ? doc : false;
            })
            .then(response => {
                // print("Response: ", response);
                return response ? resolve(response) :
                    Promise.reject({
                        err: "INVALID_LOGIN",
                        msg: "INVALID_LOGIN"
                    })
            })
            .catch(reject)
    });
}