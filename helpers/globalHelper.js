'use strict'
var module, exports;
var winston = require('winston');
var promise = require('bluebird');
global.autoFileLoader = require('./autoFileLoader');
/**
 * ///////////         This file contains all global varibale and functions //////
 *
 *
 */

global.Promise = promise; // alias for bluebird promise library
global.print = console.log; // alias for console.log
global.jsObject = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * This will return `n`(max 8 times) number of `../` string
 * ex:- dslash(3) => "../../../" 
 */
global.dslash = function (number) {
    number = number || 1;
    return "../../../../../../../../../../../../../../../../../../../../../../../../".substr(0, number * 3);
};

global.Utility = require('../utility');
var serverCnfg = require('../configs').server;

// global.logger = new(winston.Logger)({
//     transports: [
//         new(winston.transports.Console)({
//             level: 'info'
//         }),
//         new(winston.transports.File)({
//             name: 'error-file',
//             filename: serverCnfg.errorLog,
//             level: 'error'
//         })
//     ]
// });


module.exports = {};