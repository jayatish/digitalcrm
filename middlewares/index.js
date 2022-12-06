'use strict';

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const logger = require('morgan');
const engine = require('ejs-locals');
const path = require('path');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
// const FileStore = require('session-file-store')(session);
const MongoStore = require('connect-mongo')(session);
const uploadConfig = require('../configs/upload');
const config = require('../configs');

const mw = {
    responseBuilder: require('./responseBuilder')
};

module.exports = (app) => {

    app.engine('ejs', engine);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    // require('../helpers').userAuthentication.init();

    app.use(logger('dev'))
        .use(mw.responseBuilder)
        .use(cors())
        .use(bodyParser.json({ limit: "50mb" }))
        .use(bodyParser.urlencoded({
            extended: true,
            limit: "50mb"
        }))
        .use(methodOverride())
        .use(express.static(path.join(__dirname, path.sep, '..', path.sep, 'public')))
        .use(session({
            secret: 'invoice app',
            resave: true,
            saveUninitialized: true,
            cookie: {
                expires: 3600000
            }
        }))
        .use(passport.initialize())
        .use(passport.session())
        .use(flash())

    Object.keys(uploadConfig).map((key) => {
        if(key==='owner' || key==='product') {
            app.use('/images', express.static(uploadConfig[key], { etag: false }));
        } if(key==='invoice') {
            app.use('/invoices', express.static(uploadConfig[key], { etag: false }));
        }
    });

    print("Middleware Connected");
    return app;
}
