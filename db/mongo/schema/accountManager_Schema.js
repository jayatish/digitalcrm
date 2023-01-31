'use strict';

const mongoose = require('mongoose');
const model = require('../../../configs').model;
const ModelHelper = require('../../../helpers').modelHelper;
const bcrypt = require('bcrypt');

const accountManagerSchema = new mongoose.Schema({
    accountmanager_name: {
        type: String,
    },
    email: {
        type: String
    },
    contact_no: {
        type: String
    },
    password: {
        type: String
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelHelper.getModelName(model.COMPANY)
    },
    image: {
        type: String
    },
    status: {
        type: Number,
        default: 0 // 0 = Active, 1 = Inactive
    },
    userType: {
        type: String,
        enum : ['AM','', '',''],
        default: 'AM'
    },
    is_active: {
        type: Number,
        default: 0 // 0 = Inactive, 1 = Active
    },
    slug: {
        type: String,
        ref: ModelHelper.getModelName(model.COMPANY)

    }
}, { versionKey: false, timestamps: true });

accountManagerSchema.pre('save', function (next) {
    var accountManager = this;

    if (accountManager.isModified('password')) {
        bcrypt.hash(accountManager.password, 12, function (err, hash) {
            if (err) {
                next(err);
            } else {
                accountManager.password = hash;
                next();
            }
        })
    } else {
        next();
    }
});
accountManagerSchema.methods.comparePassword = function (npassword) {
    // return new Promise((resolve, reject) => {
    return bcrypt.compareSync(npassword, this.password)
    // })
};
accountManagerSchema.virtual('company', {
    ref: ModelHelper.getModelName(model.COMPANY),
    localField: 'company_id',
    foreignField: '_id',
    justOne: true // set true for one-to-one relationship
});
accountManagerSchema.set('toJSON', { getters: true, virtuals: true });
accountManagerSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model(ModelHelper.getModelName(model.ACCOUNTMANAGER), accountManagerSchema);