/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: d_cone
 * @Description: 锥形图接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/25
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
let acl = require('../../acls/d_cone_acl');
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
module.exports = function (d_cone) {
  d_cone.settings.acls = acl;
  //  绘制锥形图
  d_cone.line = function (data, cb) {
    co(function* () {
      if (data.scode === "undefined" || !data.scode || data.scode === "null" || data.scode === ''
        || data.h_end === "undefined" || !data.h_end || data.h_end === "null" || data.h_end === ''
        || data.h_start === "undefined" || !data.h_start || data.h_start === "null" || data.h_start === ''
        || data.h_index === "undefined" || !data.h_index || data.h_index === "null" || data.h_index === ''
        || data.factor === "undefined" || !data.factor || data.factor === "null" || data.factor === ''
        || data.time_cj_start === "undefined" || !data.time_cj_start || data.time_cj_start === "null" || data.time_cj_start === ''
        || data.time_cj_end === "undefined" || !data.time_cj_end || data.time_cj_end === "null" || data.time_cj_end === ''
        || data.up_deg === "undefined" || !data.up_deg || data.up_deg === "null" || data.up_deg === ''
        || data.rotate_deg === "undefined" || !data.rotate_deg || data.rotate_deg === "null" || data.rotate_deg === ''
        || data.type === "undefined" || !data.type || data.type === "null" || data.type === ''
        || data.device_code === "undefined" || !data.device_code || data.device_code === "null" || data.device_code === ''
      ) {
        cb(null, {
          ret: 0,
          msg: '参数错误'
        });
        return false;
      }
      let faName;
      let fa = thunkify(findFactor);
      let faParam = {
        fcode: data.factor,
        d_cone: d_cone
      };
      let fa_callback = yield fa(faParam);
      if (fa_callback) {
        data.valueMax = fa_callback.max;
        data.valueMin = fa_callback.min;
        faName = fa_callback.fname;
      } else {
        cb(null, {
          ret: 0,
          msg: '锥形图异常：未获取因子最小值最大值'
        });
        errLog.error('锥形图异常：未获取因子最小值最大值');
      }
      let cl = thunkify(coneLine);
      let cl_callback = yield cl(data);
      if (cl_callback) {
        let cl = JSON.parse(cl_callback);
        let result = cl.ZxtPaintResult;
        result = JSON.parse(result);
        if(result.ret === 1){
          cb(null,result);
        }
      }
    });
  };
  d_cone.remoteMethod('line', {
    description: '获取锥形图',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/line', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  //  锥形图查询
  d_cone.list = function (data, cb) {
    let filter = {
      order:'time DESC',
      where:{}
    };
    if(data.device_code === "undefined" || !data.device_code || data.device_code === "null" || data.device_code === ''
      || data.factor === "undefined" || !data.factor || data.factor === "null" || data.factor === ''
      || data.time === "undefined" || !data.time || data.time === "null" || data.time === ''
    ){
      cb(null,{
        ret:0,
        msg:'参数错误'
      });
      return false;
    }
    filter.where.device_code = data.device_code;
    filter.where.factor = data.factor;
    filter.where.time = Number(data.time);
    d_cone.find(filter,function (err, rs) {
      if(err){
        cb(null,{
          ret:0,
          msg:'锥形图异常'
        });
        errLog.error('锥形图异常：'+err.toString());
        return false;
      }
      cb(null,{
        ret:1,
        datas:rs,
        msg:'查询成功'
      });
    })
  };
  d_cone.remoteMethod('list', {
    description: '锥形图查询',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

function coneLine(param, callback) {
  let warnStr = {};
  warnStr.siteNbr = param.scode;
  warnStr.spanMax = Number(param.h_end);
  warnStr.spanMin = Number(param.h_start);
  warnStr.valueMax = Number(param.valueMax);
  warnStr.valueMin = Number(param.valueMin);
  warnStr.step = Number(param.h_index);
  warnStr.factor = param.factor;
  warnStr.up_deg = Number(param.up_deg);
  warnStr.rotate_deg = Number(param.rotate_deg);
  warnStr.type = Number(param.type);
  warnStr.stime = param.time_cj_start.replace(/ /, "%20");
  warnStr.etime = param.time_cj_end.replace(/ /, "%20");
  warnStr.device_code = param.device_code;
  warnStr = JSON.stringify(warnStr);
  let opt = {
    method: "GET",
    host: config.coneHost,
    port: config.conePort,
    path: '/zxtPaint?warnStr=' + warnStr,
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

/*获取因子最大值最小值*/
function findFactor(param, callback) {
  param.d_cone.app.models.b_factor.find({where: {fcode: param.fcode}}, function (err, rs) {
    if (err) {
      callback(null, false);
      errLog.error('锥形图获取因子最值失败：' + err);
    } else {
      if (rs.length === 0) {
        callback(null, false);
        errLog.error('锥形图获取因子最值失败：无数据');
      } else {
        callback(null, rs[0]);
      }
    }
  });
}
