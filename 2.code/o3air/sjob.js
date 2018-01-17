/**
 * Created by zll on 2016/10/19.
 * 存放定时任务模块
 */
let http = require('http');
let log4js = require('log4js');
log4js.configure("./logConfig.json");
let logInfo = log4js.getLogger('logAir');
let mongodb = require('mongodb');
let config = require('./config');
let conStr = config.dbConnStr;
let fs = require('fs');
let schedule = require('node-schedule');
let cacheD = require('./cacheDic');
let moment = require('moment');
let util = require('util'), https = require('https');
const qs = require('querystring');
let co = require('co');
let thunkify = require('thunkify');
let rule = new schedule.RecurrenceRule();
rule.month = [1, 4, 7, 10];
rule.dayOfMonth = 1;
rule.hour = 0;
rule.minute = 18;
rule.second = 0;
let gkRateRule = new schedule.RecurrenceRule();
gkRateRule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
let onlineRule = new schedule.RecurrenceRule();
onlineRule.minute = [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59];


function scheduleCronstyle() {
    schedule.scheduleJob(config.airJob, function () {
        getAir();
    });
    schedule.scheduleJob(config.weatherJob, function () {
        getWeather();
    });
    schedule.scheduleJob(config.o3HourJob, function () {
        o3HourStatistics();
    });
    schedule.scheduleJob(config.o3_8h_job, function () {
        o3_8hStatistics();
    });
    schedule.scheduleJob(config.o3_24h_job, function () {
        o3_24hStatistics();
    });
    schedule.scheduleJob(config.o3_w_job, function () {
        o3_wStatistics();
    });
    schedule.scheduleJob(config.o3_m_job, function () {
        o3_mStatistics();
    });
    // schedule.scheduleJob(rule, function () {
    //     o3_qStatistics();
    // });
    //  国控点通讯时间与数据获取率
    schedule.scheduleJob(gkRateRule, function () {
        gkUpTimeRate();
    });
    //  设备网络状态检测
    schedule.scheduleJob(onlineRule, function () {
        deviceOnline();
    });
    //  模拟锥形图绘制
    schedule.scheduleJob(gkRateRule, function () {
        makeCone();
    });
}

function getAir() {
    try {
        let dt = new Date().getTime();
        logInfo.info('开始执行获取国控点空气质量的任务:');
        mongodb.connect(conStr, function (err, conn) {
            if (!err) {
                conn.collection('b_area', function (err, dbc) {
                    if (err) {
                        conn.close();
                    } else {
                        dbc.find({
                            'level': 1
                        }).toArray(function (err, rs) {
                            if (!err) {
                                conn.close();
                                if (rs.length > 0) {
                                    for (let i = 0; i < rs.length; i++) {
                                        reqAir(rs[i].area_name);
                                        console.log(rs[i].area_name);
                                    }
                                }
                            }
                            conn.close();
                        });
                    }
                });
            } else {
                conn.close();
            }
        });
    }
    catch (ex) {
        logInfo.error('获取国控点空气质量过程出现异常：' + ex);
    }

}

function getWeather() {
    try {
        let dt = new Date().getTime();
        logInfo.info('开始执行获取城市气象数据的任务:');
        mongodb.connect(conStr, function (err, conn) {
            if (!err) {
                conn.collection('b_area', function (err, dbc) {
                    if (err) {
                        conn.close();
                    } else {
                        dbc.find({
                            'level': 1
                        }).toArray(function (err, rs) {
                            if (!err) {
                                conn.close();
                                if (rs.length > 0) {
                                    for (let i = 0; i < rs.length; i++) {
                                        reqWeather(rs[i].area_name, rs[i].area_code);

                                    }
                                }
                            }
                            conn.close();
                        });
                    }
                });
            } else {
                conn.close();
            }
        });
    }
    catch (ex) {
        logInfo.error('获取城市气象数据过程出现异常：' + ex);
    }

}

