var express = require('express');
var router = express.Router();
var verifySign = require('../util/oauthMiddleware')

/* GET home page. */
router.get('/',verifySign, function(req, res, next) {
  console.log('ressdsdasd ')
  res.send({
    tess: 'Tess'
  })
  // res.render('index', { title: 'Express' });
});

module.exports = router;
