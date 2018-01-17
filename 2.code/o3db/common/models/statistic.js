/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: statistic
 * @Description: 统计报表接口
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
let ObjectID = mongodb.ObjectID;
let loopback = require('loopback');
let app = loopback();
let logs = require('../../logServer');
let co = require('co');
let thunkify = require('thunkify');
let acl = require('../../acls/statistic_acl');
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

module.exports = function (statistic) {
  statistic.settings.acls = acl;
  /*统计报表结构查询*/
  statistic.list = function (data, cb) {
    co(function* () {
      let filter = {
        order: 'time_cj ASC',
        where: {}
      };
      let scode = [];
      if (data.time_cj_start !== "undefined" && data.time_cj_start) filter.where.time_cj = Number(data.time_cj_start);
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
      if (data.scode !== "undefined" && data.scode) {
        data.scode.split(",").forEach(function (item) {
          scode.push(item);
        });
      }
      let line_chart = {
        ret: 1,
        msg: '查询成功'
      };
      let param = {
        statistic: statistic,
        filter: filter,
        h_value: [],
        date_interval: data.date_interval,
        time_cj_start: Number(data.time_cj_start),
        time_cj_end: Number(data.time_cj_end),
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
        errLog.error('统计报表查询异常：高度值异常');
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
        errLog.error('统计报表查询异常：未获取高度值');
        return false;
      }
      if (factor.length === 0) {
        cb(null, {
          ret: 0,
          msg: '未获取监测因子'
        });
        errLog.error('统计报表查询异常：未获取监测因子');
        return false;
      }
      for (let j = 0; j < scode.length; j++) {
        let factorData = {};
        param.filter.where.scode = scode[j];
        try {
          let pc = thunkify(pcolor);
          for (let i = 0; i < factor.length; i++) {
            if (factor[i] === 'o3') {
              if (data.date_interval === 'day') param.model = 'd_o3_24h';
              if (data.date_interval === 'week') param.model = 'd_o3_w';
              if (data.date_interval === 'month') param.model = 'd_o3_m';
              // if (data.date_interval === 'quarterly') param.model = 'd_o3_q';
              // if (data.date_interval === 'year') param.model = 'd_o3_y';
              if (!param.model) {
                cb(null, {
                  ret: 0,
                  msg: '获取日期间隔异常'
                });
                errLog.error('统计报表查询异常：获取日期间隔异常');
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
            line_chart[scode[j]] = factorData;
          }
        } catch (e) {
          cb(null, {
            ret: 0,
            msg: '统计报表查询异常'
          });
          errLog.error('统计报表查询异常：' + e);
          return false;
        }
      }
      //  构建数据结构
      let result = {
        ret: 1,
        msg: '查询成功'
      };
      let datas = [];
      for (let s = 0; s < scode.length; s++) {
        let scodeInfo = {};
        scodeInfo.id = s + 1;
        //  查询监测点
        let fsc = thunkify(findscode);
        let fscParam = {
          code:scode[s],
          statistic:statistic
        };
        let scName;
        let sc_callback = yield fsc(fscParam);
        if(sc_callback){
          scName = sc_callback.name;
        }else {
          cb(null,{
            ret:0,
            msg:'获取监测点失败'
          });
          return false;
        }
        scodeInfo.site = scName;
        scodeInfo.factor = factor;
        for (let h = 0; h < param.h_value.length; h++) {
          let height = param.h_value[h];
          let hToString;
          if (height === config.lowHeight) hToString = 'low';
          else hToString = height.toString();
          let text_index = 'text_' + hToString;
          scodeInfo[text_index] = [];
        }
        for (let f = 0; f < factor.length; f++) {
          let fa = factor[f];
          for (let h = 0; h < param.h_value.length; h++) {
            let height = param.h_value[h];
            let hToString;
            if (height === config.lowHeight) hToString = 'low';
            else hToString = height.toString();
            let text_index = 'text_' + hToString;
            if(JSON.stringify(line_chart[scode[s]][fa])!=='{}'){
              scodeInfo[text_index].push(line_chart[scode[s]][fa][height][0][1]);
            }else {
              scodeInfo[text_index].push('-');
            }
          }
        }
        datas.push(scodeInfo);
      }
      result['datas'] = datas;
      cb(null, result);
    });
  };
  statistic.remoteMethod('list', {
    description: '统计报表数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

function pcolor(param, callback) {
  let table = param.model;
  let data = {};
  let dataUpIndex;
  param.statistic.app.models[table].find(param.filter, function (err, rs) {
    if (err) {
      callback(null, []);
      errLog.error('统计报表查询异常：' + err);
      return false;
    }else {
      if(rs.length===0){
        callback(null, data);
      }else {
        for (let j = 0; j < param.h_value.length; j++) {
          let h_value = param.h_value[j];
          let h_j = 'h_' + h_value.toString();
          let point = [];
          let k = param.time_cj_start;
          let rs_index;
          for (let i = 0; i < rs.length; i++) {
            let rsobjet = rs[i];
            if (k === rsobjet.time_cj) {
              rs_index = i;
            }
          }
          if (rs_index || rs_index === 0) {
            point.push([k, rs[rs_index][h_j] === null ? 0 : rs[rs_index][h_j]]);
          } else {
            point.push([k, 0]);
          }
          data[h_value] = point
        }
        callback(null, data);
      }
    }

  });
}

function findscode(param, callback) {
  param.statistic.app.models.b_site.find({where:{code:param.code}},function (err, rs) {
    if(err){
      callback(null,false);
      errLog.error('统计报表获取监测点失败：'+err);
    }else {
      if(rs.length===0){
        callback(null,false);
        errLog.error('统计报表获取监测点失败：无数据');
      }else {
        callback(null,rs[0]);
      }
    }
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
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y.toString() + "-" + add0(m).toString() + "-" + add0(d).toString() + " " + add0(h).toString() + ":00:00";
}
