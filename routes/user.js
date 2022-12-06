"use strict";

const {
  USER: user
} = require('../controllers');
const router = require("express").Router();
const responseHandler = require("../middlewares/responseHandler");
const authHandler = require("../middlewares/auth");
const { check } = require("express-validator/check");

// Start section API list
router.get('/', user.homePage);
router.get('/error', user.errorPage);
router.get('/success', user.successPage);
router.get('/reset-password/:id?/:token?', user.resetPassword);
router.post('/reset-password/:id?/:token?', user.updatePassword);
// End section API list


module.exports = router;
