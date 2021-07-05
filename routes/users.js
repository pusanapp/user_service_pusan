var express = require('express');
var router = express.Router();
var verifySign = require('./middleware')

/* GET users listing. */
router.get('/',verifySign, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
