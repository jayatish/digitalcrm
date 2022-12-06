'use strict';

const {
    COMPANY: company
} = require('../controllers');
const router = require('express').Router();

// router.get('/', (req, res, next) => {
//     res.send("This is company");
//     // res.render('company/list');
// });
router.get('/', company.renderList);
router.get('/add', company.renderAddPage);
router.post('/insertCompany', company.insertCompany);
router.get('/edit/:id', company.renderEditPage);
router.post('/edit/:id', company.updateCompany);
module.exports = router;