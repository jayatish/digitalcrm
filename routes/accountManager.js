'use strict';

const {
    ACCOUNTMANAGER: accountManager
} = require('../controllers');
const router = require('express').Router();
router.get('/', accountManager.renderList);
router.get('/add', accountManager.renderAddPage);
router.post('/insertData', accountManager.insertAccountManager);
router.get('/edit/:id', accountManager.renderEditPage);
router.post('/edit/:id', accountManager.updateAccountManager);
router.get('/delete/:id', accountManager.deleteAccountManager);
module.exports = router;