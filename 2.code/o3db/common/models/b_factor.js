/**
 * Created by dell on 2017/10/23.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/b_factor_acl');
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

module.exports = function(b_factor) {
  b_factor.settings.acls = acl;
  /*查询*/
  b_factor.list = function (data, cb) {
    var filter = {
      order: '_id DESC',
      where: {}
    };
    if (data.fcode != "undefined"&&data.fcode) filter.where.fcode = {regexp: data.fcode};
    if (data.fname != "undefined"&&data.fname) filter.where.fname = {regexp:data.fname};
    if (data.ftype != "undefined"&&data.ftype) filter.where.ftype = Number(data.ftype);
    if (data.fpoint != "undefined"&&data.fpoint) filter.where.fpoint = Number(data.fpoint);
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    b_factor.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('监测因子查询失败：' + err);
        return false;
      }
      b_factor.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('监测因子查询失败：' + err);
          return false;
        }
        var obj = {};
        for(var i = 0;i<rs.length;i++){
          obj[rs[i].fcode] = rs[i];
        }
        cb(null, {
          ret: 1,
          datas: rs,
          group:obj,
          msg: '查询成功',
          count: count
        });
      });
    });
  };
  b_factor.remoteMethod('list', {
    description: '监测因子查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
