/**
 * Created by dell on 2017/6/23.
 */
module.exports = {
  'dbConnStr': 'mongodb://admin:admin123456@192.168.10.43:40000/o3db',//配置mongodb连接串
  //	'dbConnStr': 'mongodb://192.168.10.30:27017/o3db',//配置mongodb连接串
  'logHost':'192.168.10.43:40000',//日志host
  'pwd':'123456', //默认系统登录密码
  'logSavedDay': 7, //系统日志保存在服务器上的时间(单位：天)
  'logDeleteJob': '30 50 23 * * *', //系统日志自动删除 cron风格定时器（6个占位符从左到右分别代表：秒、分、时、日、月、周几，'*'表示通配符）
  'accessControlAllowOrigin':'*', //请求header参数
  'websocketUrl':'192.168.10.139:8001',
  'h_start':0,  //高度起点默认值
  'h_end':45000, //高度终点默认值
  'h_index':15,  //高度间隔默认值
  'ftpServer':'192.168.10.139:8000',  //  文件服务器地址
  'reportUpload':'f:/programm/huanbao/fsWeb/public/report/',  //  报告保存路径
  'logoUpload':'f:/programm/huanbao/fsWeb/public/logo/',  //  logo保存路径
  'dayDataUpIndex':5*60*1000,  // 日统计时间间隔
  'weekDataUpIndex':60*60*1000,  // 周统计时间间隔
  'monthDataUpIndex':24*60*60*1000,   // 月统计时间间隔
  'sourceInterval':5 ,    //  数据源时间间隔
  'pcolorHost':'192.168.10.30',  //伪彩图服务IP
  'pcolorPort':80,  //  伪彩图服务端口
  'o3colorIndex':10,  //  臭氧颜色间隔
  'statusDelaytime':5,  //  定时推送
  'coneHost':'192.168.10.30',   //  锥形图服务IP
  'conePort':80,  //  锥形图服务端口
  'websocketHost':'192.168.10.139',
  'websocketPort':8005,
  'lowHeight':300,    //  近地面高度
};
