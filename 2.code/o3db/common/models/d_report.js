/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: d_report
 * @Description: 报告接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/4
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
let acl = require('../../acls/d_report_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let fs = require('fs');
let formidable = require('formidable');
let archiver = require('archiver');

let co = require('co');
let thunkify = require('thunkify');
let errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
let errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};

module.exports = function (d_report) {
  d_report.settings.acls = acl;
  /*查询*/
  d_report.list = function (data, cb) {
    let filter = {
      order: '_id DESC',
      include: ['city_info', 'area_info'],
      where: {}
    };
    if (data.code !== "undefined" && data.code) filter.where.code = {regexp: data.code};
    if (data.name !== "undefined" && data.name) filter.where.name = {regexp: data.name};
    if (data.rtype !== "undefined" && data.rtype) filter.where.rtype = data.rtype;
    if (data.city !== "undefined" && data.city) filter.where.city = {regexp: data.city};
    if (data.area !== "undefined" && data.area) filter.where.area = {regexp: data.area};
    if (data.rtime_start !== "undefined" && data.rtime_end !== "undefined" && data.rtime_start && data.rtime_end) filter.where.rtime = {between: [Number(data.rtime_start), Number(data.rtime_end)]};
    if (data.pageSize !== "undefined" && data.pageIndex !== "undefined" && data.pageSize && data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    d_report.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('报告查询失败：' + err);
        return false;
      }
      d_report.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('报告查询失败：' + err);
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
  d_report.remoteMethod('list', {
    description: '报告查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  //  添加
  d_report.add = function (req, cb) {
    let formParse = new formidable.IncomingForm();
    let time = dataString(Date.now());
    formParse.uploadDir = './public/temp/';//缓存地址
    formParse.multiples = true;//设置为多文件上传
    formParse.keepExtensions = true;//是否包含文件后缀
    formParse.parse(req, function (error, fields, files) {
      if (error) {
        cb(null, {
          ret: 0,
          msg: '文件上传失败'
        });
        errLog.error('文件上传失败：' + error);
        return false;
      }
      let dir = config.reportUpload;
      // files.pic.forEach(item => {
      let data = fields;
      if (files.pic) {
        let filesName = files.pic.name;
        let suffixName = /\w{1,4}$/.exec(filesName)[0];
        let uploadPath = files.pic.path;
        let newPath = dir + time + '.' + suffixName;
        fs.renameSync(uploadPath, newPath);
        data.file_name = data.name + '-' + time + '.' + suffixName;
        data.file_url = config.ftpServer + '/report/' + data.file_name;
      }
      // });
      data.upload = 0;
      data.rtime = Date.now();
      data.code = time;
      d_report.create(data, function (err, rs) {
        if (err) {
          cb(null, {
            ret: 0,
            msg: '添加报告失败'
          });
          errLog.error('添加报告失败：' + err);
          return false;
        }
        let user = req.query.username;
        logs.optLog("添加报告：" + rs.name, req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress, user);
        cb(null, {
          ret: 1,
          id: rs.id,
          msg: '新增成功'
        });
      });

    });
  };
  d_report.remoteMethod('add', {
    description: '新增报告',
    accepts: {arg: 'data', type: 'any', required: true, http: {source: 'req'}},
    http: {path: '/add', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  //  删除
  d_report.del = function (req, cb) {
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
    d_report.find({where: where}, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '删除报告失败'
        });
        errLog.error('删除报告失败：' + err);
        return false;
      }
      for (let i = 0; i < rs.length; i++) {
        let path = config.reportUpload + rs[i].file_name;
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }
      d_report.destroyAll(where, function (err, info) {
        if (err) {
          cb(null, {
            ret: 0,
            msg: '删除报告失败'
          });
          errLog.error('删除报告失败：' + err);
          return false;
        }
        let user = req.query.username;
        logs.optLog("删除" + info.count + "条字典", req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress, user);
        cb(null, {
          ret: 1,
          msg: '删除成功'
        });
      })
    });
  };
  d_report.remoteMethod('del', {
    description: '删除报告',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/delete', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  //  批量下载
  d_report.choicesDownload = function (req, res, cb) {
    let data = req.body;
    let files = [];
    let arr = [];
    let zipArchiver = archiver('zip', {
      zlib: {level: 9} // Sets the compression level.
    });
    data.id.split(",").forEach(function (item) {
      arr.push(item);
    });
    d_report.find({where: {id: {inq: arr}}}, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '报告批量下载失败'
        });
        errLog.error('报告批量下载失败：' + err);
        return false;
      }
      for (let i = 0; i < rs.length; i++) {
        let file = config.reportUpload + rs[i].file_name;
        files.push(file);
      }
      for (let j = 0; j < files.length; j++) {
        zipArchiver.append(fs.createReadStream(files[j]), {name: `${rs[j].file_name}`});
      }
      zipArchiver.on('error', function (err) {
        throw err;
      });
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=export' + (new Date()).Format("yyyyMMddhhmmss") + '.zip'
      });
      zipArchiver.finalize();
      zipArchiver.pipe(res);
      let user = req.query.username;
      logs.optLog("导出" + rs.length + "条报告", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
    });
  };
  d_report.remoteMethod('choicesDownload', {
    description: '批量下载报告',
    accepts: [
      {arg: 'req', type: 'object', required: true, 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}}
    ],
    returns: {},
    http: {path: '/choicesDownload', verb: 'post'}
  });

  //  全部下载
  d_report.searchDownload = function (req, res, cb) {
    let data = req.body;
    let files = [];
    let zipArchiver = archiver('zip', {
      zlib: {level: 9} // Sets the compression level.
    });
    let filter = {
      order: '_id DESC',
      where: {}
    };
    if (data.code !== "undefined" && data.code) filter.where.code = {regexp: data.code};
    if (data.name !== "undefined" && data.name) filter.where.name = {regexp: data.name};
    if (data.rtype !== "undefined" && data.rtype) filter.where.rtype = data.rtype;
    if (data.city !== "undefined" && data.city) filter.where.city = {regexp: data.city};
    if (data.area !== "undefined" && data.area) filter.where.area = {regexp: data.area};
    if (data.rtime_start !== "undefined" && data.rtime_end !== "undefined" && data.rtime_start && data.rtime_end) filter.where.rtime = {between: [Number(data.rtime_start), Number(data.rtime_end)]};
    d_report.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('报告查询失败：' + err);
        return false;
      }
      for (let i = 0; i < rs.length; i++) {
        let file = config.reportUpload + rs[i].file_name;
        files.push(file);
      }
      for (let j = 0; j < files.length; j++) {
        zipArchiver.append(fs.createReadStream(files[j]), {name: `${rs[j].file_name}`});
      }
      zipArchiver.on('error', function (err) {
        throw err;
      });
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=export' + (new Date()).Format("yyyyMMddhhmmss") + '.zip'
      });
      zipArchiver.finalize();
      zipArchiver.pipe(res);
      let user = req.query.username;
      logs.optLog("导出" + rs.length + "条报告", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
    });
  };
  d_report.remoteMethod('searchDownload', {
    description: '批量下载报告',
    accepts: [
      {arg: 'req', type: 'object', required: true, 'http': {source: 'req'}},
      {arg: 'res', type: 'object', 'http': {source: 'res'}}
    ],
    returns: {},
    http: {path: '/searchDownload', verb: 'post'}
  });
};


function add(m) {
  return m < 10 ? '0' + m : m
}

//  日期串
function dataString(shijianchuo) { //shijianchuo是整数，否则要parseInt转换
  let time = new Date(shijianchuo);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y.toString() + add(m).toString() + add(d).toString() + add(h).toString() + add(mm).toString() + add(s).toString();
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
  let o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
