const express = require('express');
const router = express.Router();
const authController = require('../controller/auth_controller')
router.post('/google', authController.verifyLoginGoogle)
router.post('/facebook', authController.verifyLoginFacebook)

module.exports = router
