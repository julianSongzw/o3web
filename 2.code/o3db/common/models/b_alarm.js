/**
 * Created by dell on 2017/10/24.
 */
let config = require('../../config');
let mongodb = require('mongodb');
let ObjectID = mongodb.ObjectID;
let loopback = require('loopback');
let app = loopback();
let logs = require('../../logServer');
let acl = require('../../acls/b_alarm_acl');
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

module.exports = function (b_alarm) {
  b_alarm.settings.acls = acl;
  /*查询*/
  b_alarm.list = function (data, cb) {
    let filter = {
      order: '_id DESC',
      include: ['area_info', 'city_info'],
      where: {}
    };
    if (data.factor !== "undefined" && data.factor) filter.where.factor = {regexp: data.factor};
    if (data.city !== "undefined" && data.city) filter.where.city = {regexp: data.city};
    if (data.area !== "undefined" && data.area) filter.where.area = {regexp: data.area};
    if (data.season !== "undefined" && data.season) filter.where.season = Number(data.season);
    if (data.pageSize !== "undefined" && data.pageIndex !== "undefined" && data.pageSize && data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    b_alarm.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('报警配置查询失败：' + err);
        return false;
      }
      b_alarm.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('报警配置查询失败：' + err);
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
  b_alarm.remoteMethod('list', {
    description: '报警配置查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*新增*/
  b_alarm.add = function (req, cb) {
    let data = req.body;
    b_alarm.create(data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '新增报警配置失败'
        });
        errLog.error('新增报警配置失败：' + err);
        return false;
      }
      let user = req.query.username;
      logs.optLog("添加" + rs.factor + "因子报警配置", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        id: rs.id,
        msg: '新增成功'
      });
    });
  };
  b_alarm.remoteMethod('add', {
    description: '添加报警配置',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/add', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*修改*/
  b_alarm.up = function (req, cb) {
    let data = req.body;
    if (!data.id || data.id === "undefined" || data.id === "") {
      cb(null, errParamMsg);
      return false;
    }
    let id = data.id;
    delete data['area_info'];
    delete data['city_info'];
    delete data['id'];
    b_alarm.replaceById(id, data, {validate: true}, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '修改报警配置失败'
        });
        errLog.error('修改报警配置失败：' + err);
        return false;
      }
      let user = req.query.username;
      logs.optLog("修改" + rs.factor + "因子报警配置", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '修改成功'
      });
    })
  };
  b_alarm.remoteMethod('up', {
    description: '修改报警配置',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/alarmUpdate', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*删除*/
  b_alarm.del = function (req, cb) {
    let data = req.body;
    if (!data.id || data.id === "undefined" || data.id === "") {
      cb(null, errParamMsg);
      return false;
    }
    let arr = [];
    data.id.split(",").forEach(function (item) {
      arr.push(ObjectID(item));
    });
    let where = {_id: {inq: arr}};
    b_alarm.destroyAll(where, function (err, info) {
      if (err) {
        cb(null, err);
        errLog.error('删除报警配置失败：' + err);
        return false;
      }
      let user = req.query.username;
      logs.optLog("删除" + info.count + "个报警配置", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '删除成功'
      });
    })
  };
  b_alarm.remoteMethod('del', {
    description: '删除报警配置',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/delete', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
