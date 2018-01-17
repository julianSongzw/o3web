/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: d_air
 * @Description: 国控点控制质量数据
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/14
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
let config = require('../../config');
let mongodb = require('mongodb');
let ObjectID = mongodb.ObjectID;
let loopback = require('loopback');
let app = loopback();
let logs = require('../../logServer');
let co = require('co');
let thunkify = require('thunkify');
let acl = require('../../acls/d_air_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');

let errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
let errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};
module.exports = function (d_air) {
  d_air.settings.acls = acl;
  //  查询
  d_air.list = function (data, cb) {
    var filter = {
      order: 'time_cj DESC',
      where: {}
    };
    if (data.scode !== "undefined" && data.scode) filter.where.scode = data.scode;
    d_air.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('国控点污染物查询失败：' + err);
        return false;
      }
      d_air.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('国控点污染物查询失败：' + err);
          return false;
        }
        cb(null, {
          ret: 1,
          datas: rs,
          msg: '查询成功',
          count: count
        });
      });
    });
  };
  d_air.remoteMethod('list', {
    description: '查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
