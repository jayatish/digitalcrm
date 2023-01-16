'use strict';

const model = require('../configs').model;
const ModelHelper = require('../helpers').modelHelper;
const _Company = require('../db/mongo/schema').COMPANY;
const _AccountManager = require('../db/mongo/schema').ACCOUNTMANAGER;
const uploadConfig = require('../configs/upload');
const fs = require('fs');

class CompanyModel {
    constructor() { }


    add(obj) {
        return new Promise((resolve, reject) => {
            let company_insert = new _Company(obj);
            company_insert.save((err, result) => {
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
            _Company.updateOne(query, whereCluase).exec((err, response) => {
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
            if(type == 'single') {
                _AccountManager.findOne({
                    company_id: whereCluase._id
                }).exec((err, result) => {
                    if(err) {
                        return reject({
                            status: false,
                            msg: 'Database error'
                        })
                    } else {
                        if(result) {
                            return resolve({
                                status: false,
                                msg: 'Account manager is already associated with this company.'
                            })
                        } else {
                            this.read(whereCluase, 'single').then(response => {
                                if(response.data.image!==''){
                                    fs.unlinkSync(uploadConfig.company + response.data.image);
                                }
                                _Company.deleteOne(whereCluase).exec((err, result) => {
                                    if(err) {
                                        return reject({
                                            status: false,
                                            msg: 'Database error'
                                        })
                                    } else {
                                        return resolve({
                                            status: true,
                                            msg: 'Data deleted successfully'
                                        })
                                    }
                                })
                            }).catch(error => {
                                return reject({
                                    status: false,
                                    msg: 'Database error'
                                })
                            })
                           
                        }
                    }
                })
            }
        })



        // return new Promise((resolve, reject) => {
        //     if (type == 'single') {
        //         _Client.deleteOne(whereCluase).exec((err, response) => {
        //             if (err) {
        //                 return reject({
        //                     status: 400,
        //                     msg: 'Database error'
        //                 });
        //             } else {
        //                 return resolve();
        //             }
        //         })
        //     } if (type == 'many') {
        //         _Client.deleteMany(whereCluase).exec((err, response) => {
        //             if (err) {
        //                 return reject({
        //                     status: 400,
        //                     msg: 'Database error'
        //                 });
        //             } else {
        //                 return resolve();
        //             }
        //         })
        //     }
        // })
    }

    check_existance(obj, type) {
        return new Promise((resolve, reject) => {
            _Company.findOne(obj).exec((err, response) => {
                if(err) {
                    return reject({
                        status: false,
                        msg: 'Database error'
                    })
                } else {
                    if(response) {
                        return resolve({
                            status: false,
                            msg: 'Email already exists'
                        })
                    } else {
                        return resolve({
                            status: true,
                            msg: 'Email is available'
                        })
                    }
                }
            })
            // if(type==='add') {
            //     _Company.findOne(obj).exec((err, response) => {
            //         if(err) {
            //             return reject({
            //                 status: false,
            //                 msg: 'Database error'
            //             })
            //         } else {
            //             if(response) {
            //                 return resolve({
            //                     status: false,
            //                     msg: 'Email already exists'
            //                 })
            //             } else {
            //                 return resolve({
            //                     status: true,
            //                     msg: 'Email is available'
            //                 })
            //             }
            //         }
            //     })
            // } if(type==='edit') {
            //     _Client.find(obj).exec((err, response) => {
            //         if(err) {
            //             return reject({
            //                 status: 400,
            //                 msg: 'Database error'
            //             })
            //         } else {
            //             if(response.length>0) {
            //                 return reject({
            //                     status: 400,
            //                     msg: 'Email already exists'
            //                 })
            //             } else {
            //                 return resolve({
            //                     status: 200,
            //                     msg: 'Email is available'
            //                 })
            //             }
            //         }
            //     })
            // }
        })
    }

    read(whereClause, type = 'single') {
        return new Promise((resolve, reject) => {
            if(type == 'single') {
                _Company.findOne(whereClause).exec((err, result) => {
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
                _Company.find(whereClause).exec((err, result) => {
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
                _Company.find({}).exec((err, result) => {
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
module.exports = new CompanyModel();