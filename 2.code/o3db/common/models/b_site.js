/**
 * Created by dell on 2017/10/24.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var conStr = config.dbConnStr;
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/b_site_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let co = require('co');
let thunkify = require('thunkify');
var errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
var errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};

module.exports = function (b_site) {
  b_site.settings.acls = acl;
  /*唯一性字段*/
  b_site.validatesUniquenessOf('code');

  /*查询*/
  b_site.list = function (data, cb) {
    var filter = {
      order: '_id DESC',
      include: ['city_info', 'area_info', 'userInfo',{device:['union_gk_info','union_sk_info','union_cg_info']}],
      where: {}
    };
    if (data.code !== "undefined" && data.code) filter.where.code = {regexp: data.code};
    if (data.name !== "undefined" && data.name) filter.where.name = {regexp: data.name};
    if (data.type !== "undefined" && data.type) filter.where.type = {regexp: data.type};
    if (data.city !== "undefined" && data.city) filter.where.city = {regexp: data.city};
    if (data.area !== "undefined" && data.area) filter.where.area = {regexp: data.area};
    if (data.factor !== "undefined" && data.factor) filter.where.factor = {regexp: data.factor};
    if (data.pageSize !== "undefined" && data.pageIndex !== "undefined" && data.pageSize && data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    b_site.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('监测点查询失败：' + err);
        return false;
      }
      b_site.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('监测点查询失败：' + err);
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
  b_site.remoteMethod('list', {
    description: '监测点查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*新增*/
  b_site.add = function (req, cb) {
    var data = req.body;
    data.is_online = '0';
    data.upTime = '';
    data.rate = '';
    b_site.create(data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '监测点添加失败'
        });
        errLog.error('监测点添加失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("添加监测点：" + rs.name, req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        id: rs.id,
        msg: '新增成功'
      });
    });
  };
  b_site.remoteMethod('add', {
    description: '添加监测点',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/add', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*修改*/
  b_site.up = function (req, cb) {
    var data = req.body;
    if (!data.id || data.id == "undefined" || data.id == "") {
      cb(null, errParamMsg);
      return false;
    }
    var id = data.id;
    delete data['city_info'];
    delete data['area_info'];
    delete data['id'];
    b_site.replaceById(id, data, {validate: true}, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '监测点修改失败'
        });
        errLog.error('监测点修改失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("修改监测点" + rs.name, req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '修改成功'
      });
    })
  };
  b_site.remoteMethod('up', {
    description: '修改监测点',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/siteUpdate', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*删除*/
  b_site.del = function (req, cb) {
    var data = req.body;
    if (!data.id || data.id === "undefined" || data.id === "") {
      cb(null, errParamMsg);
      return false;
    }
    var arr = [];
    data.id.split(",").forEach(function (item) {
      arr.push(ObjectID(item));
    });
    var where = {_id: {inq: arr},type:'2'};
    b_site.destroyAll(where, function (err, info) {
      if (err) {
        cb(null, {
          ret:0,
          msg:'监测点删除失败'
        });
        errLog.error('监测点删除失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除" + info.count + "个监测点", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '删除成功'
      });
    })
  };
  b_site.remoteMethod('del', {
    description: '删除监测点',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/delete', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  //  监测点浓度值
  b_site.fvalue = function (data, cb) {
    co(function* () {
      let filter = {
        order: 'time_cj DESC',
        where: {}
      };
      let result = {
        ret:1,
        msg:'查询成功'
      };
      if(data.factor === "undefined" || !data.factor || data.factor === "null" || data.factor === ''
        || data.time_cj === "undefined" || !data.time_cj || data.time_cj === "null" || data.time_cj === ''
      ){
        cb(null, {
          ret: 0,
          msg: '参数错误'
        });
        return false;
      }
      let factor = [];
      data.factor.split(",").forEach(function (item) {
        factor.push(item);
      });
      let gs = thunkify(getScode);
      let pc = thunkify(pcolor);
      let zjArr,gkArr,datas={};
      /*自建监测点数据*/
      try{
        //  查询自建监测点编号
        let where = {
          type:'2'
        };
        let gs_callback = yield gs(where);
        if(gs_callback){
          zjArr = gs_callback;
        }
        //  查询站点因子浓度值
        if(zjArr){
          let param = {
            b_site: b_site,
            filter: filter
          };
          param.filter.where.time_cj = Number(data.time_cj);
          for (let j = 0; j < zjArr.length; j++) {
            let factorData = {};
            param.filter.where.scode = zjArr[j];
            try {
              for (let i = 0; i < factor.length; i++) {
                if (factor[i] === 'o3') {
                  param.model = 'd_o3radar';
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
            datas[zjArr[j]] = factorData;
          }
        }
      }catch (e){
        cb({
          ret: 0,
          msg: '数据异常'
        });
        errLog.error('自建监测点浓度数据异常：' + e.toString());
        return false;
      }
      /*国控点因子浓度值*/
      try {
        //  查询国控点编号
        let where = {
          type:'1'
        };
        let gs_callback = yield gs(where);
        if(gs_callback){
          gkArr = gs_callback;
        }
        //  查询站点因子浓度值
        if(gkArr){
          let param = {
            b_site: b_site,
            filter: filter,
            factor:factor
          };
          //  获取当前整点时间
          let dt = hourFormat(Number(data.time_cj));
          let time_cj_start = Date.parse(new Date(dt)) - 60*60*1000;
          let time_cj_end = Date.parse(new Date(dt));
          param.filter.where.time_cj = {between: [time_cj_start,time_cj_end]};
          param.model = 'd_air';
          for (let j = 0; j < gkArr.length; j++) {
            param.filter.where.scode = gkArr[j];
            let fgkV = thunkify(findGKValue);
            let fgkV_callback = yield fgkV(param);
            datas[gkArr[j]] = fgkV_callback;
          }
        }
      }catch (e){
        cb({
          ret: 0,
          msg: '数据异常'
        });
        errLog.error('国控点浓度数据异常：' + e.toString());
        return false;
      }
      result.datas = datas;
      cb(null,result);
    });
  };
  b_site.remoteMethod('fvalue', {
    description: '监测点浓度查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/fvalue', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};

/*获取监控点编号*/
function getScode(where, callback) {
  mongodb.connect(conStr, function (err, conn) {
    if (!err) {
      conn.collection('b_site', {safe: true}, function (err, dbc) {
        if (err) {
          errLog.error("数据集合连接失败");
          conn.close();
          callback(null, false);
        } else {
          dbc.distinct('code', where, function (err, result) {
            if (err) {
              errLog.error("获取监测点失败" + err.toString());
              callback(null, false);
            } else {
              conn.close();
              callback(null, result);
            }
          });
        }
      });
    } else {
      errLog.error("获取监控点数据库连接失败：" + err);
    }
  });
}

function pcolor(param, callback) {
  let table = param.model;
  param.b_site.app.models[table].find(param.filter, function (err, rs) {
    if (err) {
      callback(null, '');
      errLog.error('监测点浓度查询异常：' + err);
      return false;
    }else {
      if(rs.length===0){
        callback(null,'');
        errLog.error('监测点浓度查询异常：无数据');
        return false;
      }else {
        callback(null,rs[0]['h_'+config.lowHeight]);
      }
    }
  });
}

function findGKValue(param, callback) {
  let table = param.model;
  let factor = param.factor;
  let data = {};
  param.filter.order = 'time_cj ASC';
  param.b_site.app.models[table].find(param.filter, function (err, rs) {
    if (err) {
      for(let i=0;i<factor.length;i++){
        data[factor[i]] = '';
      }
      callback(null, data);
      errLog.error('监测点浓度查询异常：' + err);
      return false;
    }else {
      if(rs.length===0){
        for(let i=0;i<factor.length;i++){
          data[factor[i]] = '';
        }
        callback(null, data);
        errLog.error('监测点浓度查询异常：无数据');
        return false;
      }else {
        if(rs.length===2){
          for(let i=0;i<factor.length;i++){
            data[factor[i]] = rs[1][factor[i]];
          }
          callback(null,data);
        }else {
          for(let i=0;i<factor.length;i++){
            data[factor[i]] = rs[0][factor[i]];
          }
          callback(null,data);
        }
      }
    }
  });
}


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
