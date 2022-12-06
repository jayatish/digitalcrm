'use strict';

const mongoose = require('mongoose');
const model = require('../../../configs').model;
const ModelHelper = require('../../../helpers').modelHelper;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.hash(user.password, 12, function (err, hash) {
            if (err) {
                next(err);
            } else {
                user.password = hash;
                next();
            }
        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (npassword) {
    // return new Promise((resolve, reject) => {
    return bcrypt.compareSync(npassword, this.password)
    // })
};

userSchema.set('toJSON', { getters: true, virtuals: true });
userSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model(ModelHelper.getModelName(model.USER), userSchema);