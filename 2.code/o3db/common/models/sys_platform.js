/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: sys_platform
 * @Description: 平台配置接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/7
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
let config = require('../../config');
let mongodb = require('mongodb');
let conStr = mongodb.dbConnStr;
let ObjectID = mongodb.ObjectID;
let logs = require('../../logServer');
let acl = require('../../acls/sys_platform_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let fs = require('fs');
let formidable = require('formidable');
let errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
let errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};
module.exports = function (sys_platform) {
  sys_platform.settings.acls = acl;
  /*查询*/
  sys_platform.list = function (cb) {
    sys_platform.find(function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('平台配置查询失败：' + err);
        return false;
      }
      cb(null, {
        ret: 1,
        datas: rs,
        msg: '查询成功'
      });
    });
  };
  sys_platform.remoteMethod('list', {
    description: '查询',
    http: {path: '/list', verb: 'get'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  //  添加
  sys_platform.add = function (req, cb) {
    let formParse = new formidable.IncomingForm();
    formParse.uploadDir = './public/temp/';//缓存地址
    formParse.multiples = true;//设置为多文件上传
    formParse.keepExtensions = true;//是否包含文件后缀
    let dir = config.logoUpload;
    //  清空文件
    let files = fs.readdirSync(dir);
    files.forEach(function (file, index) {
      let curPath = dir + file;
      fs.unlinkSync(curPath);
    });
    formParse.parse(req, function (error, fields, files) {
      if (error) {
        cb(null, {
          ret: 0,
          msg: '文件上传失败'
        });
        errLog.error('文件上传失败：' + error);
        return false;
      }
      let data = fields;
      if (files.pic) {
        let filesName = files.pic.name;
        let suffixName = /\w{1,4}$/.exec(filesName)[0];
        let uploadPath = files.pic.path;
        let newPath = dir + 'logo' + '.' + suffixName;
        fs.renameSync(uploadPath, newPath);
        data.logo_url = config.ftpServer + '/logo/' + 'logo' + '.' + suffixName;
      }
      sys_platform.destroyAll({}, function (err, count) {
        if (err) {
          cb(null, {
            ret: 0,
            msg: '删除旧配置失败'
          });
          errLog.error('删除旧配置失败：' + err);
          return false;
        }
        sys_platform.create(data, function (err, rs) {
          if (err) {
            cb(null, {
              ret: 0,
              msg: '配置失败'
            });
            errLog.error('配置失败：' + err);
            return false;
          }
          let user = req.query.username;
          logs.optLog("平台配置", req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress, user);
          cb(null, {
            ret: 1,
            id: rs.id,
            msg: '配置成功'
          });
        });
      });
    });
  };
  sys_platform.remoteMethod('add', {
    description: '配置',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/add', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
