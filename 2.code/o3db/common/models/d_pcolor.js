/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: d_pcolor
 * @Description: 伪彩图接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/15
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
let acl = require('../../acls/d_pcolor_acl');
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
module.exports = function (d_pcolor) {
  d_pcolor.settings.acls = acl;
  /*对不同检测因子进行伪彩图数据结构查询*/
  d_pcolor.list = function (data, cb) {
    co(function* () {
      if (data.scode === "undefined" || !data.scode || data.scode === "null" || data.scode === ''
        || data.h_end === "undefined" || !data.h_end || data.h_end === "null" || data.h_end === ''
        || data.h_start === "undefined" || !data.h_start || data.h_start === "null" || data.h_start === ''
        || data.h_index === "undefined" || !data.h_index || data.h_index === "null" || data.h_index === ''
        || data.factor === "undefined" || !data.factor || data.factor === "null" || data.factor === ''
        || data.time_cj_start === "undefined" || !data.time_cj_start || data.time_cj_start === "null" || data.time_cj_start === ''
        || data.time_cj_end === "undefined" || !data.time_cj_end || data.time_cj_end === "null" || data.time_cj_end === '') {
        cb(null, {
          ret: 0,
          msg: '参数错误'
        });
        return false;
      }
      let time_cj_s = data.time_cj_start;
      let time_cj_e = data.time_cj_end;
      //  查询监测点
      let fsc = thunkify(findscode);
      let fscParam = {
        code: data.scode,
        d_pcolor: d_pcolor
      };
      let scName;
      let sc_callback = yield fsc(fscParam);
      if (sc_callback) {
        scName = sc_callback.name;
      } else {
        cb(null, {
          ret: 0,
          msg: '获取监测点失败'
        });
        return false;
      }
      // 获取因子最小值与最大值
      let faName;
      let fa = thunkify(findFactor);
      let faParam = {
        fcode: data.factor,
        d_pcolor: d_pcolor
      };
      let fa_callback = yield fa(faParam);
      if (fa_callback) {
        data.valueMax = fa_callback.max;
        data.valueMin = fa_callback.min;
        faName = fa_callback.fname;
      } else {
        cb(null, {
          ret: 0,
          msg: '伪彩图异常：未获取因子最小值最大值'
        });
      }
      //  获取各时间点浓度最值
      let time_cj_start = parseInt(Number(Date.parse(new Date(time_cj_s))) / 1000) * 1000;
      let time_start = new Date(time_cj_start);
      let mm_start = time_start.getMinutes();
      let start_index = parseInt(mm_start / config.sourceInterval);
      time_cj_start = Date.parse(new Date(hourFormat(time_cj_start))) + (start_index + 1) * config.sourceInterval * 60 * 1000;
      let time_cj_end = parseInt((Number(Date.parse(new Date(time_cj_e)))) / 1000) * 1000;
      let time_end = new Date(time_cj_end);
      let mm_end = time_end.getMinutes();
      let end_index = parseInt(mm_end / config.sourceInterval);
      time_cj_end = Date.parse(new Date(hourFormat(time_cj_end))) + (end_index) * config.sourceInterval * 60 * 1000;
      let ex = thunkify(extremum);
      let table;
      if (data.factor === 'o3') {
        table = 'd_o3radar';
      }
      if (data.factor === 'o3_8h') {
        table = 'd_o3_8h';
      }
      if (data.factor === '532退偏') {
        table = 'd_tp';
      }
      if (data.factor === '532消光') {
        table = 'd_xg';
      }
      let result;
      let exParam = {
        scode: data.scode,
        table: table,
        time_cj_start: time_cj_start,
        time_cj_end: time_cj_end,
        d_pcolor: d_pcolor,
        h_start: data.h_start,
        h_end: data.h_end,
        h_index: data.h_index
      };
      let ex_callback = yield ex(exParam);
      let extremumObj;
      if (ex_callback) {
        extremumObj = ex_callback;
      } else {
        extremumObj = {};
      }
      //  画图
      let pc = thunkify(pcolor);
      let pc_callback = yield pc(data);
      if (pc_callback) {
        let pcolor = JSON.parse(pc_callback);
        result = pcolor.WctPaintResult;
        result = JSON.parse(result);
        result.extremum = extremumObj;
        result.factor = data.factor;
        result.fname = faName;
        result.scode = data.scode;
        result.sname = scName;
        cb(null, result);
      } else {
        cb(null, {
          ret: 0,
          msg: '伪彩图异常'
        });
        return false;
      }
    });

  };
  d_pcolor.remoteMethod('list', {
    description: '伪彩图数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*廓线图*/
  d_pcolor.line = function (data, cb) {
    if (data.scode === "undefined" || !data.scode || data.scode === "null" || data.scode === ''
      || data.h_end === "undefined" || !data.h_end || data.h_end === "null" || data.h_end === ''
      || data.h_start === "undefined" || !data.h_start || data.h_start === "null" || data.h_start === ''
      || data.h_index === "undefined" || !data.h_index || data.h_index === "null" || data.h_index === ''
      || data.factor === "undefined" || !data.factor || data.factor === "null" || data.factor === ''
      || data.time_cj === "undefined" || !data.time_cj || data.time_cj === "null" || data.time_cj === '') {
      cb(null, {
        ret: 0,
        msg: '参数错误'
      });
      return false;
    }
    let filter = {
      order: 'time_cj ASC',
      where: {}
    };
    let table, h_value = [];
    let dataUpIndex = config.sourceInterval * 60 * 1000;
    if (data.time_cj !== "undefined" && data.time_cj) {
      filter.where.time_cj = Number(data.time_cj);
    }
    if (data.factor !== "undefined" && data.factor) {
      if (data.factor === 'o3') {
        table = 'd_o3radar';
      }
      if (data.factor === 'o3_8h') {
        table = 'd_o3_8h';
      }
      if (data.factor === '532退偏') {
        table = 'd_tp';
      }
      if (data.factor === '532消光') {
        table = 'd_xg';
      }
    }
    if (data.scode !== "undefined" && data.scode) {
      filter.where.scode = data.scode;
    }
    if (data.h_value !== "undefined" && data.h_value && data.h_value !== "null" && data.h_value !== "") {
      h_value.push(Number(data.h_value));
    }
    if (data.h_start !== "undefined" && data.h_start && data.h_start !== "null" && data.h_start !== ""
      && data.h_end !== "undefined" && data.h_end && data.h_end !== "null" && data.h_end !== ""
      && data.h_index !== "undefined" && data.h_index && data.h_index !== "null" && data.h_index !== ""
    ) {
      for (let i = Number(data.h_start); i <= Number(data.h_end); i = i + Number(data.h_index)) {
        h_value.push(i);
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
      errLog.error('伪彩图廓线图查询异常：高度值异常');
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
      errLog.error('伪彩图廓线图查询异常：未获取高度值');
      return false;
    }
    let result = {
      ret: 1,
      msg: '查询成功'
    };
    let datas = {};
    d_pcolor.app.models[table].find(filter, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '伪彩图廓线图数据获取失败'
        });
        errLog.error('伪彩图廓线图数据获取失败：' + err);
      } else {
        if (rs.length === 0) {
          cb(null, {
            ret: 1,
            datas:{},
            msg: '无数据'
          });
        } else {
          for (let j = 0; j < h_value.length; j++) {
            let h_h = 'h_' + h_value[j].toString();
            if (rs[0][h_h] !== null && rs[0][h_h] !== undefined) {
              datas[h_h] = rs[0][h_h];
            }else {
              datas[h_h] = null;
            }
          }
          cb(null,{
            ret:1,
            datas:datas,
            msg:'查询成功'
          });
        }
      }
    });
  };
  d_pcolor.remoteMethod('line', {
    description: '伪彩图廓线图数据格式',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/line', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  d_pcolor.dataList = function (data, cb) {
    let filter = {
      order: 'time_cj ASC',
      where: {}
    };
    let param = {
      d_pcolor: d_pcolor,
      filter: filter,
    };
    if (data.scode !== "undefined" && data.scode) filter.where.scode = {regexp: data.scode};
    if (data.device_code !== "undefined" && data.device_code) filter.where.device_code = {regexp: data.device_code};
    if (data.atype !== "undefined" && data.atype) filter.where.atype = {regexp: data.atype};
    if (data.time_cj_start !== "undefined" && data.time_cj_end !== "undefined" && data.time_cj_start && data.time_cj_end) filter.where.time_cj = {between: [Number(data.time_cj_start), Number(data.time_cj_end)]};
    if(data.factor !== "undefined" && data.factor){
      if(data.factor==='o3'){
        param.table = 'd_o3radar'
      }
      if(data.factor==='tp'){
        param.table = 'd_tp'
      }
      if(data.factor==='xg'){
        param.table = 'd_xg'
      }
    }
    if (!param.table){
      cb(null,{
        ret:0,
        msg:'因子错误'
      });
      return false;
    }
    co(function* () {
      let pc = thunkify(getData);
      let pc_result = yield pc(param);
      if(pc_result){
        cb(null,{
          ret:1,
          timeArr:pc_result.timeArr,
          valueArr:pc_result.valueArr,
          msg:'查询成功'
        });
      }else {
        cb(null,{
          ret:0,
          msg:'查询失败'
        })
      }
    });
  };
  d_pcolor.remoteMethod('dataList', {
    description: '伪彩图基础数据查询',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/baseData', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

/*画图*/
function pcolor(param, callback) {
  let warnStr = {};
  warnStr.siteNbr = param.scode;
  warnStr.spanMax = Number(param.h_end);
  warnStr.spanMin = Number(param.h_start);
  warnStr.valueMax = Number(param.valueMax);
  warnStr.valueMin = Number(param.valueMin);
  warnStr.step = Number(param.h_index);
  warnStr.factor = param.factor;
  warnStr.stime = param.time_cj_start.replace(/ /, "%20");
  warnStr.etime = param.time_cj_end.replace(/ /, "%20");
  warnStr = JSON.stringify(warnStr);
  let opt = {
    method: "GET",
    host: config.pcolorHost,
    port: config.pcolorPort,
    path: '/wctPaint?warnStr=' + warnStr,
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
  param.d_pcolor.app.models.b_factor.find({where: {fcode: param.fcode}}, function (err, rs) {
    if (err) {
      callback(null, false);
      errLog.error('伪彩图获取因子最值失败：' + err);
    } else {
      if (rs.length === 0) {
        callback(null, false);
        errLog.error('伪彩图获取因子最值失败：无数据');
      } else {
        callback(null, rs[0]);
      }
    }
  });
}

/*获取各时间点浓度极值*/
function extremum(param, callback) {
  let filter = {
    order: 'time_cj ASC',
    where: {}
  };
  let table = param.table;
  let dataUpIndex = config.sourceInterval * 60 * 1000;
  let data = {};
  filter.where.scode = param.scode;
  filter.where.time_cj = {between: [param.time_cj_start, param.time_cj_end]};
  param.d_pcolor.app.models[table].find(filter, function (err, rs) {
    if (err) {
      callback(null, false);
      errLog.error('伪彩图获取最值异常：' + err);
    } else {
      if (rs.length === 0) {
        for (let k = param.time_cj_start; k <= param.time_cj_end; k = k + dataUpIndex) {
          data[k] = {}
        }
        callback(null, data);
        errLog.error('伪彩图获取最值异常：无数据');
      } else {
        for (let k = param.time_cj_start; k <= param.time_cj_end; k = k + dataUpIndex) {
          let rs_index;
          for (let i = 0; i < rs.length; i++) {
            let rsobjet = rs[i];
            if (k === rsobjet.time_cj) {
              rs_index = i;
            }
          }
          let max = {};
          let min = {};
          if (rs_index || rs_index === 0) {
            //  计算最值
            let maxValue, minValue;
            let valueArr = [];
            let value = [];
            let maxIndex = [], minIndex = [];
            for (let j = Number(param.h_start); j <= Number(param.h_end); j = j + Number(param.h_index)) {
              let h_h = 'h_' + j.toString();
              if (rs[rs_index][h_h] !== null && rs[rs_index][h_h] !== undefined) {
                valueArr.push([j, rs[rs_index][h_h]]);
              }
            }
            for (let x = 0; x < valueArr.length; x++) {
              value.push(valueArr[x][1]);
            }
            maxValue = Math.max.apply(Math, value);
            minValue = Math.min.apply(Math, value);
            for (let y = 0; y < value.length; y++) {
              if (value[y] === maxValue) {
                maxIndex.push(y);
              }
              if (value[y] === minValue) {
                minIndex.push(y);
              }
            }
            let maxh, minh, maxhArr = [], minhArr = [];
            for (let maxv = 0; maxv < maxIndex.length; maxv++) {
              maxhArr.push(valueArr[maxIndex[maxv]][0]);
            }
            maxh = maxhArr.join(',');
            for (let minv = 0; minv < minIndex.length; minv++) {
              minhArr.push(valueArr[minIndex[minv]][0]);
            }
            minh = minhArr.join(',');
            max['height'] = maxh;
            max['value'] = maxValue;
            min['height'] = minh;
            min['value'] = minValue;
            data[k] = {
              max: max,
              min: min
            }
          } else {
            data[k] = {
              max: max,
              min: min
            }
          }
        }
        callback(null, data);
      }
    }
  });
}

function findscode(param, callback) {
  param.d_pcolor.app.models.b_site.find({where: {code: param.code}}, function (err, rs) {
    if (err) {
      callback(null, false);
      errLog.error('伪彩图获取监测点失败：' + err);
    } else {
      if (rs.length === 0) {
        callback(null, false);
        errLog.error('伪彩图获取监测点失败：无数据');
      } else {
        callback(null, rs[0]);
      }
    }
  });
}

/*日期格式*/
function add0(m) {
  return m < 10 ? '0' + m : m
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

function getData(param,callback) {
  let table = param.table;
  let data = {};
  param.d_pcolor.app.models[table].find(param.filter,function (err, rs) {
    if(err){
      callback(null,false);
      errLog.error('伪彩图获取基础数据失败：'+err);
    }else {
      if(rs.length ===0){
        callback(null,false);
        errLog.error('伪彩图获取基础数据失败：无数据');
      }else {
        let arr = [],timeArr = [];
        for (let i = 0; i < rs.length; i++) {
          let h_value = [];
          for (let j = config.h_start; j < config.h_end; j = j + config.h_index) {
            h_value.push(rs[i]['h_' + j.toString()] === null ? 0 : rs[i]['h_' + j.toString()]);
          }
          timeArr.push(rs[i].time_cj);
          arr.push(h_value);
        }
        data.valueArr = arr;
        data.timeArr = timeArr;
        callback(null,data);
      }
    }
  })
}
