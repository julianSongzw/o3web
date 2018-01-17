/**
 * Created by dell on 2017/7/5.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
let acl = require('../../acls/sys_log_acl');
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

module.exports = function(sys_log) {
  sys_log.settings.acls = acl;
/*查询*/
  sys_log.list = function (data, cb) {
    var filter = {
      order: 'timestamp DESC',
      where: {}
    };
    if (data.type != "undefined" && data.type) {
      if(data.type=="0"){
        filter.where.level="error";
      }
      else if(data.type=="1"){
        filter.where.level="info";
      }
    }
    if(data.logTime_Start!="undefined"&&data.logTime_End!="undefined"&&data.logTime_Start&&data.logTime_End) filter.where.timestamp = {between:[Number(data.logTime_Start),Number(data.logTime_End)]};
    if (data.pageSize != "undefined" && data.pageIndex != "undefined" && data.pageSize && data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    sys_log.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('日志查询失败：' + err);
        return false;
      }
      sys_log.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('日志查询失败：' + err);
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
  sys_log.remoteMethod('list', {
    description: '日志查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
