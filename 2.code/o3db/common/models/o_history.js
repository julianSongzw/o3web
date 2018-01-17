/**
 * Created by dell on 2017/10/24.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/o_history_acl');
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

module.exports = function(o_history) {
  o_history.settings.acls = acl;
  /*查询*/
  o_history.list = function (data, cb) {
    var filter = {
      order:'_id DESC',
      where:{}
    };
    if(data.code!="undefined"&&data.code) filter.where.code = {regexp:data.code};
    if(data.state!="undefined"&&data.state) filter.where.state = Number(data.state);
    if(data.gtype!="undefined"&&data.gtype) filter.where.gtype = {regexp:data.gtype};
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    o_history.find(filter,function (err, rs) {
      if(err) {
        cb(null,errColMsg);
        errLog.error('设备历史状态查询失败：' + err);
        return false;
      }
      o_history.count(filter.where,function (err, count) {
        if (err) {
          cb(null,errColMsg);
          errLog.error('设备历史状态查询失败：' + err);
          return false;
        }
        cb(null,{
          ret:1,
          datas:rs,
          msg:'查询成功',
          count:count
        });
      });
    });
  };
  o_history.remoteMethod('list', {
    description:'设备历史状态查询',
    accepts: {arg:'data', type:'Object',required:true,http: { source: 'body' }},
    http: {path:'/list',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*删除*/
  o_history.del = function (req, cb) {
    var data = req.body;
    if(!data.id||data.id=="undefined"||data.id==""){
      cb(null,errParamMsg);
      return false;
    }
    var arr=[];
    data.id.split(",").forEach(function(item){
      arr.push(ObjectID(item));
    });
    var where = {_id:{inq: arr}};
    o_history.destroyAll(where,function (err, info) {
      if(err) {
        cb(null,err);
        errLog.error('设备历史状态删除失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除"+info.count+"个历史状态记录",req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'删除成功'
      });
    })
  };
  o_history.remoteMethod('del', {
    description:'删除设备历史状态',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/delete',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*新增*/
  o_history.add = function (req, cb) {
    let data = req.body;
    o_history.create(data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '添加设备历史状态失败'
        });
        errLog.error('添加设备历史状态失败：' + err);
        return false;
      }
      let user = req.query.username;
      logs.optLog("添加" + rs.code + "设备历史状态", req.headers['x-forwarded-for'] ||
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
  o_history.remoteMethod('add', {
    description: '添加设备历史状态',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/add', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*修改*/
  o_history.up = function (req, cb) {
    let data = req.body;
    if (!data.code || data.code === "undefined" || data.code === "") {
      cb(null, errParamMsg);
      return false;
    }
    delete data['id'];
    delete data['code'];
    o_history.updateAll({code:data.code}, data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '修改设备历史状态失败'
        });
        errLog.error('修改设备历史状态失败：' + err);
        return false;
      }
      let user = req.query.username;
      logs.optLog("修改" + rs.code + "设备历史状态", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '修改成功'
      });
    });
  };
  o_history.remoteMethod('up', {
    description: '修改设备历史状态',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/historyUpdate', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
