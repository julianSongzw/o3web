/**
 * Created by dell on 2017/7/4.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var logs = require('../../logServer');
let acl = require('../../acls/sys_dic_type_acl');
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

module.exports = function(sys_dic_type) {
  sys_dic_type.settings.acls = acl;
  sys_dic_type.validatesUniquenessOf('code_type');
  /*查询*/
  sys_dic_type.list = function (data, cb) {
    var filter = {
      order: '_id DESC',
      where: {}
    };
    if (data.type_name != "undefined"&&data.type_name) filter.where.type_name = {regexp: data.type_name};
    if (data.type_code != "undefined"&&data.type_code) filter.where.type_code = {regexp:data.type_code};
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    sys_dic_type.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('字典类型查询失败：' + err);
        return false;
      }
      sys_dic_type.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('字典类型查询失败：' + err);
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
  sys_dic_type.remoteMethod('list', {
    description: '字典类型查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
