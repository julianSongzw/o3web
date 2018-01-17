/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: d_weather
 * @Description: 国控点大气监测数据接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/14
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
let acl = require('../../acls/d_weather_acl');
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
module.exports = function (d_weather) {
  d_weather.settings.acls = acl;
  // 查询风速、风向、气压接口
  d_weather.windChart = function (data, cb) {
    let filter = {
      order: 'time_cj ASC',
      where: {}
    };
    co(function* () {
      if (data.time_cj_start !== "undefined" && data.time_cj_end !== "undefined" && data.time_cj_start && data.time_cj_end) filter.where.time_cj = {between: [Date.parse(new Date(hourFormat(parseInt(Number(data.time_cj_start) / 1000) * 1000))), Date.parse(new Date(hourFormat(parseInt((Number(data.time_cj_end)) / 1000) * 1000)))]};
      if (data.scode !== "undefined" && data.scode) {
        //查询监测点关联国控点
        try {
          let fgk = thunkify(findGK);
          let param = {
            d_weather: d_weather,
            site: data.scode
          };
          let result = {
            ret: 1,
            msg: '查询成功'
          };
          let gk_list = yield fgk(param);
          if (gk_list) {
            if (gk_list.length === 0) {
              errLog.error('风速查询获取国控点异常：该监测点未关联国控点');
            } else {
              let a;
              gk_list[0]['union_gk_info'].get(function (err, rs) {
                a = rs;
                filter.where.scity = a.city;
                d_weather.find(filter, function (err, rs) {
                  if (err) {
                    cb(null, errColMsg);
                    errLog.error('风速查询失败：' + err);
                    return false;
                  } else {
                    if (rs.length === 0) {
                      cb(null, {
                        ret: 0,
                        msg: '风速查询：无数据'
                      })
                    } else {
                      let datas = [];
                      for (let i = 0; i < rs.length; i++) {
                        let R, time, waveHeight, windSpeed;
                        switch (rs[i].dir) {
                          case '北风':
                            R = 'N';
                            break;
                          case '东北风':
                            R = 'NE';
                            break;
                          case '东风':
                            R = 'E';
                            break;
                          case '东南风':
                            R = 'SE';
                            break;
                          case '南风':
                            R = 'S';
                            break;
                          case '西南风':
                            R = 'SW';
                            break;
                          case '西风':
                            R = 'W';
                            break;
                          case '西北风':
                            R = 'NW';
                            break;
                        }
                        time = rs[i].time_cj;
                        waveHeight = rs[i].pres;
                        windSpeed = rs[i].spd;
                        datas.push({R: R, time: time, waveHeight: waveHeight, windSpeed: windSpeed});
                      }
                      result.datas = datas;
                      cb(null, result);
                    }
                  }
                });
              });
            }
          } else {
            cb(null, {
              ret: 0,
              msg: '风速查询获取国控点失败'
            });
          }
        } catch (e) {
          cb(null, {
            ret: 0,
            msg: '风速查询获取国控点失败'
          });
          errLog.error('风速查询获取国控点失败：' + e);
          return false;
        }
      }
    });
  };
  d_weather.remoteMethod('windChart', {
    description: '风速风向查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/windChart', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  d_weather.windMap = function (data, cb) {
    co(function* () {
      let filter = {
        order: 'time_cj ASC',
        where: {}
      };
      if(data.time_cj === "undefined" || !data.time_cj || data.time_cj === "null" || data.time_cj === ''){
        cb(null,{
          ret:0,
          msg:'参数错误'
        });
        return false;
      }
      filter.where.time_cj = Number(data.time_cj);
      let result = {
        ret:1,
        msg:'查询成功'
      };
      //  查询风场数据
      let fw_callback;
      try {
        let fw = thunkify(findWindData);
        let fwParam = {
          d_weather:d_weather,
          filter:filter
        };
        fw_callback = yield fw(fwParam);
        if(!fw_callback){
          cb(null,{
            ret:0,
            msg:'风场数据查询失败'
          });
          return false;
        }
        if(fw_callback.length===0){
          cb(null,{
            ret:0,
            msg:'当前时间点无数据'
          });
          return false;
        }
      }catch (e){
        cb(null,{
          ret:0,
          msg:'风场数据查询失败'
        });
        errLog.error('查询风场数据失败：'+e.toString());
        return false;
      }
      //  查询对应国控点经纬度
      let datas = [];
      try {
        for(let i=0;i<fw_callback.length;i++){
          let d = [];
          let scode = fw_callback[i].scode;
          let fgk = thunkify(findGKPosition);
          let fgkParam = {
            d_weather:d_weather,
            code:scode
          };
          let fgk_callback = yield fgk(fgkParam);
          if(fgk_callback){
            d.push(fgk_callback.longitude);
            d.push(fgk_callback.latitude);
            d.push(fw_callback[i].deg);
            d.push(fw_callback[i].spd);
            datas.push(d);
          }else {
            cb(null,{
              ret:0,
              msg:'查询风场数据失败'
            });
            return false;
          }
        }
      }catch (e){
        cb(null,{
          ret:0,
          msg:'风场数据查询失败'
        });
        errLog.error('查询风场数据失败：'+e.toString());
        return false;
      }
      result.datas = datas;
      cb(null,result);
    });
  };
  d_weather.remoteMethod('windMap', {
    description: '风场图查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/windMap', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

//  查询关联国控点
function findGK(param, callback) {
  param.d_weather.app.models.o_device.find({
    include: 'union_gk_info',
    where: {site: param.site}
  }, function (err, rs) {
    if (err) {
      callback(null, false);
      errLog.error('相关性查询获取国控点失败：' + err);
      return false;
    }
    callback(null, rs);
  });
}

function findWindData(param, callback) {
  param.d_weather.find(param.filter,function (err, rs) {
    if(err){
      errLog.error('风场数据查询失败：'+err.toString());
      callback(null,false);
    }else {
      callback(null,rs);
    }
  })
}

function findGKPosition(param, callback) {
  param.d_weather.app.models.b_site.find({where:{code:param.code}},function (err, rs) {
    if(err){
      callback(null,false);
      errLog.error('风场数据查询获取国控点位置失败：'+err.toString());
    }else {
      if(rs.length===0){
        callback(null,false);
        errLog.error('风场数据查询获取国控点位置异常：未找到该国控点'+param.code);
      }else {
        callback(null,rs[0]);
      }
    }
  })
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