function reqAir(city) {
    let options = {
        host: config.airUrl,
        port: 80,
        path: '/api/querys/aqi_details.json?city=' + encodeURI(city) + '&token=' + config.airToken,
        method: 'GET',
        headers: {
            'accept': '*/*',
            'content-type': "application/atom+xml",
            'accept-encoding': 'gzip, deflate',
            'user-agent': 'nodejs rest client'
        }
    };
    let req = http.request(options, function (res) {
        res.on('data', function (chunk) {
            try {
                let sd = JSON.parse(chunk.toString());
                logInfo.info(city+sd.length+"个国控点数据准备入库");
                for (let i = 0; i < sd.length; i++) {
                    let time_point = sd[i].time_point;
                    time_point = time_point.replace(/T/, " ");
                    time_point = time_point.replace(/Z/, "");
                    sd[i].scode = sd[i].station_code;
                    sd[i].scity = cacheD.getVaule(sd[i].area);
                    sd[i].time_cj = new Date(time_point).getTime();
                    sd[i].time_js = new Date().getTime();
                    sd[i].rtype = '0';
                    let $set = {upTime: dateFormat(Date.now())};
                    let where = {code: sd[i].station_code};
                    upDb(where, $set, 'b_site', "更新国控点"+sd[i].position_name+"通讯时间成功:" + new Date());
                }
                inDb(sd, 'd_air', "获取"+city+"空气质量数据成功:"+sd.length+"个国控点 " + new Date());
            }
            catch (e) {
                logInfo.error("获取空气质量数据异常:" + e.toString());
            }

        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}

function reqWeather(scity, code) {
    let options = {
        host: config.weatherUrl,
        port: 443,
        path: '/v5/now?city=' + encodeURI(scity) + '&key=' + config.weatherToken,
        method: 'GET',
        headers: {
            'accept': '*/*',
            'content-type': "application/atom+xml",
            'accept-encoding': 'gzip, deflate',
            'user-agent': 'nodejs rest client'
        }
    };
    let req = https.request(options, function (res) {
        res.on('data', function (chunk) {
            co(function* () {
                try {
                    let str = chunk.toString("UTF-8");
                    let sd = JSON.parse(str).HeWeather5[0];
                    let dt = hourFormat(new Date(sd.basic.update.loc).getTime());
                    let arr = [];
                    //  查询国控点编号
                    let gkArr;
                    //  查询国控点信息
                    try {
                        let gk = thunkify(getScode);
                        gkArr = yield gk({type: '1', city: code});
                        if (!gkArr || gkArr.length === 0) {
                            return false;
                        }
                    } catch (e) {
                        logInfo.error("国控点天气数据获取国控点信息失败：" + e.toString());
                    }
                    for (let i = 0; i < gkArr.length; i++) {
                        let dd = {};
                        dd.scode = gkArr[i];
                        dd.scity = cacheD.getVaule(sd.basic.city);
                        dd.time_cj = new Date(dt).getTime();
                        dd.time_js = new Date().getTime();
                        dd.rtype = '0';
                        dd.vis = sd.now.vis;//能见度
                        dd.deg = sd.now.wind.deg;//风向（360度）
                        dd.sc = sd.now.wind.sc;//风力等级
                        dd.spd = sd.now.wind.spd;//风速
                        dd.dir = sd.now.wind.dir;//风向
                        dd.pres = sd.now.pres;//气压
                        dd.tmp = sd.now.tmp;//温度
                        dd.hum = sd.now.hum;//相对湿度
                        dd.pcpn = sd.now.pcpn;//降水量
                        arr.push(dd);
                    }
                    if (arr.length !== 0) {
                        logInfo.info('准备入库' + scity + '天气');
                        inDb(arr, 'd_weather', "获取气象数据成功:" + new Date() + ',' + scity);
                    }
                }
                catch (e) {
                    logInfo.error("获取气象数据异常:" + e.toString());
                }
            });


        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}

function o3HourStatistics() {
    try {
        logInfo.info('开始执行o3一小时平均统计任务:');
        let dt = hourFormat(Date.now());
        let time_cj_start = Date.parse(new Date(dt)) - 60 * 60 * 1000;
        let time_cj_end = Date.parse(new Date(dt));
        co(function* () {
            //查询监测点
            let gs = thunkify(getSite);
            let bsite = yield gs('d_o3radar');
            let arr = [];
            //对不同的监控点进行统计
            for (let i = 0; i < bsite.length; i++) {
                let ga = thunkify(getAvg);
                let param = {
                    time_cj_start: time_cj_start,
                    time_cj_end: time_cj_end,
                    scode: bsite[i],
                    table: 'd_o3radar',
                    time_cj_real: time_cj_start
                };
                let o3Hour = yield ga(param);
                arr.push(o3Hour);
            }
            inDb(arr, 'd_o3_1h', "统计o3一小时平均成功");

        });


    }
    catch (ex) {
        logInfo.error('o3一小时平均统计出现异常：' + ex);
    }
}

function o3_8hStatistics() {
    try {
        logInfo.info('开始执行o3八小时平均统计任务:');
        let dt = hourFormat(Date.now());
        let time_cj_start = Date.parse(new Date(dt)) - 8 * 60 * 60 * 1000;
        let time_cj_end = Date.parse(new Date(dt));
        co(function* () {
            //查询监测点
            let gs = thunkify(getSite);
            let bsite = yield gs('d_o3_1h');
            let arr = [];
            //对不同的监控点进行统计
            for (let i = 0; i < bsite.length; i++) {
                let ga = thunkify(getAvg);
                let param = {
                    time_cj_start: time_cj_start,
                    time_cj_end: time_cj_end,
                    scode: bsite[i],
                    table: 'd_o3_1h',
                    time_cj_real: time_cj_end - 60 * 60 * 1000
                };
                let o3Hour = yield ga(param);
                arr.push(o3Hour);
            }
            inDb(arr, 'd_o3_8h', "统计o3八小时平均成功");

        });


    }
    catch (ex) {
        logInfo.error('o3八小时平均统计出现异常：' + ex);
    }
}

function o3_24hStatistics() {
    try {
        logInfo.info('开始执行o3二十四小时平均统计任务:');
        let dt = hourFormat(Date.now());
        let time_cj_start = Date.parse(new Date(dt)) - 24 * 60 * 60 * 1000;
        let time_cj_end = Date.parse(new Date(dt));
        co(function* () {
            //查询监测点
            let gs = thunkify(getSite);
            let bsite = yield gs('d_o3_1h');
            let arr = [];
            //对不同的监控点进行统计
            for (let i = 0; i < bsite.length; i++) {
                let ga = thunkify(getAvg);
                let param = {
                    time_cj_start: time_cj_start,
                    time_cj_end: time_cj_end,
                    scode: bsite[i],
                    table: 'd_o3_1h',
                    time_cj_real: time_cj_start
                };
                let o3Hour = yield ga(param);
                arr.push(o3Hour);
            }
            inDb(arr, 'd_o3_24h', "统计o3二十四小时平均成功");

        });


    }
    catch (ex) {
        logInfo.error('o3二十四小时平均统计出现异常：' + ex);
    }
}

function o3_wStatistics() {
    try {
        logInfo.info('开始执行o3周平均统计任务:');
        let dt = hourFormat(Date.now());
        let time_cj_start = Date.parse(new Date(dt)) - 7 * 24 * 60 * 60 * 1000;
        let time_cj_end = Date.parse(new Date(dt));
        co(function* () {
            //查询监测点
            let gs = thunkify(getSite);
            let bsite = yield gs('d_o3_24h');
            let arr = [];
            //对不同的监控点进行统计
            for (let i = 0; i < bsite.length; i++) {
                let ga = thunkify(getAvg);
                let param = {
                    time_cj_start: time_cj_start,
                    time_cj_end: time_cj_end,
                    scode: bsite[i],
                    table: 'd_o3_24h',
                    time_cj_real: time_cj_start
                };
                let o3Hour = yield ga(param);
                arr.push(o3Hour);
            }
            inDb(arr, 'd_o3_w', "统计o3周平均成功");

        });


    }
    catch (ex) {
        logInfo.error('o3周平均统计出现异常：' + ex);
    }
}

function o3_mStatistics() {
    try {
        logInfo.info('开始执行o3月平均统计任务:');
        let dt = hourFormat(Date.now());
        let day = mGetDate(Date.now() - 60 * 60 * 1000);
        let time_cj_start = Date.parse(new Date(dt)) - day * 24 * 60 * 60 * 1000;
        let time_cj_end = Date.parse(new Date(dt));
        co(function* () {
            //查询监测点
            let gs = thunkify(getSite);
            let bsite = yield gs('d_o3_24h');
            let arr = [];
            //对不同的监控点进行统计
            for (let i = 0; i < bsite.length; i++) {
                let ga = thunkify(getAvg);
                let param = {
                    time_cj_start: time_cj_start,
                    time_cj_end: time_cj_end,
                    scode: bsite[i],
                    table: 'd_o3_24h',
                    time_cj_real: time_cj_start
                };
                let o3Hour = yield ga(param);
                arr.push(o3Hour);
            }
            inDb(arr, 'd_o3_m', "统计o3月平均成功");

        });


    }
    catch (ex) {
        logInfo.error('o3月平均统计出现异常：' + ex);
    }
}

function o3_qStatistics() {
    try {
        logInfo.info('开始执行o3季平均统计任务:');
        let dt = hourFormat(Date.now());
        let day1 = mGetDate(Date.now() - 60 * 60 * 1000);
        let day2 = mGetDate(Date.parse(new Date(dt)) - day1 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000);
        let day3 = mGetDate(Date.parse(new Date(dt)) - (day1 + day2) * 24 * 60 * 60 * 1000 - 60 * 60 * 1000);
        let time_cj_start = Date.parse(new Date(dt)) - (day1 + day2 + day3) * 24 * 60 * 60 * 1000;
        let time_cj_end = Date.parse(new Date(dt));
        co(function* () {
            //查询监测点
            let gs = thunkify(getSite);
            let bsite = yield gs('d_o3_m');
            let arr = [];
            //对不同的监控点进行统计
            for (let i = 0; i < bsite.length; i++) {
                let ga = thunkify(getAvg);
                let param = {
                    time_cj_start: time_cj_start,
                    time_cj_end: time_cj_end,
                    scode: bsite[i],
                    table: 'd_o3_m',
                    time_cj_real: time_cj_start
                };
                let o3Hour = yield ga(param);
                arr.push(o3Hour);
            }
            inDb(arr, 'd_o3_q', "统计o3季平均成功");

        });


    }
    catch (ex) {
        logInfo.error('o3月平均统计出现异常：' + ex);
    }
}

/*获取监控点*/
function getSite(table, callback) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection(table, {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                } else {
                    dbc.distinct('scode', function (err, result) {
                        if (err) {
                            logInfo.error("获取监测点失败" + err.toString());
                        } else {
                            conn.close();
                            callback(null, result);
                        }

                    });

                }
            });
        } else {
            logInfo.error("获取监控点数据库连接失败：" + err);

        }

    });
}

/*统计平均值*/
function getAvg(param, callback) {
    let whereby = {};
    whereby.time_cj = {"$gte": param.time_cj_start, "$lt": param.time_cj_end};
    whereby.scode = param.scode;
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection(param.table, {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                } else {
                    dbc.find(whereby).toArray(function (err, rs) {
                        if (err) {
                            logInfo.error("获取监控点" + param.scode + "基础数据失败" + err.toString());
                            conn.close();
                            return false;
                        }
                        if (rs.length === 0) {

                            logInfo.info('统计任务:无数据' + param.scode);
                            callback(null,{});
                            conn.close();
                            return false;
                        }

                        co(function* () {

                            let o3base = rs[0];
                            let o3hour = {
                                scode: param.scode,
                                device_code: o3base.device_code,
                                time_cj: param.time_cj_real,
                                time_js: Date.now(),
                                rtype: o3base.rtype,
                                degree_yj: o3base.degree_yj,
                                degree_fwj: o3base.degree_fwj,
                                pix: o3base.pix,
                                distance: o3base.distance,
                                atype: o3base.atype,
                            };
                            for (let i = 0; i < o3base.distance; i = i + 15) {
                                let height = 'h_' + i.toString();
                                if (o3base[height] || o3base[height] == 0) {
                                    //计算平均值
                                    let avg = thunkify(avg_by_height);
                                    let avgParam = {
                                        height: height,
                                        table: param.table,
                                        whereby: whereby
                                    };
                                    let avg_result = yield avg(avgParam);
                                    if (avg_result) {
                                        o3hour[height] = Number(avg_result);
                                    } else {
                                        logInfo.error("计算高度上的平均值失败" + param.scode + " " + err.toString());
                                    }
                                }
                            }
                            conn.close();
                            callback(null, o3hour);

                        });


                    })

                }
            });
        } else {
            logInfo.error(param.scode + "统计平均值数据库连接失败：" + err);
        }

    });
}

