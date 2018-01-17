var express = require('express');
var router = express.Router();
var later = require('later');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //
  //var sec = later.parse.text("every 1 seconds");
  //var hour = later.parse.text("every 1 hour");
  //var month = later.parse.text("at 11:55 pm on the last day of the month");
  //later.date.localTime();
  //// get the next 10 valid occurrences
  //later.setInterval(function () {
  //  console.log("DDDDD")
  //},sec)
  res.send('respond with a resource');
});

module.exports = router;
