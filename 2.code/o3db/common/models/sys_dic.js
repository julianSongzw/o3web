/**
 * Created by dell on 2017/6/26.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var logs = require('../../logServer');
let acl = require('../../acls/sys_dic_acl');
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
module.exports = function(sys_dic) {
  sys_dic.settings.acls = acl;
  /*JSON查询*/
  sys_dic.listJson = function (cb) {
    sys_dic.find(function (err, rs) {
      if(err) {
        cb(null,errColMsg);
        errLog.error('数据字典JSON查询失败：' + err);
        return false;
      }
      var obj={};
      for (var i=0; i < rs.length; ++i) {
        if(!obj[rs[i].dtype]){
          obj[rs[i].dtype]={};
        }
        if(! obj[rs[i].dtype][rs[i].name]){
          obj[rs[i].dtype][rs[i].name]={};
        }
        obj[rs[i].dtype][rs[i].name]= rs[i].value;
      }
      var ret = {
        ret: 1,
        datas: obj,
        msg: '查询成功'
      };
      cb(null,ret);
    });
  };
  sys_dic.remoteMethod('listJson', {
    description:'数据字典JSON查询',
    http: {path:'/listJson',verb:'get'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*新增*/
  sys_dic.add = function (req, cb) {
    var data = req.body;
    data.order = Number(data.value) + 1;
    var where = {
      "dtype": data.dtype,
      "name": data.name
    };
    sys_dic.count(where,function (err, count) {
      if(count>0) {
        cb(null,{
          ret:0,
          msg:'该字典已存在'
        });
        errLog.error('该字典已存在');
        return false;
      }
      sys_dic.create(data,function (err, rs) {
        if(err) {
          cb(null,{
            ret:0,
            msg:'添加字典失败'
          });
          errLog.error('添加字典失败：' + err);
          return false;
        }
        var user = req.query.username;
        logs.optLog("添加数据字典："+rs.value,req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress,user);
        cb(null,{
          ret:1,
          id:rs.id,
          msg:'新增成功'
        });
      })
    });
  };
  sys_dic.remoteMethod('add', {
    description:'添加字典',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/add',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*删除*/
  sys_dic.del = function (req, cb) {
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
    sys_dic.destroyAll(where,function (err, info) {
      if(err) {
        cb(null,err);
        errLog.error('删除字典失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除"+info.count+"条字典",req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'删除成功'
      });
    })
  };
  sys_dic.remoteMethod('del', {
    description:'删除字典',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/delete',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*修改*/
  sys_dic.up = function (req, cb) {
    var data = req.body;
    if(!data.id||data.id=="undefined"||data.id==""){
      cb(null,errParamMsg);
      return false;
    }
    delete data['dicType'];
    var id = data.id;
    delete data['id'];
    sys_dic.replaceById(id,data,{validate:true},function (err,rs) {
      if(err) {
        cb(null,{
          ret:0,
          msg:'修改字典失败'
        });
        errLog.error('修改字典失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("修改字典"+rs.value,req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,user);
      cb(null,{
        ret:1,
        msg:'修改成功'
      });
    })
  };
  sys_dic.remoteMethod('up', {
    description:'修改字典',
    accepts: {arg:'req', type:'Object',required:true,http: { source: 'req' }},
    http: {path:'/dicUpdate',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });

  /*查询*/
  sys_dic.list = function (data, cb) {
    var filter = {
      order:['dtype ASC','order ASC'],
      include:'dic_type',
      where:{}
    };
    if(data.dtype!="undefined"&&data.dtype) filter.where.dtype = {regexp:data.dtype};
    if(data.pageSize!="undefined"&&data.pageIndex!="undefined"&&data.pageSize&&data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    sys_dic.find(filter,function (err, rs) {
      if(err) {
        cb(null,errColMsg);
        errLog.error('字典查询失败：' + err);
        return false;
      }
      sys_dic.count(filter.where,function (err, count) {
        if (err) {
          cb(null,errColMsg);
          errLog.error('字典查询失败：' + err);
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
  sys_dic.remoteMethod('list', {
    description:'字典查询',
    accepts: {arg:'data', type:'Object',required:true,http: { source: 'body' }},
    http: {path:'/list',verb:'post'},
    returns: {arg: 'res', type: 'Object',root:true,required:true}
  });
};
