/**
 * Created by dell on 2017/10/31.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/d_xg_acl');
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

module.exports = function(d_xg) {
  d_xg.settings.acls = acl;
  /*查询*/
  d_xg.list = function (data, cb) {
    var filter = {
      order: 'time_cj ASC',
      include:'device',
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
    d_xg.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('消光基础数据查询失败：' + err);
        return false;
      }
      d_xg.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('消光基础数据查询失败：' + err);
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
  d_xg.remoteMethod('list', {
    description: '消光基础数据查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
