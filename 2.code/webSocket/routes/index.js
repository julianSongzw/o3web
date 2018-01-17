var express = require('express');
var router = express.Router();
let websocket = require('../webSocket');

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index', { title: '国控点数据抓取' });
});

//  webSocket推送
router.post('/sendMsg', function (req, res, next) {
    let msg = req.body;
    websocket.writeRapid(msg);
    res.json({
      ret: 1,
      msg: '发送成功'
    })
});

module.exports = router;
