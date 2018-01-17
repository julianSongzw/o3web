/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: line_chart
 * @Description: 折线图接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/6
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
let acl = require('../../acls/line_chart_acl');
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

module.exports = function (line_chart) {
  line_chart.settings.acls = acl;
  /*折线图结构查询*/
  line_chart.list = function (data, cb) {
    co(function* () {
      let filter = {
        order: 'time_cj ASC',
        where: {}
      };
      let scode = [];
      data.date_interval = 'day';
      if (data.atype !== "undefined" && data.atype) filter.where.atype = {regexp: data.atype};
      if (data.time_cj_start !== "undefined" && data.time_cj_end !== "undefined" && data.time_cj_start && data.time_cj_end){
        filter.where.time_cj = {between: [Date.parse(new Date(hourFormat(parseInt(Number(data.time_cj_start)/1000)*1000))), Date.parse(new Date(hourFormat(parseInt((Number(data.time_cj_end))/1000)*1000)))]};
      }
      let factor = [];
      if (data.factor !== "undefined" && data.factor) {
        data.factor.split(",").forEach(function (item) {
          factor.push(item);
        });
      }
      if (data.scode !== "undefined" && data.scode) {
        data.scode.split(",").forEach(function (item) {
          scode.push(item);
        });
      }
      let result = {
        ret: 1,
        msg: '查询成功'
      };
      let time_cj_start,time_cj_end;
      if(data.date_interval==='day'){
        time_cj_start = parseInt(Number(data.time_cj_start) / 1000) * 1000;
        let time_start = new Date(time_cj_start);
        let mm_start = time_start.getMinutes();
        let start_index = parseInt(mm_start / config.sourceInterval);
        time_cj_start = Date.parse(new Date(hourFormat(time_cj_start))) + (start_index + 1) * config.sourceInterval * 60 * 1000;
        time_cj_end = parseInt(Number(data.time_cj_end) / 1000) * 1000;
        let time_end = new Date(time_cj_end);
        let mm_end = time_end.getMinutes();
        let end_index = parseInt(mm_end / config.sourceInterval);
        time_cj_end = Date.parse(new Date(hourFormat(time_cj_end))) + (end_index) * config.sourceInterval * 60 * 1000;
      }
      if(data.date_interval==='week'){
        time_cj_start = parseInt(Number(data.time_cj_start)/1000)*1000;
        time_cj_start = Date.parse(new Date(hourFormat(time_cj_start)));
        time_cj_end = parseInt(Number(data.time_cj_end)/1000)*1000;
        time_cj_end = Date.parse(new Date(hourFormat(time_cj_end)));
      }

      let pc = thunkify(pcolor);
      let param = {
        line_chart: line_chart,
        filter: filter,
        h_value: [],
        date_interval: data.date_interval,
        time_cj_start:time_cj_start,
        time_cj_end:time_cj_end,
      };
      if (data.h_value !== "undefined" && data.h_value && data.h_value !== "null" && data.h_value !== "") {
        param.h_value.push(Number(data.h_value));
      }
      if (data.h_start !== "undefined" && data.h_start && data.h_start !== "null" && data.h_start !== ""
        && data.h_end !== "undefined" && data.h_end && data.h_end !== "null" && data.h_end !== ""
        && data.h_index !== "undefined" && data.h_index && data.h_index !== "null" && data.h_index !== ""
      ) {
        for (let i = Number(data.h_start); i <= Number(data.h_end); i = i + Number(data.h_index)) {
          param.h_value.push(i);
        }
      }
      if (data.h_value !== "undefined" && data.h_value && data.h_value !== "null" && data.h_value !== ""
        && data.h_start !== "undefined" && data.h_start && data.h_start !== "null" && data.h_start !== ""
        && data.h_end !== "undefined" && data.h_end && data.h_end !== "null" && data.h_end !== ""
        && data.h_index !== "undefined" && data.h_index && data.h_index !== "null" && data.h_index !== ""
      ) {
        cb(null, {
          ret: 0,
          msg: '高度值异常'
        });
        errLog.error('折线图查询异常：高度值异常');
        return false;
      }
      if ((data.h_value === "undefined" || !data.h_value || data.h_value === "null" || data.h_value === "")
        && (data.h_start === "undefined" || !data.h_start || data.h_start === "null" || data.h_start === ""
          || data.h_end === "undefined" || !data.h_end || data.h_end === "null" || data.h_end === ""
          || data.h_index === "undefined" || !data.h_index || data.h_index === "null" || data.h_index === "")
      ) {
        cb(null, {
          ret: 0,
          msg: '未获取高度值'
        });
        errLog.error('折线图查询异常：未获取高度值');
        return false;
      }
      if (factor.length === 0) {
        cb(null, {
          ret: 0,
          msg: '未获取监测因子'
        });
        errLog.error('折线图查询异常：未获取监测因子');
        return false;
      }
      for (let j = 0; j < scode.length; j++) {
        let factorData = {};
        param.filter.where.scode = scode[j];
        try {
          for (let i = 0; i < factor.length; i++) {
            if (factor[i] === 'o3') {
              if (data.date_interval === 'day') param.model = 'd_o3radar';
              if (data.date_interval === 'week') param.model = 'd_o3_1h';
              if (data.date_interval === 'month') param.model = 'd_o3_24h';
              if (!param.model) {
                cb(null, {
                  ret: 0,
                  msg: '获取日期间隔异常'
                });
                errLog.error('折线图查询异常：获取日期间隔异常');
                return false;
              }
              factorData[factor[i]] = yield pc(param);
            }
            if (factor[i] === 'o3_8h') {
              param.model = 'd_o3_8h';
              factorData[factor[i]] = yield pc(param);
            }
            if (factor[i] === '532退偏') {
              param.model = 'd_tp';
              factorData[factor[i]] = yield pc(param);
            }
            if (factor[i] === '532消光') {
              param.model = 'd_xg';
              factorData[factor[i]] = yield pc(param);
            }
          }
        } catch (e) {
          cb(null, {
            ret: 0,
            msg: '折线图查询异常'
          });
          errLog.error('折线图查询异常：' + e);
          return false;
        }
        result[scode[j]] = factorData;
      }
      cb(null, result);
    });
  };
  line_chart.remoteMethod('list', {
    description: '折线图数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

function pcolor(param, callback) {
  let table = param.model;
  let data = {};
  let dataUpIndex;
  if(param.date_interval==='day') dataUpIndex=config.dayDataUpIndex;
  if(param.date_interval==='week') dataUpIndex=config.weekDataUpIndex;
  if(param.date_interval==='month') dataUpIndex=config.monthDataUpIndex;
  param.line_chart.app.models[table].find(param.filter, function (err, rs) {
    if (err) {
      callback(null, []);
      errLog.error('折线图查询异常：' + err);
      return false;
    }
    for (let j = 0; j < param.h_value.length; j++) {
      let h_value = param.h_value[j];
      let h_j = 'h_' + h_value.toString();
      let point = [];
      for (let k = param.time_cj_start; k <= param.time_cj_end; k = k + dataUpIndex){
        let rs_index;
        for (let i = 0; i < rs.length; i++) {
          let rsobjet = rs[i];
          if(k===rsobjet.time_cj){
            rs_index = i;
          }
        }
        if(rs_index||rs_index===0){
          point.push([k, rs[rs_index][h_j] === null ? 0 : rs[rs_index][h_j]]);
        }else {
          point.push([k,0]);
        }
      }
      data[h_value] = point
    }
    callback(null, data);
  });
}

function add0(m) {
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
  return add0(h).toString() + add0(mm).toString() + add0(s).toString();
}

function hourFormat(shijianchuo) { //shijianchuo是整数，否则要parseInt转换
  let time = new Date(shijianchuo);
  let y = time.getFullYear();
  let m = time.getMonth()+1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y.toString()+"-"+add0(m).toString()+"-"+add0(d).toString()+" "+add0(h).toString()+":00:00";
}