function avg_by_height(param, callback) {
    try {
        let table = param.table;
        mongodb.connect(conStr, function (err, conn) {
            if (!err) {
                conn.collection(table, {safe: true}, function (err, dbc) {
                    if (err) {
                        logInfo.error("数据集合连接失败");
                        conn.close();
                    } else {
                        dbc.aggregate([
                            {$match: param.whereby},
                            {$group: {_id: "$scode", avg: {$avg: "$" + param.height}}}
                        ], function (err, result) {
                            if (err) {
                                logInfo.error("平均值计算失败：" + err.toString());
                                conn.close();
                            }
                            conn.close();
                            callback(null, result[0].avg.toFixed(config.decimalPlaces));
                        });
                    }
                });
            } else {
                logInfo.error("平均值计算数据库连接失败：" + err);
            }
        });
    } catch (e) {
        logInfo.error("固定高度平均值计算异常：" + e.toString());
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
            logInfo.error("数据库连接失败:" + err);
        }

    });

}

/*更新数据库*/
function upDb(where, $set, table, msg) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection(table, {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                } else {
                    dbc.updateMany(where, {$set: $set}, function (err, result) {
                        if (err) {
                            logInfo.error("数据更新失败" + err.toString());
                            conn.close();
                        } else {
                            conn.close();
                            logInfo.info("更新成功:" + msg);
                        }
                    });

                }
            });
        } else {
            logInfo.error("数据库连接失败:" + err);
        }

    });
}


