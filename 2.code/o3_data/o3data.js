/**
 * Created by Jackie on 2017/10/23.
 * Author: 汪双顶
 * 版权所有: 合肥安慧软件有限公司
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var log4js = require('log4js');
log4js.configure("./logConfig.json");
var logInfo = log4js.getLogger('sjobLog');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var config = require('./config');
let conStr = config.dbConnStr;
var co = require('co');
var thunkify = require("thunkify");
var later = require('later');
let schedule = require('node-schedule');
let rule = new schedule.RecurrenceRule();
let lr = require('line-reader');
let Promise = require('bluebird');
rule.minute = config.o3Job;

var errParamMsg = {
    ret: 0,
    msg: '操作失败，查询参数失败'
};
var errDbMsg = {
    ret: 0,
    msg: '操作失败，数据库连接失败'
};
var errColMsg = {
    ret: 0,
    msg: '操作失败，数据库集合操作异常'
};

var heiArr = [];
let StartInd = 0;
let StartIndex = 0;
let minu = 0;

function scheduleCronstyle() {
    schedule.scheduleJob(rule, function () {
        getData();
    });
}

function getRealData() {

    try {
        let time = parseInt(Date.now() / 1000) * 1000 - 60 * 1000;
        let dt = realDataString(time);
        let path = config.o3RealDataPath + 'HF20170928' + '08.5500';
        let pmArr = [], tpArr = [], xgArr = [];
        logInfo.info('开始读取文件：' + path);
        let fileLine = [];
        let eachLine = Promise.promisify(lr.eachLine);
        let readStream = fs.createReadStream(path,'binary');
        eachLine(readStream, function (line) {
            if (line !== '') {
                fileLine.push(line);
            }
        }).then(function () {
            console.log(fileLine[7]);
            let bf = new Buffer(fileLine[7]);
            console.log(bf);
        }).catch(function (err) {
            console.error(err);
        });
        // return false;
        // fs.readFile(path,'binary', function (err, data) {
        //     if (err) {
        //         logInfo.error('读取监测文件失败：' + err);
        //         return false;
        //     } else {
        //         console.log(data);
        //         let bf = data.slice(480,492);
        //         console.log(bf.toString());
        //     }
        // });
    } catch (e) {
        logInfo.error('定时接收数据任务失败：' + e);
    }

}

function getData() {
    try {
        let time = parseInt(Date.now() / 1000) * 1000 - 60 * 1000;
        let dt = dataString(time);
        let path = config.o3dataPath + '20170928/' + '20170928' + dt + '.json';
        let pmArr = [], tpArr = [], xgArr = [];
        logInfo.info('开始读取文件：' + path);
        fs.readFile(path, function (err, data) {
            if (err) {
                logInfo.error('读取监测文件失败：' + err);
                return false;
            } else {
                let o3_data = JSON.parse(data);
                heiArr = o3_data[0].height;
                let PM10 = o3_data[0].PM10;
                let tuipian = o3_data[0].tuipian;
                let xiaoguang = o3_data[0].xiaoguang;
                let pmData1 = {
                    device_code: "test_device",
                    pix: 15,
                    distance: 45000,
                    degree_yj: 0,
                    degree_fwj: 0,
                    time_js: new Date().valueOf(),
                    scode: o3_data[0].siteid,
                    AOD: o3_data[0].AOD,
                    PBL: o3_data[0].PBL,
                    time_cj: time
                };
                let pmData2 = {
                    device_code: "test_device",
                    pix: 15,
                    distance: 45000,
                    degree_yj: 0,
                    degree_fwj: 0,
                    time_js: new Date().valueOf(),
                    scode: 'aaa4',
                    AOD: o3_data[0].AOD,
                    PBL: o3_data[0].PBL,
                    time_cj: time
                };
                let tpData = {
                    device_code: "test_device",
                    pix: 15,
                    distance: 45000,
                    degree_yj: 0,
                    degree_fwj: 0,
                    time_js: new Date().valueOf(),
                    scode: o3_data[0].siteid,
                    AOD: o3_data[0].AOD,
                    PBL: o3_data[0].PBL,
                    time_cj: time
                };
                let xgData = {
                    device_code: "test_device",
                    pix: 15,
                    distance: 45000,
                    degree_yj: 0,
                    degree_fwj: 0,
                    time_js: new Date().valueOf(),
                    scode: o3_data[0].siteid,
                    AOD: o3_data[0].AOD,
                    PBL: o3_data[0].PBL,
                    time_cj: time
                };
                for (let data_in = 0; data_in < heiArr.length; data_in++) {
                    let index = 'h_' + heiArr[data_in];
                    pmData1[index] = PM10[data_in];
                    pmData2[index] = PM10[data_in];
                    tpData[index] = tuipian[data_in];
                    xgData[index] = xiaoguang[data_in];
                }
                pmArr.push(pmData1);
                pmArr.push(pmData2);
                tpArr.push(tpData);
                xgArr.push(xgData);
                inDb(pmArr, 'd_o3radar', "臭氧数据入库成功");
                inDb(tpArr, 'd_tp', "退偏数据入库成功");
                inDb(xgArr, 'd_xg', "消光数据入库成功");
            }
        });
    } catch (e) {
        logInfo.error('定时接收数据任务失败：' + e);
    }
}

/*入库*/
function inDb(data, table, msg) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection(table, {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                } else {
                    dbc.insertMany(data, {w: 1}, function (err, result) {
                        if (err) {
                            logInfo.error("数据插入失败" + err.toString());
                            conn.close();
                        } else {
                            conn.close();
                            logInfo.info("入库成功:" + msg);
                        }
                    });

                }
            });
        } else {
            logInfo.error("数据库连接失败");
            conn.close();
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

function realDataString(shijianchuo) { //shijianchuo是整数，否则要parseInt转换
    let time = new Date(shijianchuo);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return add0(h).toString() + '.' + add0(mm).toString() + add0(s).toString();
}

exports.AvaData = function () {
    getRealData();
    scheduleCronstyle();
    console.log("定时接收数据任务启动成功");
    logInfo.info('定时接收数据任务启动成功');
};

function lr_line(path, callback) {

}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": Math.floor(this.getMinutes() / 10) * 10,                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

