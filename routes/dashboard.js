'use strict';

const router = require('express').Router();
const _Company = require('../models').COMPANY;

router.get('/', (req, res, next) => {
    Promise.all([
        _Company.read({status: 0}, 'many')
    ]).then(([company]) => {
        res.render('dashboard', {
            company: company.length,
            account_manager: 0
        });
    })
    
});
module.exports = router;