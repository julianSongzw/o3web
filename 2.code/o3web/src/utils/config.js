/**
 * Created by zll on 2017/10/9.
 */

export let config = {
    baseURL: 'http://192.168.10.139:4700',
    //测试url
    //baseURL: 'http://192.168.10.190:3001',
    // transformRequest: [function (data) {
    //     // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    //     data = Qs.stringify({});
    //     return data;
    // }],
    transformRequest: [function (data) {
        // Do whatever you want to transform the data
        let ret = '';
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],


    transformResponse: [function (data) {
        // 这里提前处理返回的数据
        return data;
    }],

    // 请求头信息
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },

    token: '',

    username: '',

    //parameter参数
    // params: {
    //     ID: 12345
    // },
    //mode : 'cors' ,
    //设置超时时间
    timeout: 10000,
    //返回数据类型
    responseType: 'json',
    imgServer: '192.168.10.192',
    //伪彩图查询服务器及伪彩图图片获取服务器
    wctQueryServer: 'http://192.168.10.30',
    wctImgServer: 'http://192.168.10.30:8800/images/o3_wct_uri/',
    mgtImgServer:'http://192.168.10.30:8800/images/o3_wct_uri/mgt/',
    //锥形图
    zxtImgServer:'http://192.168.10.30:8800/images/o3_wct_uri/zxt/',
    //因子最大最小值
    valueMax:500,
    valueMin:1,
    //最大小高度
    maxHeight:45000,
    minHeight:0,
    heightIntervalLength:20, //高度间隔下拉框长度
    heightStep:15,

    //时间间隔
    timeStep:300000,

    //近地面高度表示的具体高度
    floorHeight:0

};