'use strict';

const mongoose = require('mongoose');
const model = require('../../../configs').model;
const ModelHelper = require('../../../helpers').modelHelper;

const companySchema = new mongoose.Schema({
    company_name: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    email: {
        type: String
    },
    contact_no: {
        type: String
    },
    address: {
        type: String
    },
    website: {
        type: String
    },
    status: {
        type: Number,
        default: 0 // 0 = Active, 1 = Inactive
    },
    image: {
        type: String,
        default: ''
    }
}, { versionKey: false, timestamps: true });

// companySchema.virtual('products', {
//     ref: ModelHelper.getModelName(model.COLLECTION_PRODUCT),
//     localField: '_id',
//     foreignField: 'collection_id',
//     justOne: false // set true for one-to-one relationship
// });

// companySchema.set('toJSON', { getters: true, virtuals: true })
// companySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model(ModelHelper.getModelName(model.COMPANY), companySchema);