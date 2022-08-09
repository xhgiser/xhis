var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  var data = {
    code: 0,
    msg:"请求成功"
  }
  res.send(data.code);
});

module.exports = router;
