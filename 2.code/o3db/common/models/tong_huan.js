/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: tong_huan
 * @Description: 同比环比接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/11
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
let acl = require('../../acls/tong_huan_acl');
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

module.exports = function (tong_huan) {
  tong_huan.settings.acls = acl;
  /*折线图结构查询*/
  tong_huan.list = function (data, cb) {
    co(function* () {
      let filter = {
        order: 'time_cj ASC',
        where: {}
      };
      if (data.scode !== "undefined" && data.scode) filter.where.scode = {regexp: data.scode};
      if (data.atype !== "undefined" && data.atype) filter.where.atype = {regexp: data.atype};
      if (data.time_cj_start !== "undefined" && data.time_cj_end !== "undefined" && data.time_cj_start && data.time_cj_end) {
        filter.where.time_cj_start = Number(data.time_cj_start);
        filter.where.time_cj_end = Number(data.time_cj_end);
      }
      if (data.pageSize !== "undefined" && data.pageIndex !== "undefined" && data.pageSize && data.pageIndex) {
        filter.limit = Number(data.pageSize);
        filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
      }
      let factor = [];
      if (data.factor !== "undefined" && data.factor) {
        data.factor.split(",").forEach(function (item) {
          factor.push(item);
        });
      }
      let factorData = {
        ret:1,
        msg:'查询成功'
      };
      try {
        let time_cj_start = parseInt(Number(data.time_cj_start)/1000)*1000;
        let time_start = new Date(time_cj_start);
        let mm_start = time_start.getMinutes();
        let start_index = parseInt(mm_start/5);
        time_cj_start = Date.parse(new Date(hourFormat(time_cj_start)))+start_index*5*60*1000;
        let time_cj_end = parseInt(Number(data.time_cj_end)/1000)*1000;
        let time_end = new Date(time_cj_end);
        let mm_end = time_end.getMinutes();
        let end_index = parseInt(mm_end/5);
        time_cj_end = Date.parse(new Date(hourFormat(time_cj_end)))+end_index*5*60*1000;
        let pc = thunkify(pcolor);
        let param = {
          tong_huan: tong_huan,
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
          errLog.error('同比环比查询异常：高度值异常');
          return false;
        }
        if ((data.h_value === "undefined" || !data.h_value || data.h_value === "null" || data.h_value === "")
          && (data.h_start === "undefined" || !data.h_start || data.h_start === "null" || data.h_start === "")
          && (data.h_end === "undefined" || !data.h_end || data.h_end === "null" || data.h_end === "")
          && (data.h_index === "undefined" || !data.h_index || data.h_index === "null" || data.h_index === "")
        ) {
          cb(null, {
            ret: 0,
            msg: '未获取高度值'
          });
          errLog.error('同比环比查询异常：未获取高度值');
          return false;
        }
        if (factor.length === 0) {
          cb(null, {
            ret: 0,
            msg: '未获取监测因子'
          });
          errLog.error('同比环比查询异常：未获取监测因子');
          return false;
        }
        for (let i = 0; i < factor.length; i++) {
          if (factor[i] === 'o3') {
            param.model = 'd_o3_m';
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
          msg: '同比环比查询异常'
        });
        errLog.error('同比环比查询异常：' + e);
        return false;
      }
      cb(null, factorData);
    });
  };
  tong_huan.remoteMethod('list', {
    description: '同比环比数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

function pcolor(param, callback) {
  let data = {};
  let param_start = param;
  let param_end = param;
  let time_cj_s = param_start.filter.where.time_cj_start;
  let time_cj_e = param_start.filter.where.time_cj_end;
  delete param_start.filter.where['time_cj_start'];
  delete param_start.filter.where['time_cj_end'];
  co(function* () {
    let fd = thunkify(findData);
    //获取早期时间数据
    param_start.filter.where.time_cj = time_cj_s;
    let start_data = yield fd(param_start);
    if(start_data) start_data = start_data[0];
    //获取晚期时间数据
    param_start.filter.where.time_cj = time_cj_e;
    let end_data = yield fd(param_end);
    if(end_data) end_data = end_data[0];
    for (let j = 0; j < param.h_value.length; j++) {
      let h_value = param.h_value[j];
      let h_j = 'h_' + h_value.toString();
      let point = [];
      if(start_data===undefined){
        point[0] = 0
      }else {
        point[0] = start_data[h_j] === null ? 0 : start_data[h_j];
      }
      if(end_data===undefined){
        point[1] = 0
      }else {
        point[1] = end_data[h_j] === null ? 0 : end_data[h_j];
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

function findData(param,callback) {
  param.tong_huan.app.models[param.model].find(param.filter, function (err, rs){
    if(err){
      callback(null,false);
      errLog.error('同比环比查询失败：'+err);
    }else {
      callback(null,rs);
    }
  });
}
