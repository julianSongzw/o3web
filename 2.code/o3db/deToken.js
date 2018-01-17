/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: deToken
 * @Description: 删除token
 * @author songzw@cychina.cn （宋志玮）
 * @date 2018/1/9
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2018
 */
'use strict';
let config = require('./config');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let loopback = require('loopback');
let tokenModel = loopback.getModel('AccessToken');
module.exports = function (token) {
  tokenModel.destroyAll({_id: token}, function (err, count) {
    if (err) {
      errLog.error('删除token失败：' + err.toString());
    }
  });
};
