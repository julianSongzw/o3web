/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: wind_rose
 * @Description: 风玫瑰图接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/22
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
let ObjectID = mongodb.ObjectID;
let loopback = require('loopback');
let app = loopback();
let logs = require('../../logServer');
let co = require('co');
let thunkify = require('thunkify');
let acl = require('../../acls/wind_rose_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let http = require('http');
let errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
let errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};
module.exports = function (wind_rose) {
  wind_rose.settings.acl = acl;
  wind_rose.list = function (data, cb) {
    co(function* () {
      let result;
      //  画图
      let pc = thunkify(pcolor);
      let pc_callback = yield pc(data);
      if (pc_callback) {
        let pcolor = JSON.parse(pc_callback);
        result = pcolor.MgtPaintResult;
        result = JSON.parse(result);
      } else {
        cb(null, {
          ret: 0,
          msg: '玫瑰图异常'
        });
        return false;
      }
      cb(null, result);
    });
  };
  wind_rose.remoteMethod('list', {
    description: '风玫瑰图数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

/*画图*/
function pcolor(param, callback) {
  let warnStr = {};
  warnStr = JSON.stringify(warnStr);
  let opt = {
    method: "GET",
    host: config.pcolorHost,
    port: config.pcolorPort,
    path: '/mgtPaint?warnStr=' + warnStr,
    headers: {
      "Content-Type": 'application/json'
    }
  };
  let requ = http.request(opt, function (serverFeedback) {
    if (serverFeedback.statusCode === 200) {
      let body = [];
      serverFeedback.on('data', function (data) {
        body.push(data);
      }).on('end', function () {
        let data = Buffer.concat(body).toString();
        callback(null, data);
      });
    }
    else {
      callback('error', null)
    }
  });
  requ.end('');
  requ.on('error', function (e) {
    callback('Error got: ' + e.message, null);
  });
}