//获取当前小时的整点代码
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

function dateFormat(shijianchuo) { //shijianchuo是整数，否则要parseInt转换
    let time = new Date(shijianchuo);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y.toString() + "-" + add0(m).toString() + "-" + add0(d).toString() + " " + add0(h).toString() + ':' + add0(mm).toString() + ':' + add0(s).toString();
}

//获取当前月份的天数，传入时间戳
function mGetDate(date) {
    let now = new Date(date);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let d = new Date(year, month, 0);
    return d.getDate();
}

function gkUpTimeRate() {
    let time = Date.now();
    let dt = hourFormat(Date.now());
    let time_e = Date.parse(new Date(dt)) - 60 * 60 * 1000;
    let time_s = time_e - 24 * 60 * 60 * 1000;
    let webMsg = {};
    co(function* () {
        let gkArr;
        //  查询国控点信息
        try {
            let gk = thunkify(getScode);
            gkArr = yield gk({type: '1'});
            if (!gkArr || gkArr.length === 0) {
                return false;
            }
        } catch (e) {
            logInfo.error("获取国控点信息失败：" + e.toString());
        }
        for (let i = 0; i < gkArr.length; i++) {
            webMsg[gkArr[i]] = {};
            //  获取国控点最后通讯时间
            try {
                let getGk = thunkify(getGkUpTime);
                let gkUptime = yield getGk({scode: gkArr[i]});
                if (gkUptime) {
                    webMsg[gkArr[i]]['upTime'] = gkUptime;
                }
            } catch (e) {
                logInfo.error("获取国控点通讯时间失败" + e.toString());
            }
            //  统计国控点过去一天的通讯率
            let gkra;
            try {
                let ra = thunkify(gkRate);
                gkra = yield ra({scode: gkArr[i], time_s: time_s, time_e: time_e});
                if (gkra) {
                    webMsg[gkArr[i]]['rate'] = gkra;
                }
            } catch (e) {
                logInfo.error("统计国控点通讯率失败" + e.toString());
            }
            //  修改通讯率
            if (gkra) {
                let $Set = {rate: gkra};
                upDb({code: gkArr[i]}, $Set, 'b_site', '更新国控点接收率成功:' + new Date());
            }
        }
        webMsg.wtype = 'gkDTTransport';
        sendMsg(webMsg);
    });
}

