const express = require('express');
const router = express.Router();
const jwtController = require('../controller/jwt_controller')
router.post('/verify', jwtController.checkJWTToken)

module.exports = router
