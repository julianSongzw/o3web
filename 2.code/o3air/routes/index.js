var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', { title: '国控点数据抓取' });
});

module.exports = router;
