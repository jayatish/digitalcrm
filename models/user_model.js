'use strict';

const _User = require('../db/mongo/schema').USER;

class UserModel {
    constructor() { }

    create(obj) {
        return new Promise((resolve, reject) => {
            let user = new _User(obj);
            user.save((err, doc) => err ? reject(err) : resolve(doc));
        });
    }

    read(query, options = {}) {
        (!options.projection) && (options.projection = {})

        if (options.multi) {
            return new Promise((resolve, reject) => {
                _User.find(query, options.projection)
                    .exec((err, doc) => err ? reject(err) : resolve(doc))
            });
        } else {
            return new Promise((resolve, reject) => {
                _User.findOne(query)
                    .exec((err, doc) => err ? reject(err) : resolve(doc))
            });
        }
    }

    readAdminUsers(query, options = {}) {
        return new Promise((resolve, reject) => {
            _User.aggregate([
                {
                    $lookup: {
                        from: "user_roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                }, {
                    $unwind: "$role"
                }, {
                    $match: {
                        "role.name": {
                            $ne: "NORMAL"
                        }
                    }
                }, {
                    $lookup: {
                        from: "languages",
                        localField: "lang",
                        foreignField: "_id",
                        as: "lang"
                    }
                }, {
                    $unwind: "$lang"
                }
            ])
                .exec((err, doc) => err ? reject(err) : resolve(doc))
        });
    }

    readAdmin(query, options = {}) {
        return new Promise((resolve, reject) => {
            _User.aggregate([
                {
                    $lookup: {
                        from: "user_roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                }, {
                    $unwind: "$role"
                }, {
                    $match: {
                        "role.name": {
                            $eq: "SUPERADMIN"
                        }
                    }
                }, {
                    $lookup: {
                        from: "languages",
                        localField: "lang",
                        foreignField: "_id",
                        as: "lang"
                    }
                }, {
                    $unwind: "$lang"
                }
            ])
                .exec((err, doc) => err ? reject(err) : resolve(doc))
        });
    }

    readPartner(query, options = {}) {
        return new Promise((resolve, reject) => {
            _User.aggregate([
                {
                    $lookup: {
                        from: "user_roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                }, {
                    $unwind: "$role"
                }, {
                    $match: {
                        "role.name": {
                            $eq: "PARTNER"
                        }
                    }
                }, {
                    $lookup: {
                        from: "languages",
                        localField: "lang",
                        foreignField: "_id",
                        as: "lang"
                    }
                }, {
                    $unwind: "$lang"
                }
            ])
                .exec((err, doc) => err ? reject(err) : resolve(doc))
        });
    }

    readCustomers(query, options = {}) {
        return new Promise((resolve, reject) => {
            _User.aggregate([
                {
                    $lookup: {
                        from: "user_roles",
                        localField: "role",
                        foreignField: "_id",
                        as: "role"
                    }
                }, {
                    $unwind: "$role"
                }, {
                    $match: {
                        "role.name": {
                            $eq: "NORMAL"
                        }
                    }
                }, {
                    $lookup: {
                        from: "languages",
                        localField: "lang",
                        foreignField: "_id",
                        as: "lang"
                    }
                }, {
                    $unwind: "$lang"
                }
            ])
                .exec((err, doc) => err ? reject(err) : resolve(doc))
        });
    }

    update(query, setData, incrementData = {}, options = {}) {
        let updateInfo = {};

        updateInfo.$set = setData;

        if (Object.keys(incrementData).length) {
            updateInfo.$inc = incrementData;
            options.strict = false;
        }

        return new Promise((resolve, reject) => {
            _User.update(query, updateInfo, options)
                .exec((err, doc) => err ? reject(err) : resolve(doc))
        });
    }

    delete(query) {
        return new Promise((resolve, reject) => {
            _User.remove(query, (err, doc) => err ? reject(err) : resolve(doc))
        });
    }
}

module.exports = UserModel;