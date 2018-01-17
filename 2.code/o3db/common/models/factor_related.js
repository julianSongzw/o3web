/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: factor_related
 * @Description: 因子相关性接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/12
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
let acl = require('../../acls/factor_related_acl');
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

module.exports = function (factor_related) {
  factor_related.settings.acls = acl;
  /*相关性结构查询*/
  factor_related.list = function (data, cb) {
    co(function* () {
      let filter = {
        order: 'time_cj ASC',
        where: {}
      };
      data.date_interval = 'day';
      let scode = [];
      if (data.atype !== "undefined" && data.atype) filter.where.atype = {regexp: data.atype};
      if (data.time_cj_start !== "undefined" && data.time_cj_end !== "undefined" && data.time_cj_start && data.time_cj_end) filter.where.time_cj = {between: [Date.parse(new Date(hourFormat(parseInt(Number(data.time_cj_start) / 1000) * 1000 + 3600 * 1000))), Date.parse(new Date(hourFormat(parseInt((Number(data.time_cj_end)) / 1000) * 1000)))]};
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
      let time_cj_start = parseInt(Number(data.time_cj_start) / 1000) * 1000 + 3600 * 1000;
      // let time_start = new Date(time_cj_start);
      // let mm_start = time_start.getMinutes();
      // let start_index = parseInt(mm_start/config.sourceInterval);
      time_cj_start = Date.parse(new Date(hourFormat(time_cj_start)));
      let time_cj_end = parseInt((Number(data.time_cj_end)) / 1000) * 1000;
      // let time_end = new Date(time_cj_end);
      // let mm_end = time_end.getMinutes();
      // let end_index = parseInt(mm_end/config.sourceInterval);
      time_cj_end = Date.parse(new Date(hourFormat(time_cj_end)));
      let param = {
        factor_related: factor_related,
        filter: filter,
        h_value: [],
        date_interval: data.date_interval,
        time_cj_start: time_cj_start,
        time_cj_end: time_cj_end,
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
        errLog.error('相关性查询异常：高度值异常');
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
        errLog.error('相关性查询异常：未获取高度值');
        return false;
      }
      if (factor.length === 0) {
        cb(null, {
          ret: 0,
          msg: '未获取监测因子'
        });
        errLog.error('相关性查询异常：未获取监测因子');
        return false;
      }
      for (let j = 0; j < scode.length; j++) {
        let factorData = {};
        param.filter.where.scode = scode[j];
        try {
          let pc = thunkify(pcolor);

          for (let i = 0; i < factor.length; i++) {

            if (factor[i] === 'o3') {
              if (data.date_interval === 'day') param.model = 'd_o3_1h';
              if (data.date_interval === 'week') param.model = 'd_o3_1h';
              if (!param.model) {
                cb(null, {
                  ret: 0,
                  msg: '获取日期间隔异常'
                });
                errLog.error('相关性查询异常：获取日期间隔异常');
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
            msg: '相关性查询异常'
          });
          errLog.error('相关性查询异常：' + e);
          return false;
        }
        result[scode[j]] = factorData;
      }

      // 关联的国控点信息
      for (let s = 0; s < scode.length; s++) {
        let gkObject = {};
        //  取关联的国控点
        let gk;
        try {
          let fgk = thunkify(findGK);
          let param = {
            factor_related: factor_related,
            site: scode[s]
          };
          let gk_list = yield fgk(param);
          if (gk_list) {
            if (gk_list.length === 0) {
              errLog.error('相关性查询获取国控点异常：该监测点未关联国控点');
            } else {
              gk = gk_list[0].union_gk;
            }
          } else {
            cb(null, {
              ret: 0,
              msg: '相关性查询获取国控点失败'
            });
          }

          if (gk) {
            //  查询国控点对应因子值
            let gkf = thunkify(gkfactor);
            let gkArr = [];
            gk.split(",").forEach(function (item) {
              gkArr.push(item);
            });
            for (let gki = 0; gki < gkArr.length; gki++) {

              let param = {
                scode: gkArr[gki],
                time_cj_start: time_cj_start,
                time_cj_end: time_cj_end,
                factor_related: factor_related,
                factor: factor
              };
              let gkInfo = yield gkf(param);
              let gkfactor = {};
              if (gkInfo) {
                for (let i = 0; i < factor.length; i++) {
                  gkfactor[factor[i]] = gkInfo[factor[i]];
                }
              } else {
                errLog.error('相关性查询无国控点数据');
              }
              gkObject[gkArr[gki]] = gkfactor;
              //  查询国控点大气监测数据
              let gkw = thunkify(gkweather);
              let gkwParam = {
                factor_related: factor_related,
                time_cj_start: time_cj_start,
                time_cj_end: time_cj_end,
                scode: gkArr[gki]
              };
              let gkwInfo = yield gkw(gkwParam);
              if (gkwInfo) {
                gkObject[gkArr[gki]]['weather'] = gkwInfo;
              } else {
                gkObject[gkArr[gki]]['weather'] = [];
              }
            }

          }
          result['gk'] = gkObject;
        }
        catch (e) {
          cb(null, {
            ret: 0,
            msg: '相关性查询获取国控点异常'
          });
          errLog.error('相关性查询获取国控点异常：' + e);
        }
      }
      cb(null, result);
    });
  };
  factor_related.remoteMethod('list', {
    description: '因子相关性数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

function pcolor(param, callback) {
  let table = param.model;
  let data = {};
  let dataUpIndex;
  if (param.date_interval === 'day') dataUpIndex = config.weekDataUpIndex;
  if (param.date_interval === 'week') dataUpIndex = config.weekDataUpIndex;
  param.factor_related.app.models[table].find(param.filter, function (err, rs) {
    if (err) {
      callback(null, []);
      errLog.error('折线图查询异常：' + err);
      return false;
    } else {
      for (let j = 0; j < param.h_value.length; j++) {
        let h_value = param.h_value[j];
        let h_j = 'h_' + h_value.toString();
        let point = [];
        for (let k = param.time_cj_start; k < param.time_cj_end; k = k + dataUpIndex) {
          let rs_index;
          for (let i = 0; i < rs.length; i++) {
            let rsobjet = rs[i];
            if (k === rsobjet.time_cj) {
              rs_index = i;
            }
          }
          if (rs_index || rs_index === 0) {
            point.push(rs[rs_index][h_j] === null ? 0 : rs[rs_index][h_j]);
          } else {
            point.push(0);
          }
        }
        data[h_value] = point
      }
      callback(null, data);
    }
  });
}

//  查询关联国控点
function findGK(param, callback) {
  param.factor_related.app.models.o_device.find({where: {site: param.site}}, function (err, rs) {
    if (err) {
      callback(null, false);
      errLog.error('相关性查询获取国控点失败：' + err);
      return false;
    }
    callback(null, rs);
  });
}

//  查询国控点因子值
function gkfactor(param, callback) {
  let where = {
    scode: param.scode,
  };
  where.time_cj = {between: [Number(param.time_cj_start), Number(param.time_cj_end) - 1000]};
  let data = {};
  let dataUpIndex = config.weekDataUpIndex;
  param.factor_related.app.models.d_air.find({order: 'time_cj ASC', where: where}, function (err, rs) {
    if (err) {
      callback(null, false);
    } else {
      for (let f = 0; f < param.factor.length; f++) {
        let point = [];
        for (let k = param.time_cj_start; k < param.time_cj_end; k = k + dataUpIndex) {
          let rs_index;
          for (let i = 0; i < rs.length; i++) {
            let rsobjet = rs[i];
            if (k === rsobjet.time_cj) {
              rs_index = i;
            }
          }
          if (rs_index || rs_index === 0) {
            point.push(rs[rs_index][param.factor[f]] === null ? 0 : rs[rs_index][param.factor[f]]);
          } else {
            point.push(0);
          }
        }
        data[param.factor[f]] = point;
      }
      callback(null, data);
    }
  });
}

//大气监测查询
function gkweather(param, callback) {
  let whereS = {
    code: param.scode,
  };
  let whereW = {};
  //  查询国控点所属城市编号
  param.factor_related.app.models.b_site.find({where: whereS}, function (err, rs) {
    if (err) {
      callback(null, false);
    } else {
      if (rs.length === 0) callback(null, false);
      else {
        whereW.scity = rs[0].city;
        whereW.time_cj = {between: [Number(param.time_cj_start), Number(param.time_cj_end) - 1000]};
        //  查询大气数据
        param.factor_related.app.models.d_weather.find({order: 'time_cj ASC', where: whereW}, function (err, w) {
          if (err) {
            callback(null, false);
          } else {
            let point = [];
            for (let k = param.time_cj_start; k < param.time_cj_end; k = k + config.weekDataUpIndex) {
              let w_index;
              for (let i = 0; i < w.length; i++) {
                let rsobjet = w[i];
                if (k === rsobjet.time_cj) {
                  w_index = i;
                }
              }
              if (w_index || w_index === 0) {
                point.push(w[w_index]);
              } else {
                point.push({});
              }
            }
            callback(null, point);
          }
        });
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
