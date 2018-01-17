/**
 * Created by dell on 2017/10/24.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/o_alarm_acl');
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

module.exports = function(o_alarm) {
  o_alarm.settings.acls = acl;
  /*查询*/
  o_alarm.list = function (data, cb) {
    var filter = {
      order:'_id DESC',
      where:{}
    };
    if(data.code!="undefined"&&data.code) filter.where.code = {regexp:data.code};
    if(data.factor!="undefined"&&data.factor) filter.where.factor = {regexp:data.factor};
    if(data.atype!="undefined"&&data.atype) filter.where.atype = {regexp:data.atype};
    if(data.atime_start!="undefined"&&data.atime_end!="undefined"&&data.atime_start&&data.atime_end) filter.where.atime = {between:[Number(data.atime_start),Number(data.atime_end)]};
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    o_alarm.find(filter,function (err, rs) {
      if(err) {
        cb(null,errColMsg);
        errLog.error('报警历史查询失败：' + err);
        return false;
      }
      o_alarm.count(filter.where,function (err, count) {
        if (err) {
          cb(null,errColMsg);
          errLog.error('报警历史查询失败：' + err);
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
  o_alarm.remoteMethod('list', {
    description:'报警历史查询',
    accepts: {arg:'data', type:'Object',required:true,http: { source: 'body' }},
    http: {path:'/list',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*新增*/
  o_alarm.add = function (req, cb) {
    var data = req.body;
    o_alarm.create(data,function (err, rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'添加报警历史失败'
        });
        errLog.error('添加报警历史失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("添加报警历史："+rs.code,req.headers['x-forwarded-for'] ||
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
  o_alarm.remoteMethod('add', {
    description:'添加报警历史',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/add',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*修改*/
  o_alarm.up = function (req, cb) {
    var data = req.body;
    if(!data.id||data.id=="undefined"||data.id==""){
      cb(null,errParamMsg);
      return false;
    }
    var id = data.id;
    delete data['id'];
    o_alarm.replaceById(id,data,{validate:true},function (err,rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'修改报警历史失败'
        });
        errLog.error('修改报警历史失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("修改报警历史"+rs.code,req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'修改成功'
      });
    })
  };
  o_alarm.remoteMethod('up', {
    description:'修改报警历史',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/oalarmUpdate',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*删除*/
  o_alarm.del = function (req, cb) {
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
    o_alarm.destroyAll(where,function (err, info) {
      if(err) {
        cb(null,err);
        errLog.error('删除报警历史失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除"+info.count+"个报警历史记录",req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'删除成功'
      });
    })
  };
  o_alarm.remoteMethod('del', {
    description:'删除报警历史记录',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/delete',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });
};
