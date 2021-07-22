const express = require('express');
const router = express.Router();
const verifySign = require('../util/oauthMiddleware');
const tokenGenerator = require('../util/tokenGenerator')
const userController = require('../controller/user_controller')
/* GET users listing. */
router.get('/',verifySign, function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/test/token', async (req, res) => {
  const tokenData = await tokenGenerator.generateAuthToken()
  res.send(tokenData)
})

router.post('/register', userController.registerUser)
router.get('/activate', userController.activateUser)
router.post('/login', userController.loginUser)
router.get('/profile/:user_id', userController.getUser)

module.exports = router;