function getGkUpTime(param, callback) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection('b_site', {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                    callback(null, false);
                } else {
                    dbc.find({code: param.scode, type: '1'}).toArray(function (err, rs) {
                        if (err) {
                            logInfo.error("数据查询失败" + err.toString());
                            conn.close();
                            callback(null, false);
                        } else {
                            if (rs.length === 0) {
                                logInfo.error("无国控点");
                                conn.close();
                                callback(null, false);
                            } else {
                                conn.close();
                                logInfo.info("国控点通讯时间查询成功");
                                callback(null, rs[0].upTime === '' ? '-' : rs[0].upTime);
                            }
                        }
                    });

                }
            });
        } else {
            logInfo.error("数据库连接失败:" + err);
            callback(null, false);
        }

    });
}

function gkRate(param, callback) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection('d_air', {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                    callback(null, false);
                } else {
                    dbc.count({
                        scode: param.scode,
                        time_cj: {"$gte": Number(param.time_s), "$lte": Number(param.time_e)}
                    }, function (err, count) {
                        if (err) {
                            conn.close();
                            logInfo.error("国控点接收率统计失败:" + err);
                            callback(null, false);
                            return false;
                        }
                        let rate = parseInt(count / 25 * 100).toString() + '%';
                        callback(null, rate);
                    });
                }
            });
        } else {
            logInfo.error("数据库连接失败:" + err);
            callback(null, false);
        }
    });
}

