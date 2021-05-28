const authController = require('../controller/auth');

const express = require('express');
const router = express.Router();

router.post("/signup", authController.userSignup);

router.post("/login", authController.userLogin);

module.exports = router;
