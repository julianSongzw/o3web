'use strict';
let roleData = require('../../roleData');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
let requestLog = log4js.getLogger('requestLog');
let sjobLog = log4js.getLogger('sjobLog');
let bodyParser = require('body-parser');
let config = require('../../config');
let http = require('http');
module.exports = function (server) {
  // Install a `/` route that returns server status
  server.use(log4js.connectLogger(log4js.getLogger('requestLog'), {level: log4js.levels.INFO}));
  server.use(bodyParser.json({limit: '100000kb'}));
  server.use(bodyParser.urlencoded({limit: '100000kb', extended: false}));
  let router = server.loopback.Router();
  router.get('/', server.loopback.status());


//建立admin用户
  router.get('/createAdmin', function (req, res) {
    let mongoDs = server.dataSources.mongods;
    mongoDs.automigrate('AccessToken', function (err) {

      if (err) throw err;
    });
    mongoDs.automigrate('sys_user', function (err) {

      if (err) throw err;

      let sys_user = server.models.sys_user;
      let Role = server.models.Role;
      let RoleMapping = server.models.RoleMapping;

      sys_user.create([
        {
          area: 'AH_00_01',
          flag: 1,
          username: 'admin',
          password: '123456',
          latest_login_time: Date.now(),
          total_login_counts: 0,
          name: '李勇',
          sex: '1',
          duties: '1',
          tel: '13900000000',
          email: '865648012@qq.com',
          addr: '',
          imgUrl: '',
          role: ''
        }
      ], function (err, users) {
        if (err) {
          throw err;
        }
        mongoDs.automigrate('RoleMapping', function (err) {
          if (err) throw err;
          let userid = users[0].id;
          Role.find({
            where: {
              name: 'admin'
            }
          }, function (err, role) {
            console.log('Created role:', role[0]);
            RoleMapping.create({
              principalType: RoleMapping.USER,
              principalId: userid,
              roleId: role[0].id
            }, function (err, principal) {
              if (err) throw err;
              res.json({
                msg: 'admin账号创建成功'
              });
            });
          });
        });
      });
    });
  });

  //  建立角色
  router.get('/createRole', function (req, res) {
    server.models.sys_role.create(roleData, function (err, rs) {
      if (err) throw err;
      let roleArr = [];
      for (let i = 0; i < roleData.length; i++) {
        roleArr.push({name: roleData[i].roleCode});
      }
      server.models.Role.create(roleArr, function (err, rs) {
        if (err) throw err;
        res.json({
          msg: '角色创建成功'
        });
      });
    });
  });

  //  锥形图图片入库接口
  router.post('/api/d_cones/add', function (req, res) {
    let data = req.body;
    if (!data.scode || data.scode === "undefined" || data.scode === ""
      || !data.factor || data.factor === "undefined" || data.factor === ""
      || !data.time || data.time === "undefined" || data.time === ""
      || !data.deg || data.deg === "undefined" || data.deg === ""
      || !data.value || data.value === "undefined" || data.value === ""
    ) {
      res.json({
        ret: 0,
        msg: '参数错误'
      });
      return false;
    }
    data.time = Date.parse(new Date(data.time));
    for(let i=0;i<data.deg.length;i++){
      data['deg_'+data.deg[i].toString()] = data.value[i];
    }
    delete data['deg'];
    delete data['value'];
    server.models.d_cone.create(data, function (err, rs) {
      if (err) {
        res.json({
          ret: 0,
          msg: '入库失败'
        });
        sjobLog.error('锥形图入库失败：' + err);
        return false;
      }
      // data.wtype = '0';
      // sendMsg(data);
      res.json({
        ret: 1,
        msg: '插入成功'
      });
      sjobLog.info('锥形图入库成功');
    });
  });

  //  基础数据入库接口
  router.post('/api/factor/insert', function (req, res, next) {
    try {
      let o3 = req.body.o3;
      let tp = req.body.tp;
      let xg = req.body.xg;
      let o3baseObj = {
        "device_code": "test_device",
        "pix": 15,
        "distance": 45000,
        "degree_yj": 0,
        "degree_fwj": 0,
        "scode": req.body.scode,
        "AOD": "0.2",
        "PBL": "2.3175",
        "time_cj": req.body.time_cj
      };
      let tpbaseObj = {
        "device_code": "test_device",
        "pix": 15,
        "distance": 45000,
        "degree_yj": 0,
        "degree_fwj": 0,
        "scode": req.body.scode,
        "AOD": "0.2",
        "PBL": "2.3175",
        "time_cj": req.body.time_cj
      };
      let xgbaseObj = {
        "device_code": "test_device",
        "pix": 15,
        "distance": 45000,
        "degree_yj": 0,
        "degree_fwj": 0,
        "scode": req.body.scode,
        "AOD": "0.2",
        "PBL": "2.3175",
        "time_cj": req.body.time_cj
      };
      let o3H = 0, tpH = 0, xgH = 0;
      if(o3){
        for (let i = 0; i < o3.length; i++) {
          o3baseObj['h_' + o3H.toString()] = o3[i];
          o3H = o3H + 15;
        }
        inDB(server,o3baseObj,'d_o3radar','臭氧');
      }
      if(tp){
        for (let i = 0; i < tp.length; i++) {
          tpbaseObj['h_' + tpH.toString()] = tp[i];
          tpH = tpH + 15;
        }
        inDB(server,tpbaseObj,'d_tp','退偏');
      }
      if(xg){
        for (let i = 0; i < xg.length; i++) {
          xgbaseObj['h_' + xgH.toString()] = xg[i];
          xgH = xgH + 15;
        }
        inDB(server,xgbaseObj,'d_xg','退偏');
      }
      res.json({
        ret:1,
        msg:'数据上传成功'
      });
    } catch (e) {
      res.json({
        ret: 0,
        msg: '数据异常'
      });
      errLog.error('污染物数据入库失败：' + e.toString());
    }
  });
  server.use(router);
};
function inDB(server,data, table, msg) {
  server.models[table].create(data, function (err, rs) {
    if (err) {
      errLog.error('污染物数据入库失败：' + err);
      return false;
    }
    sjobLog.info(msg + '数据入库成功');
  });
}

function sendMsg(msg) {
  let opt = {
    method: "POST",
    host: config.websocketHost,
    port: config.websocketPort,
    path: '/sendMsg',
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
      });
    }
    else {
      errLog.error('webSocket推送失败');
    }
  });
  requ.write(JSON.stringify(msg) + "\n");
  requ.end('');
  requ.on('error', function (e) {
    errLog.error('webSocket推送失败:' + e);
  });
}
