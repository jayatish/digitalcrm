'use strict';

const model = require('../configs').model;
const ModelHelper = require('../helpers').modelHelper;
const _AccountManager = require('../db/mongo/schema').ACCOUNTMANAGER;
const axios = require('axios')

class AccountManagagerModel {
    constructor() { }


    add(obj) {
        return new Promise((resolve, reject) => {
            let accountManager_insert = new _AccountManager(obj);
            accountManager_insert.save((err, result) => {
                if(err) {
                    console.log('err ==> ', err);
                    return reject({
                        status: false,
                        msg: 'Database error'
                    })
                } else {
                    console.log('result ==> ', result);
                    return resolve({
                        status: true,
                        msg: 'Insert successfully',
                        result: result
                    })
                }
            })
        })
    }

    update(whereCluase, query) {
        return new Promise((resolve, reject) => {
            _AccountManager.updateOne(query, whereCluase).exec((err, response) => {
                if(err) {
                    return reject({
                        status: 400,
                        msg: 'Database error'
                    });
                } else {
                    return resolve({
                        status: true,
                        msg: 'Update successfully'
                    });
                }
            })
        })
    }

    delete(whereCluase, type = 'many') {
        return new Promise((resolve, reject) => {
            if (type == 'single') {
                _Client.deleteOne(whereCluase).exec((err, response) => {
                    if (err) {
                        return reject({
                            status: 400,
                            msg: 'Database error'
                        });
                    } else {
                        return resolve();
                    }
                })
            } if (type == 'many') {
                _Client.deleteMany(whereCluase).exec((err, response) => {
                    if (err) {
                        return reject({
                            status: 400,
                            msg: 'Database error'
                        });
                    } else {
                        return resolve();
                    }
                })
            }
        })
    }

    check_existance(obj, where, type) {
        return new Promise((resolve, reject) => {
            if(type==='add') {
                _Client.findOne(obj).exec((err, response) => {
                    if(err) {
                        return reject({
                            status: 400,
                            msg: 'Database error'
                        })
                    } else {
                        if(response) {
                            return reject({
                                status: 400,
                                msg: 'Email already exists'
                            })
                        } else {
                            return resolve({
                                status: 200,
                                msg: 'Email is available'
                            })
                        }
                    }
                })
            } if(type==='edit') {
                _Client.find(obj).exec((err, response) => {
                    if(err) {
                        return reject({
                            status: 400,
                            msg: 'Database error'
                        })
                    } else {
                        if(response.length>0) {
                            return reject({
                                status: 400,
                                msg: 'Email already exists'
                            })
                        } else {
                            return resolve({
                                status: 200,
                                msg: 'Email is available'
                            })
                        }
                    }
                })
            }
        })
    }

    read(whereClause, type = 'single') {
        return new Promise((resolve, reject) => {
            if(type == 'single') {
                _AccountManager.findOne(whereClause).exec((err, result) => {
                    if(err) {
                        return reject(err);
                    } else {
                        return resolve({
                            status: true,
                            data: result
                        });
                    }
                });
            } if(type == 'many') {
                _AccountManager.find(whereClause).exec((err, result) => {
                    if(err) {
                        return reject({
                            status: 400,
                            msg: 'Database error'
                        });
                    } else {
                        return resolve(result);
                    }
                })
            } if(type == 'list') {
                _AccountManager.find({}).exec((err, result) => {
                    if(err) {
                        return reject({
                            status: false,
                            message: "Database error"
                        })
                    } else {
                        return resolve({
                            status: true,
                            data: result
                        })
                    }
                })
            }
        })
    }
}
module.exports = new AccountManagagerModel();