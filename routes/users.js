var express = require('express');
var router = express.Router();
var verifySign = require('./middleware')
const tokenGenerator = require('../util/tokenGenerator')

/* GET users listing. */
router.get('/',verifySign, function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/test/token', async (req, res) => {
  const tokenData = await tokenGenerator.generateAuthToken()
  res.send(tokenData)
})

module.exports = router;
