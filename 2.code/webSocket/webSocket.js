/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: webSocket
 * @Description: webSocket
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/25
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
let clientList = [];
let WebSocketServer = require('ws').Server;
let wss;
let cleanup = [];
let co = require('co');
let thunkify = require('thunkify');
let config = require('./config');
let key = [];
let http = require('http');
let log4js = require('log4js');
log4js.configure("./logConfig.json");
let wLog = log4js.getLogger('webPush');

exports.init = function () {
    wss = new WebSocketServer({port: 8001});
    wss.on('connection', function (client) {
        let ip = client._socket.remoteAddress;
        client.ip = ip;
        client.send(JSON.stringify({"ret": 2}));
        client.on('message', function (message) {
            try {
                let msg = JSON.parse(message);
                if (msg.type === "0") {
                    client.subRapid = msg.value;

                    if(clientList.length===0){
                        clientList.push(client);
                        console.log(client.ip,'online');
                    }else {
                        for(let i=0;i<clientList.length;i++){
                            if(ip===clientList[i].ip){
                                clientList.splice(i,1);
                                console.log(ip,'clear repeat');
                                console.log(client.ip,'online');
                                clientList.push(client);
                                return false;
                            }
                        }
                        console.log('no repeat');
                        console.log(client.ip,'online');
                        clientList.push(client);
                    }
                }
                if (msg.type === "1") {}
            }
            catch (e) {
                wLog.error('消息推送失败：' + e);
            }
        });
        client.on('close', function (e) {
            console.log(e.toString()+' '+client.ip,'close');
            clientList.splice(clientList.indexOf(client), 1); // 删除数组中的制定元素
        });
        client.on('error', function (e) {
            // clientList.splice(clientList.indexOf(client), 1); // 删除数组中的指定元素
            console.log(e,'err');
        });
    });
    console.log('webSocket启动成功');
};

exports.writeRapid = function (msg) {
    try {
        for (let i = 0; i < clientList.length; i++) {
            // clientList[i].send("test");
            for (let j = 0; j < clientList[i].subRapid.length; j++) {
                if (clientList[i].subRapid[j] === msg.wtype) {
                    try {
                        console.log(clientList[i].ip,'send');
                        clientList[i].send(JSON.stringify(msg));
                        wLog.info('消息推送成功：' + clientList[i] + '.' + JSON.stringify(msg));
                    }
                    catch (e) {
                        cleanup.push(clientList[i]);
                        wLog.error('消息推送失败：' + e);
                    }
                }
            }
        }
    }
    catch (e) {
        wLog.error('消息推送失败：' + e);
    }
};

function websocketSend(msg) {
    try {
        for (let i = 0; i < clientList.length; i++) {
            // clientList[i].send("test");
            for (let j = 0; j < clientList[i].subRapid.length; j++) {
                if (clientList[i].subRapid[j] === msg.wtype) {
                    try {
                        clientList[i].send(JSON.stringify(msg));
                        wLog.info('消息推送成功：' + clientList[i] + '.' + JSON.stringify(msg));
                    }
                    catch (e) {
                        cleanup.push(clientList[i]);
                        wLog.error('消息推送失败：' + e);
                    }
                }
            }
        }
    }
    catch (e) {
        wLog.error('消息推送失败：' + e);
    }

}

exports.cleanClient = function () {
    setInterval(function () {
        for (let i = 0; i < cleanup.length; i += 1) {
            // clientList[i].destroy();
            clientList.splice(clientList.indexOf(cleanup[i]), 1);
            console.log(cleanup[i].ip,'clear');
        }
        cleanup = [];
    }, 1000);
};


function add0(m) {
    return m < 10 ? '0' + m : m
}

function format(shijianchuo) { //shijianchuo是整数，否则要parseInt转换
    let time = new Date(shijianchuo);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y.toString() + add0(m).toString() + add0(d).toString() + add0(h).toString() + add0(mm).toString() + add0(s).toString();
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

