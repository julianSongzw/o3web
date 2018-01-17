/**
 * Created by dell on 2017/10/24.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/o_control_acl');
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

module.exports = function(o_control) {
  o_control.settings.acls = acl;
  /*查询*/
  o_control.list = function (data, cb) {
    var filter = {
      order:'_id DESC',
      where:{}
    };
    if(data.code!="undefined"&&data.code) filter.where.code = {regexp:data.code};
    if(data.ctype!="undefined"&&data.ctype) filter.where.ctype = {regexp:data.ctype};
    if(data.result!="undefined"&&data.result) filter.where.result = data.result;
    if(data.ctime_start!="undefined"&&data.ctime_end!="undefined"&&data.ctime_start&&data.ctime_end) filter.where.ctime = {between:[Number(data.ctime_start),Number(data.ctime_end)]};
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    o_control.find(filter,function (err, rs) {
      if(err) {
        cb(null,errColMsg);
        errLog.error('设备质控查询失败：' + err);
        return false;
      }
      o_control.count(filter.where,function (err, count) {
        if (err) {
          cb(null,errColMsg);
          errLog.error('设备质控查询失败：' + err);
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
  o_control.remoteMethod('list', {
    description:'设备质控查询',
    accepts: {arg:'data', type:'Object',required:true,http: { source: 'body' }},
    http: {path:'/list',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*新增*/
  o_control.add = function (req, cb) {
    var data = req.body;
    data.result = '2';
    data.ctime = Date.now();
    o_control.create(data,function (err, rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'设备质控查询失败'
        });
        errLog.error('设备质控查询失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("添加设备质控："+rs.code,req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        id:rs.id,
        msg:'新增成功'
      });
    });
  };
  o_control.remoteMethod('add', {
    description:'添加设备质控',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/add',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*修改*/
  o_control.up = function (req, cb) {
    var data = req.body;
    if(!data.id||data.id=="undefined"||data.id==""){
      cb(null,errParamMsg);
      return false;
    }
    var id = data.id;
    delete data['id'];
    o_control.replaceById(id,data,{validate:true},function (err,rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'修改设备质控失败'
        });
        errLog.error('修改设备质控失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("修改设备质控"+rs.code,req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'修改成功'
      });
    })
  };
  o_control.remoteMethod('up', {
    description:'修改设备质控',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/controlUpdate',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*删除*/
  o_control.del = function (req, cb) {
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
    o_control.destroyAll(where,function (err, info) {
      if(err) {
        cb(null,err);
        errLog.error('删除设备质控失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除"+info.count+"个设备质控记录",req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'删除成功'
      });
    })
  };
  o_control.remoteMethod('del', {
    description:'删除设备质控',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/delete',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });
};
