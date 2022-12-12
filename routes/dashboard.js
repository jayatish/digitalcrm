'use strict';

const router = require('express').Router();
const _Company = require('../models').COMPANY;
const _AccountManager = require('../models').ACCOUT_MANAGER;

router.get('/', (req, res, next) => {
    Promise.all([
        _Company.read({status: 0}, 'many'),
        _AccountManager.read({status: 0}, 'many')
    ]).then(([company,account_manager]) => {
        res.render('dashboard', {
            company: company.length,
            account_manager: account_manager.length
        });
    })
    
});
module.exports = router;