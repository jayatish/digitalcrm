'use strict';

const appRoot = require('app-root-path');
const baseUplodFolder = '/uploads/images/';

var config = {
    accountManager: appRoot + baseUplodFolder + 'accountManager/',
    company: appRoot + baseUplodFolder + 'company/',
};


module.exports = config;