/*获取监控点编号*/
function getScode(where, callback) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection('b_site', {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                } else {
                    dbc.distinct('code', where, function (err, result) {
                        if (err) {
                            logInfo.error("获取监测点失败" + err.toString());
                        } else {
                            conn.close();
                            callback(null, result);
                        }

                    });

                }
            });
        } else {
            logInfo.error("获取监控点数据库连接失败：" + err);

        }

    });
}

function deviceOnline() {
    co(function* () {
        let device, data = {};
        //  查询设备
        try {
            let de = thunkify(getDevice);
            device = yield de();
            if (!device || device.length === 0) {
                return false;
            }
        } catch (e) {
            logInfo.error("设备查询失败" + e.toString());
        }
        for (let i = 0; i < device.length; i++) {
            if (i % 2 === 0) {
                data[device[i]] = {"is_online": true};
            } else {
                data[device[i]] = {"is_online": false};
            }
            let state;
            if (data[device[i]]['is_online']) state = true;
            else state = false;
            let $Set = {state: state};
            upDb({code: device[i]}, $Set, 'o_device', '更新设备当前联网状态成功:' + new Date());
        }
        data.wtype = 'deviceOnline';
        sendMsg(data);
    });
}

function getDevice(callback) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection('o_device', {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("数据集合连接失败");
                    conn.close();
                } else {
                    dbc.distinct('code', function (err, result) {
                        if (err) {
                            logInfo.error("设备查询失败" + err.toString());
                        } else {
                            conn.close();
                            callback(null, result);
                        }

                    });

                }
            });
        } else {
            logInfo.error("获取监控点数据库连接失败：" + err);

        }

    });
}

function makeCone() {
    co(function* () {
        logInfo.info('开始绘制锥形图');
        let time = Date.now();
        let rotate_deg = config.coneRotateDeg.toString();
        let time_cj_start = time - config.o3DataInterval * 2 * 60 * 60 * 1000;
        let time_cj_end = time;
        let factor = 'o3';
        let up_deg = '0';
        let type = '0';
        let h_start = '0', h_end = '3000', h_index = '15';
        let data = {
            rotate_deg: rotate_deg,
            time_cj_start: dataString(time_cj_start),
            time_cj_end: dataString(time_cj_end),
            factor: factor,
            up_deg: up_deg,
            type: type,
            h_start: h_start,
            h_end: h_end,
            h_index: h_index
        };
        // 查询设备
        let fd = thunkify(findDevice);
        let fd_callback = yield fd();
        if (!fd_callback) {
            return false;
        }
        for (let i = 0; i < fd_callback.length; i++) {
            data.scode = fd_callback[i].site;
            data.device_code = fd_callback[i].code;
            if (i % 2 === 0) {
                data.up_deg = '0';
            } else {
                data.up_deg = '80';
            }
            coneLine(data);
        }
    });
}

