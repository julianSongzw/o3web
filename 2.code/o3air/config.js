/**
 * Created by zll on 2016/7/28.
 * 配置文件
 */
module.exports = {
     'jwtTokenSecret': 'E201002007',//配置token加密key
    'dbConnStr': 'mongodb://admin:admin123456@192.168.10.43:40000/o3db?ConnectTimeout=30000;ConnectionLifetime=300000;MinimumPoolSize=8;MaximumPoolSize=256;Pooled=true',//配置mongodb连接
     'airUrl':'www.pm25.in', //空气质量地址
    'weatherUrl':'free-api.heweather.com', //大气气象地址
    'gkPositionUrl':'chinair.market.alicloudapi.com',   //  国控点坐标信息
    'airToken': '5j1znBVAsnSf5xQyNQyq', //空气质量key
    'weatherToken': '48faf8c9d91841c986f524ed993d3740', //大气气象key
    'airJob': '5 5 * * * *', //获取空气质量定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'weatherJob': '10 10 * * * *', //获取空气质量定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'o3HourJob':'01 05 * * * *', //臭氧一小时定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'decimalPlaces':0,   //平均值计算保留小数位数
    'o3_8h_job':'01 14 * * * *', //臭氧八小时定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'o3_24h_job':'01 03 00 * * *', //臭氧24小时定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'o3_w_job':'01 40 00 * * 1', //臭氧周平均定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'o3_m_job':'01 20 00 01 * *', //臭氧月平均定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'o3radarJob':'01 01 00 * * *', //臭氧基础数据获取定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'o3_y_job':'01 30 00 01 01 *', //臭氧年平均定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'gkUpTimeRateJob':'50 59 * * * *', //臭氧年平均定时器 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
    'websocketHost':'192.168.10.139',    //  websocket服务地址
    'websocketPort':8005,    //  websocket服务端口
    'coneRotateDeg':120,      // 锥形图旋转角度
    'o3DataInterval':5,     //  数据间隔 5分钟
    'DBServer':'192.168.10.139',    //  数据交互服务
    'DBSPort':4700,     //  数据交互服务端口号
};