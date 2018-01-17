/**
 * Created by zll on 2016/7/28.
 * 系统字典信息缓存
 */

var log4js = require('log4js');
log4js.configure("./logConfig.json");
var logInfo = log4js.getLogger('logAir');

var NodeCache = require( "node-cache" );
var dicCache = new NodeCache();

var mongodb = require('mongodb');
var db = mongodb();
var config =  require('./config');
var conStr=config.dbConnStr;

exports.init=function(){
    mongodb.connect(conStr, function (err, conn) {
        if (!err) {
            conn.collection('b_area',function (err, dbc) {
                if (err) {
                    conn.close();
                } else {
                    dbc.find({
                    }).toArray(function (err, rs) {
                        if (!err) {
                            if (rs.length > 0) {
                                for (var i = 0; i < rs.length; i++) {
                                    var temp=dicCache.set(rs[i].area_name,rs[i].area_code);
                                }
                            }
                            console.log("初始化数据字典成功");
                            logInfo.info("初始化数据字典成功");
                        }
                        conn.close();
                    });
                }
            });
        } else {
            conn.close();
            logInfo.error("初始化数据字典:数据库连接失败");
        }


    });
};

exports.getVaule=function(key){
    var temp=dicCache.get(key);
    return temp;
};

exports.setVaule=function(key,value,ttl){
    var temp=dicCache.set(key,value,ttl);
    return temp;
};

exports.setLongVaule=function(key,value){
    var temp=dicCache.set(key,value);
    return temp;
};

exports.delVaule=function(key){
    var temp=dicCache.del(key);
    return temp;
};

