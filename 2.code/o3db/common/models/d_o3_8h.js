/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: d_o3_8h
 * @Description: 臭氧8小时滑动平均
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/6
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
var errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
var errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};
module.exports = function(d_o3_8h) {
  /*查询*/
  d_o3_8h.list = function (data, cb) {
    var filter = {
      order: 'time_cj ASC',
      where: {}
    };
    if (data.scode != "undefined" && data.scode) filter.where.scode = {regexp: data.scode};
    if (data.device_code != "undefined" && data.device_code) filter.where.device_code = {regexp: data.device_code};
    if (data.atype != "undefined" && data.atype) filter.where.atype = {regexp: data.atype};
    if (data.time_cj_start != "undefined" && data.time_cj_end != "undefined" && data.time_cj_start && data.time_cj_end) filter.where.time_cj = {between: [Number(data.time_cj_start), Number(data.time_cj_end)]};
    if (data.pageSize != "undefined" && data.pageIndex != "undefined" && data.pageSize && data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    d_o3_8h.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('臭氧8h数据查询失败：' + err);
        return false;
      }
      d_o3_8h.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('臭氧8h数据查询失败：' + err);
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
  d_o3_8h.remoteMethod('list', {
    description: '臭氧8h数据查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
