/**
 * Created by dell on 2017/10/24.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/o_device_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let co = require('co');
let thunkify = require('thunkify');
var errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
var errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};

module.exports = function(o_device) {
  o_device.settings.acls = acl;
  /*唯一性字段*/
  o_device.validatesUniquenessOf('code');

  /*查询*/
  o_device.list = function (data, cb) {
    var filter = {
      order:'_id DESC',
      include:['site_info','union_gk_info','union_sk_info','union_cg_info'],
      where:{}
    };
    if(data.code!="undefined"&&data.code) filter.where.code = {regexp:data.code};
    if(data.name!="undefined"&&data.name) filter.where.name = {regexp:data.name};
    if(data.otype!="undefined"&&data.otype) filter.where.otype = {regexp:data.otype};
    if(data.site!="undefined"&&data.site) filter.where.site = {regexp:data.site};
    if(data.factor!="undefined"&&data.factor) filter.where.factor = {regexp:data.factor};
    if(data.union_gk!="undefined"&&data.union_gk) filter.where.union_gk = {regexp:data.union_gk};
    if(data.union_sk!="undefined"&&data.union_sk) filter.where.union_sk = {regexp:data.union_sk};
    if(data.union_cg!="undefined"&&data.union_cg) filter.where.union_cg = {regexp:data.union_cg};
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    o_device.find(filter,function (err, rs) {
      if(err) {
        cb(null,errColMsg);
        errLog.error('设备查询失败：' + err);
        return false;
      }
      o_device.count(filter.where,function (err, count) {
        if (err) {
          cb(null,errColMsg);
          errLog.error('设备查询失败：' + err);
          return false;
        }
        co(function* () {
          let param = {
            o:o_device,
          };
          let fh = thunkify(findHistory);
          for(let i = 0;i<rs.length;i++){
            param.code = rs[i].code;
            let history = yield fh(param);
            if(history){
              rs[i].history = history[0];
            }
          }
          cb(null,{
            ret:1,
            datas:rs,
            msg:'查询成功',
            count:count
          });
        });
      });
    });
  };
  o_device.remoteMethod('list', {
    description:'设备查询',
    accepts: {arg:'data', type:'Object',required:true,http: { source: 'body' }},
    http: {path:'/list',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*新增*/
  o_device.add = function (req, cb) {
    var data = req.body;
    data.state = false;
    data.angular = '';
    data.scan_type = '0';
    o_device.create(data,function (err, rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'添加设备失败'
        });
        errLog.error('添加设备失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("添加设备："+rs.code,req.headers['x-forwarded-for'] ||
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
  o_device.remoteMethod('add', {
    description:'添加设备',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/add',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*修改*/
  o_device.up = function (req, cb) {
    var data = req.body;
    if(!data.id||data.id=="undefined"||data.id==""){
      cb(null,errParamMsg);
      return false;
    }
    var id = data.id;
    delete data['site_info'];
    delete data['union_gk_info'];
    delete data['union_sk_info'];
    delete data['union_cg_info'];
    delete data['id'];
    o_device.replaceById(id,data,{validate:true},function (err,rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'修改设备失败'
        });
        errLog.error('修改设备失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("修改设备"+rs.code,req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'修改成功'
      });
    })
  };
  o_device.remoteMethod('up', {
    description:'修改设备',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/deviceUpdate',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*删除*/
  o_device.del = function (req, cb) {
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
    o_device.destroyAll(where,function (err, info) {
      if(err) {
        cb(null,err);
        errLog.error('删除设备失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除"+info.count+"个设备",req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'删除成功'
      });
    })
  };
  o_device.remoteMethod('del', {
    description:'删除设备',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/delete',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });
};

function findHistory(param, callback) {
  param.o.app.models.o_history.find({order:'time_ks DESC',where:{code:param.code}},function (err, rs) {
    if(err){
      callback(null,false);
      errLog.error('设备查询获取状态失败：'+err);
    }else {
      callback(null,rs);
    }
  });
}
