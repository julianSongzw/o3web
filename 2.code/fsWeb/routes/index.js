/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: index
 * @Description: 文件服务器说明
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/4
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
var express = require('express');
var router = express.Router();

router.all('/', function(req, res, next) {
    res.render('index', { title: '文件服务器' });
});

module.exports = router;