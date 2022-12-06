'use strict';

const appRoot = require('app-root-path');
const baseUplodFolder = '/uploads/';

var config = {
    // vehicle: appRoot + baseUplodFolder + 'car/',
    // equipment: appRoot + baseUplodFolder + 'equipment/',
    // homestay: appRoot + baseUplodFolder + 'homestay/',
    // hotel: appRoot + baseUplodFolder + 'hotel/',
    // misc: appRoot + baseUplodFolder + 'misc/',
    // user: appRoot + baseUplodFolder + 'user/',
    // banner: appRoot + baseUplodFolder + 'banner/',
    // room: appRoot + baseUplodFolder + 'room/',
    // tour: appRoot + baseUplodFolder + 'tour/',
    // roomIcon: appRoot + baseUplodFolder + 'roomIcon/',
    // occupentsIcon: appRoot + baseUplodFolder + 'occupentsIcon/',
    // media: appRoot + baseUplodFolder + 'media/',
    // bathroom: appRoot + baseUplodFolder + 'bathroom/',
    // extrabed: appRoot + baseUplodFolder + 'extrabed/',
    owner: appRoot + baseUplodFolder + 'images/owner/',
    product: appRoot + baseUplodFolder + 'images/product/',
    invoice: appRoot + baseUplodFolder + 'invoices/'
};


module.exports = config;
