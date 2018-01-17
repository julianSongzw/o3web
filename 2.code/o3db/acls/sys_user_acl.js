/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: sys_user_acl
 * @Description: 用户表操作权限
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/2
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
let acl = [
  {
    "accessType": "*",
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "DENY"
  },
  //  公共权限
  {
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "ALLOW",
    "property": [
      "count",                  //  查询
      "find",                   //  查询
      "list",                   //  查询
      "create",                 //  添加
      "destroyAll",             //  删除
      "updateAll",              //  修改
      "replaceById",            //  修改
      "webLogin",               //  登录
      "login",                  //  登录
      "findById",               //  查询、登录
      "setPassword",            //  修改密码
      "changePwd",              //  修改密码
      "changePassword",         //  修改密码
    ]
  },
  //  admin用户权限
  {
    "principalType": "ROLE",
    "principalId": "admin",
    "permission": "ALLOW",
    "property": [
      "add",                    //  添加
      "del",                    //  删除
      "up",                     //  修改
      "control",                //  登录权限控制
      "resetPwd",               //  重置密码
    ]
  },
  //  高级用户管理员
  {
    "principalType": "ROLE",
    "principalId": "superuser",
    "permission": "ALLOW",
    "property": [
      "add",                    //  添加
      "del",                    //  删除
      "up",                     //  修改
      "control",                //  登录权限控制
      "resetPwd",               //  重置密码
    ]
  },
  //  普通用户
  {
    "principalType": "ROLE",
    "principalId": "baseUser",
    "permission": "ALLOW",
    "property": [
      "add",                    //  添加
      "del",                    //  删除
      "up",                     //  修改
      "control",                //  登录权限控制
      "resetPwd",               //  重置密码
    ]
  }
];

module.exports = acl;
