'use strict';

const auth = require('../middlewares/auth');

const routes = {
    API: require('./api'),
    USER: require('./user'),
    LOGIN: require('./login'),
    DASHBOARD: require('./dashboard'),
    COMPANY: require('./company')
};

module.exports = {
    attach: (app) => {
        app
            .use('*', (req, res, next) => {
                res.locals.currentUrl = req.originalUrl;
                next();
            })
            .use('/api', routes.API)
            // .use('/', routes.USER)
            .use('/dashboard', routes.DASHBOARD)
            .use('/company', routes.COMPANY)
            .use(routes.LOGIN)
            
        app.use('*', auth.isAuthenticated, (req, res, next) => {
            // next({
            //     err: 'apinotfound',
            //     msg: 'NO_API_FOUND',
            //     mainMsg: 'NOT_FOUND'
            // });
            // res.redirect('/error');
            console.log('Admin Error Page');
            res.render('admin/error');
        });


        print('Routes Connected');
        return app;
    }
};