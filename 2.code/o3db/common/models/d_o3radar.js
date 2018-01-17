/**
 * Created by dell on 2017/10/25.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/d_o3radar_acl');
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

module.exports = function (d_o3radar) {
  d_o3radar.settings.acls = acl;
  /*查询*/
  d_o3radar.list = function (data, cb) {
    var filter = {
      order: 'time_cj DESC',
      where: {}
    };
    if (data.scode != "undefined" && data.scode) filter.where.scode = {regexp: data.scode};
    if (data.device_code != "undefined" && data.device_code) filter.where.device_code = {regexp: data.device_code};
    if (data.atype != "undefined" && data.atype) filter.where.atype = {regexp: data.atype};
    if (data.time_cj_start != "undefined" && data.time_cj_end != "undefined" && data.time_cj_start && data.time_cj_end) filter.where.time_cj = {between: [Number(data.time_cj_start), Number(data.time_cj_end)]};
    d_o3radar.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('臭氧基础数据查询失败：' + err);
        return false;
      }
      let result = {};
      for (let i = 0; i < rs.length; i++) {
        let h_value = [];
        for (let j = config.h_start; j <= config.h_end; j = j + config.h_index) {
          h_value.push(rs[i]['h_' + j.toString()] === null ? 0 : rs[i]['h_' + j.toString()]);
        }
        result[rs[i].time_cj] = h_value;
      }
      cb(null, {
        ret: 1,
        datas: result,
        msg: '查询成功'
      });
    });
  };
  d_o3radar.remoteMethod('list', {
    description: '臭氧基础数据查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
