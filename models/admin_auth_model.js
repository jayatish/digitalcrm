'use strict';

const model = require('../configs').model;
const ModelHelper = require('../helpers').modelHelper;
const _User = require('../db/mongo/schema').USER;

class AdminAuthModel {
    constructor() { }

    signIn(obj) {
        return new Promise((resolve, reject) => {
            _User.findOne({
                email: obj.email
            }).exec((err, result) => {
                if(err) {
                    return reject({
                        status: false,
                        message: 'Database Error'
                    })
                } else {
                    if(result) {
                        if(result.comparePassword(obj.password)) {
                            return resolve({
                                status: true,
                                message: 'Login successful',
                                data: result
                            })
                        } else {
                            return resolve({
                                status: false,
                                message: 'Password mismatch'
                            })
                        }
                    } else {
                        return resolve({
                            status: false,
                            message: 'Email does not exist'
                        })
                    }
                        
                }
            })
        })
    }
}
module.exports = new AdminAuthModel();