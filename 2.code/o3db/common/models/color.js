/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: color
 * @Description: 监测因子颜色范围接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/18
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
let acl = require('../../acls/time_to_time_acl');
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
module.exports = function (color) {
  color.list = function (data, cb) {
    let filter = {
      where: {}
    };
    // if (!data.factor || data.factor === "undefined" || data.factor === "") {
    //   cb(null, errParamMsg);
    //   return false;
    // }
    // filter.where.fcode = data.factor;

    color.app.models.b_factor.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('颜色范围获取失败：' + err);
        return false;
      } else {
        if (rs.length === 0) {
          cb(null, {
            ret: 0,
            msg: '未找到因子'
          });
          errLog.error('颜色范围获取失败：未找到因子');
          return false;
        } else {
          let result = {
            ret:1,
            msg:'查询成功'
          };
          for(let f=0;f<rs.length;f++){
            let colorArr = [];
            if(rs[f].frange===''||!rs[f].frange){
              result[rs[f].fcode] = [];
            }else {
              rs[f].frange.split("|").forEach(function (item) {
                let arr = [];
                item.split(',').forEach(function (i) {
                  arr.push(i);
                });
                colorArr.push(arr);
              });
              let rgbMin, colorIndex;
              colorIndex = config.o3colorIndex;
              let fcolor = [];
              for (let j = 0; j < colorArr.length; j++) {
                let r, g, b;
                if (j === 0) {
                  rgbMin = '#00ff00';
                } else {
                  rgbMin = colorArr[j - 1][2];
                }
                let rb = parseInt(rgbMin.slice(1, 3), 16);  //r开始值
                let re = parseInt(colorArr[j][2].slice(1, 3), 16); //r结束值
                let rbe, ri;
                if (re > rb) {
                  rbe = (re - rb + 1) / colorIndex - 1;
                  ri = 1;
                }
                if (re < rb) {
                  rbe = (re - rb - 1) / colorIndex + 1;
                  ri = -1;
                }
                if (re === rb) {
                  rbe = 0;
                  ri = 0;
                }
                let gb = parseInt(rgbMin.slice(3, 5), 16);  //g开始值
                let ge = parseInt(colorArr[j][2].slice(3, 5), 16); //g结束值
                let gbe, gi;
                if (ge > gb) {
                  gbe = (ge - gb + 1) / colorIndex - 1;
                  gi = 1;
                }
                if (ge < gb) {
                  gbe = (ge - gb - 1) / colorIndex + 1;
                  gi = -1;
                }
                if (ge === gb) {
                  gbe = 0;
                  gi = 0;
                }
                let bb = parseInt(rgbMin.slice(5, 7), 16);  //b开始值
                let be = parseInt(colorArr[j][2].slice(5, 7), 16); //b结束值
                let bbe, bi;
                if (be > bb) {
                  bbe = (be - bb + 1) / colorIndex - 1;
                  bi = 1;
                }
                if (be < bb) {
                  bbe = (be - bb - 1) / colorIndex + 1;
                  bi = -1;
                }
                if (be === bb) {
                  bbe = 0;
                  bi = 0;
                }
                let begin = parseInt(colorArr[j][0]);
                for (let k = 0; k < colorIndex; k++) {
                  let rgbArr = [];
                  let be = begin;
                  let rgb = [];
                  let en = begin + (parseInt(colorArr[j][1]) - parseInt(colorArr[j][0])) / colorIndex;
                  r = rb + rbe;
                  g = gb + gbe;
                  b = bb + bbe;
                  rgb.push(parseInt(r));
                  rgb.push(parseInt(g));
                  rgb.push(parseInt(b));
                  rgbArr.push(be);
                  rgbArr.push(en);
                  rgbArr.push(rgb.join(','));
                  fcolor.push(rgbArr);
                  begin = en;
                  rb = r + ri;
                  gb = g + gi;
                  bb = b + bi;
                }
              }
              result[rs[f].fcode] = fcolor;
            }
          }
          cb(null, result)
        }
      }
    });
  };
  color.remoteMethod('list', {
    description: '颜色查询',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};



