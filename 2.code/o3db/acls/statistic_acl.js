/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: statistic_acl
 * @Description: 统计报表接口权限
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
    ]
  }
];

module.exports = acl;