function findDevice(callback) {
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection('o_device', {safe: true}, function (err, dbc) {
                if (err) {
                    logInfo.error("绘制锥形图数据集合连接失败");
                    conn.close();
                    callback(null, false);
                } else {
                    dbc.find().toArray(function (err, result) {
                        if (err) {
                            conn.close();
                            logInfo.error("绘制锥形图设备查询失败" + err.toString());
                            callback(null, false);
                        } else {
                            conn.close();
                            callback(null, result);
                        }
                    });
                }
            });
        } else {
            logInfo.error("绘制锥形图数据库连接失败：" + err);

        }

    });
}

function coneLine(data) {
    let opt = {
        method: "POST",
        host: config.DBServer,
        port: config.DBSPort,
        path: '/api/d_cones/line',
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
                logInfo.info('绘制锥形图：' + data);
            });
        }
        else {
            logInfo.error('绘制锥形图失败');
        }
    });
    requ.write(JSON.stringify(data) + "\n");
    requ.end('');
    requ.on('error', function (e) {
        logInfo.error('绘制锥形图失败:' + e);
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
            logInfo.error('webSocket推送失败');
        }
    });
    requ.write(JSON.stringify(msg) + "\n");
    requ.end('');
    requ.on('error', function (e) {
        logInfo.error('webSocket推送失败:' + e);
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
    return y.toString() + '-' + add0(m).toString() + '-' + add0(d).toString() + ' ' + add0(h).toString() + ':' + add0(mm).toString() + ':' + add0(s).toString();
}

function reqGKPosition(city) {
    let options = {
        host: config.gkPositionUrl,
        port: 80,
        path: '/api/v1/air_all/stations',
        method: 'GET',
        headers: {
            "gateway_channel": "http",
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "APPCODE 165dabf08f4848d394512415d10576c5"
        }
    };
    let req = http.request(options, function (serverFeedback) {
        if (serverFeedback.statusCode === 200) {
            let body = [];
            serverFeedback.on('data', function (data) {
                body.push(data);
            }).on('end', function () {
                let data = Buffer.concat(body).toString();
                data = JSON.parse(data);
                let gk = data.data;
                for (let i = 0; i < gk.length; i++) {
                    let d = {}, w = {};
                    if (gk[i].city.indexOf(city) !== -1 && gk[i].station_level === '国控') {
                        d.longitude = gk[i].lng;
                        d.latitude = gk[i].lat;
                        w.name = gk[i].station;
                        let $set = d;
                        let where = w;
                        upDb(where, $set, 'b_site', "更新国控点坐标:" + new Date());
                    }
                }
            });
        }
        else {
            logInfo.error('webSocket推送失败');
        }
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}

function reqGK(city, city_code) {
    let options = {
        host: config.airUrl,
        port: 80,
        path: '/api/querys/station_names.json?city=' + encodeURI(city) + '&token=' + config.airToken,
        method: 'GET',
        headers: {
            'accept': '*/*',
            'content-type': "application/atom+xml",
            'accept-encoding': 'gzip, deflate',
            'user-agent': 'nodejs rest client'
        }
    };
    let req = http.request(options, function (serverFeedback) {
        if (serverFeedback.statusCode === 200) {
            let body = [];
            serverFeedback.on('data', function (data) {
                body.push(data);
            }).on('end', function () {
                let data = Buffer.concat(body).toString();
                data = JSON.parse(data);
                if (data.error) {
                    logInfo.error(data.error);
                    return false;
                }
                let gk = [];
                let stations = data.stations;
                for (let i = 0; i < stations.length; i++) {
                    let d = {};
                    console.log(stations[i]);
                    d.name = stations[i].station_name;
                    d.code = stations[i].station_code;
                    d.type = '1';
                    d.city = city_code;
                    d.area = '';
                    d.upTime = '';
                    d.rate = '';
                    gk.push(d);
                }
                inDb(gk, 'b_site', "国控点入库成功:" + new Date());
            });
        }
        else {
            logInfo.error('国控点入库失败');
        }
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}


exports.init = function () {
    scheduleCronstyle();
    console.log("定时任务启动成功");
    logInfo.info('定时任务启动成功');
};