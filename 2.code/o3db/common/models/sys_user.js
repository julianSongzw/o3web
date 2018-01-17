/**
 * Created by dell on 2017/10/23.
 */
var config = require('../../config');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var loopback = require('loopback');
var app = loopback();
var logs = require('../../logServer');
let acl = require('../../acls/sys_user_acl');
let log4js = require('log4js');
log4js.configure('./logConfig.json');
let errLog = log4js.getLogger('errorLog');
var errColMsg = {
  ret: 0,
  msg: '操作失败，数据库集合操作异常'
};
var errParamMsg = {
  ret: 0,
  msg: '操作失败，参数合法性验证'
};

module.exports = function (sys_user) {
  sys_user.settings.acls = acl;
  /*唯一性字段*/
  sys_user.validatesUniquenessOf('username');

  /*登录系统*/
  sys_user.webLogin = function (req, cb) {
    var data = req.body;
    var loginData = {
      username: data.username,
      flag: 1
    };
    sys_user.count(loginData, function (err, count) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('登录用户异常：' + err);
        return false;
      }
      if (count == 0) {
        cb(null, {
          ret: 0,
          msg: '该用户不存在或已被禁用'
        });
        return false;
      }
      sys_user.login(data, function (err, token) {
        if (err) {
          cb(null, {
            ret: 0,
            msg: '用户名或密码错误'
          });
          errLog.error('用户名或密码错误：' + err);
          return false;
        }
        sys_user.findById(token.userId, function (err, user) {
          if (err) {
            cb(null, {
              ret: 0,
              msg: '获取用户信息失败'
            });
            errLog.error('获取用户信息失败：' + err);
            return false;
          }
          var total_login_counts = user.total_login_counts;
          var ups = {
            latest_login_time: Date.now(),
            total_login_counts: Number(total_login_counts) + 1
          };
          sys_user.updateAll({"_id": ObjectID(token.userId)}, ups, function (err, count) {
            if (err) {
              cb(null, {
                ret: 0,
                msg: '统计用户登录失败'
              });
              errLog.error('统计用户登录失败：' + err);
              return false;
            }
            logs.loginLog("web登录", req.headers['x-forwarded-for'] ||
              req.connection.remoteAddress ||
              req.socket.remoteAddress ||
              req.connection.socket.remoteAddress, user.username);
            cb(null, {
              ret: 1,
              token: token.id,
              userData: [user],
              websocketUrl: config.websocketUrl,
              fileSer: config.ftpServer,
              msg: "登录成功"
            });
          });
        });
      });
    });
  };
  sys_user.remoteMethod('webLogin', {
    description: '登录接口',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/webLogin', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*新增用户*/
  sys_user.add = function (req, cb) {
    var data = req.body;
    data.password = config.pwd;
    data.latest_login_time = null;
    data.total_login_counts = 0;
    data.flag = 1;
    data.emailVerified = true;
    data.email = data.username+'@test.com';
    sys_user.create(data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '新增用户失败'
        });
        errLog.error('新增用户失败：' + err);
        return false;
      }
      var userid = rs.id;
      var Role = sys_user.app.models.Role;
      var RoleMapping = sys_user.app.models.RoleMapping;
      Role.find({where: {name: data.role}}, function (err, role) {
        if (err) {
          cb(null, {
            ret: 0,
            msg: '角色异常'
          });
          errLog.error('角色异常：' + err);
          return false;
        }
        if (role.length === 0) {
          cb(null, {
            ret: 0,
            msg: '请选择角色'
          });
          errLog.error('未选择角色');
          return false;
        }
        RoleMapping.create({
          principalType: RoleMapping.USER,
          principalId: userid,
          roleId: role[0].id
        }, function (err, principal) {
          if (err) {
            cb(null, {
              ret: 0,
              msg: '用户角色分配异常'
            });
            errLog.error('用户角色分配异常：' + err);
            return false;
          }
          var user = req.query.username;
          logs.optLog("新建用户" + rs.username, req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress, user);
          cb(null, {
            ret: 1,
            id: rs.id,
            msg: '新增成功'
          });
        });
      });
    });
  };
  sys_user.remoteMethod('add', {
    description: '添加用户',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/add', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*查询*/
  sys_user.list = function (data, cb) {
    var filter = {
      order: '_id DESC',
      include: ['area_info', 'city_info'],
      where: {}
    };
    if (data.username != "undefined" && data.username) filter.where.username = {regexp: data.username};
    if (data.area != "undefined" && data.area) filter.where.area = {regexp: data.area};
    if (data.flag != "undefined" && data.flag) filter.where.flag = Number(data.flag);
    if (data.duties != "undefined" && data.duties) filter.where.duties = {regexp: data.duties};
    if (data.pageSize != "undefined" && data.pageIndex != "undefined" && data.pageSize && data.pageIndex) {
      filter.limit = Number(data.pageSize);
      filter.skip = (Number(data.pageIndex) - 1) * Number(data.pageSize);
    }
    sys_user.find(filter, function (err, rs) {
      if (err) {
        cb(null, errColMsg);
        errLog.error('用户查询：' + err);
        return false;
      }
      sys_user.count(filter.where, function (err, count) {
        if (err) {
          cb(null, errColMsg);
          errLog.error('用户查询失败：' + err);
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
  sys_user.remoteMethod('list', {
    description: '用户查询',
    accepts: {arg: 'data', type: 'Object', required: true, http: {source: 'body'}},
    http: {path: '/list', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*删除*/
  sys_user.del = function (req, cb) {
    var data = req.body;
    if (!data.id || data.id == "undefined" || data.id == "") {
      cb(null, errParamMsg);
      return false;
    }
    var arr = [];
    data.id.split(",").forEach(function (item) {
      arr.push(ObjectID(item));
    });
    var where = {_id: {inq: arr}};
    sys_user.destroyAll(where, function (err, info) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '删除用户失败'
        });
        errLog.error('删除用户失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("删除" + info.count + "条用户记录", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '删除成功'
      });
    })
  };
  sys_user.remoteMethod('del', {
    description: '删除用户',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/delete', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*修改*/
  sys_user.up = function (req, cb) {
    var data = req.body;
    if (!data.id || data.id == "undefined" || data.id == "") {
      cb(null, errParamMsg);
      return false;
    }
    var id = data.id;
    delete data['area_info'];
    delete data['city_info'];
    delete data['id'];
    sys_user.updateAll({_id: ObjectID(id)}, data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '修改用户失败'
        });
        errLog.error('修改用户失败：' + err);
        return false;
      }
      //  修改角色
      sys_user.app.models.Role.find({where: {name: data.role}}, function (err, role) {
        if (err) {
          cb(null, {
            ret: 0,
            err: err,
            msg: '无此角色'
          });
          errLog.error('获取角色异常：' + err);
          return false;
        }
        sys_user.app.models.RoleMapping.updateAll({principalId: id}, {roleId: role[0].id}, function (err, principal) {
          if (err) {
            cb(null, {
              ret: 0,
              msg: '角色修改失败'
            });
            errLog.error('角色修改失败：' + err);
            return false;
          }
          var user = req.query.username;
          logs.optLog("修改用户" + data.username, req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress, user);
          cb(null, {
            ret: 1,
            msg: '修改成功'
          });
        });
      });
    });
  };
  sys_user.remoteMethod('up', {
    description: '修改用户',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/userUpdate', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*登录权限*/
  sys_user.control = function (req, cb) {
    var data = req.body;
    var control;
    if (data.flag == 0) {
      control = '禁用';
    }
    if (data.flag == 1) {
      control = '启用';
    }
    if (!data.id || data.id == "undefined" || data.id == "") {
      cb(null, errParamMsg);
      return false;
    }
    var id = ObjectID(data.id);
    delete data['id'];
    sys_user.updateAll({_id: id}, data, function (err, rs) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '修改登录权限失败'
        });
        errLog.error('修改登录权限失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog(control + data.username + "用户", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '修改成功'
      });
    })
  };
  sys_user.remoteMethod('control', {
    description: '修改登录权限',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/loginAuth', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*重置密码*/
  sys_user.resetPwd = function (req, cb) {
    var data = req.body;
    if (!data.id || data.id == "undefined" || data.id == "") {
      cb(null, errParamMsg);
      return false;
    }
    sys_user.setPassword(data.id, config.pwd, function (err) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '重置密码失败'
        });
        errLog.error('重置密码失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("重置用户" + data.username + "的密码", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '密码已重置为123456'
      })
    });
  };
  sys_user.remoteMethod('resetPwd', {
    description: '重置密码',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/resetPassword', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });

  /*修改密码*/
  sys_user.changePwd = function (req, cb) {
    var data = req.body;
    if (!data.id || data.id == "undefined" || data.id == "") {
      cb(null, errParamMsg);
      return false;
    }
    sys_user.changePassword(data.id, data.oldPassword, data.newPassword, function (err) {
      if (err) {
        cb(null, {
          ret: 0,
          msg: '修改密码失败'
        });
        errLog.error('修改密码失败：' + err);
        return false;
      }
      var user = req.query.username;
      logs.optLog("修改密码", req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress, user);
      cb(null, {
        ret: 1,
        msg: '密码修改成功'
      });
    })
  };
  sys_user.remoteMethod('changePwd', {
    description: '修改密码',
    accepts: {arg: 'req', type: 'Object', required: true, http: {source: 'req'}},
    http: {path: '/changePassword', verb: 'post'},
    returns: {arg: 'res', type: 'Object', root: true, required: true}
  });
};
