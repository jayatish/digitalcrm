"use strict";

const {
  ADMINAUTH: adminauth
} = require('../controllers');
const router = require("express").Router();
const responseHandler = require("../middlewares/responseHandler");
const authHandler = require("../middlewares/auth");
const { check } = require("express-validator/check");

// Start section API list
router.post('/adminsignup', adminauth.signUp, responseHandler)
router.post('/adminsignin', adminauth.apisignin, responseHandler)
// End section API list

module.exports = router;
