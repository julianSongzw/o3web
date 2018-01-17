/**
 * Created by dell on 2017/10/23.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/b_area_acl');
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

module.exports = function(b_area) {
  b_area.settings.acls = acl;
  /*查询*/
  b_area.list = function (req, cb) {
    let data = req.body;
    var filter = {
      order: '_id DESC',
      include:'sites',
      where: {}
    };
    if (data.area_code != "undefined"&&data.area_code) filter.where.area_code = {regexp: data.area_code};
    if (data.area_name != "undefined"&&data.area_name) filter.where.area_name = {regexp:data.area_name};
    if (data.parent_area_code != "undefined"&&data.parent_area_code) filter.where.parent_area_code = {regexp:data.parent_area_code};
    if (data.level != "undefined"&&data.level) filter.where.level = Number(data.level);
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    b_area.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('查询行政区划失败：' + err);
        return false;
      }
      b_area.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('查询行政区划失败：' + err);
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
  b_area.remoteMethod('list', {
    description: '行政区划查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*分组查询*/
  b_area.listArea = function (cb) {
    var filter = {
      include:'sites'
    };
    b_area.find(filter,function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('区划下分组查询监测点失败：' + err);
        return false;
      }
      var obj = {};
      for(var i = 0;i<rs.length;i++){
        obj[rs[i].area_code] = rs[i];
      }
      cb(null, {
        ret: 1,
        datas: obj,
        msg: '查询成功'
      });
    });
  };
  b_area.remoteMethod('listArea', {
    description: '区划分组查询监测点',
    http: {path: '/areaSite', verb: 'get'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
