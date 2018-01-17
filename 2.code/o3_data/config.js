/**
 * Created by Jackie on 2017/10/23.
 * Author: 汪双顶
 * 版权所有: 合肥安慧软件有限公司
 */

module.exports = {
    //'dbConnStr': 'mongodb://admin:admin123@localhost:27017/avadata',//配置mongodb连接串
    // 'dbConnStr': 'mongodb://192.168.10.30:27017/o3db',//配置mongodb连接串
    'dbConnStr': 'mongodb://o3db:o3db@192.168.10.139:27017/o3db',//配置mongodb连接串
    'o3Job':[1,6,11,16,21,26,31,36,41,46,51,56],        // 定时任务获取臭氧数据
    'o3dataPath':'F:/programm/huanbao/o3_data_txt/',     //o3数据源
    'o3RealDataPath':'F:/programm/huanbao/data/',       //真实数据
};
