'use strict';
/*********************************
 *    GLOBAL HELPER INITIALIZE   *
 *********************************/
require('./helpers').globalHelper;
/*********************************
 *       MODULES INITIALIZE      *
 *********************************/
const express = require('express');
const configs = require('./configs');
const db = require('./db/mongo');
const http = require('http');
const middlewares = require('./middlewares');
const errorHandler = require('./middlewares/errorHandler');
const logger = global.logger = require('./configs/logger');

global._MESSAGE = require('./message');

const app = express();
const server = http.createServer(app);

logger.info("Database Connecting ...........");
module.exports.exposeServer = () => server;

db.connect(configs.mongo.host+configs.mongo.db)
    .then(() => {
        return middlewares(app);
    })
    .then((app) => {
        return require('./routes').attach(app);
    })
    .then((app) => {
        app.use(errorHandler);
    })
    .then(() => {
        server.listen(configs.server.httpPort);
        server.on('listening', () => {
            let addr = server.address();
            let bind = typeof addr === 'string' ?
                'pipe' + addr :
                'pipe' + addr.port;
            logger.info("Listening on " + bind);
        });
    })
    .catch((err) => {
        logger.error("Error Occured: " + err);
        process.exit();
    })