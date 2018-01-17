/**
 * Created by zll on 2017/10/11.
 */
import { combineReducers } from 'redux'
import MsgTip from './msgTip' //页面提示语
import Login from './login' //登录页面
import SingleQred from './queryAndStatistics/singleQred' //登录页面
import Home from './home'; //主界面
import Correlation from './analysis/correlation' //因子相关性页面
import Sequence from './analysis/sequence' //时序分布图页面
import Diffusion from './analysis/diffusion' //扩散分析
import Radar from './analysis/radar' //雷达分析
import Scontrast from './queryAndStatistics/scontrast/scontrast'; //单点对比
import Mcontrast from './queryAndStatistics/mcontrast/mcontrast'; //多点对比
import Ymconstrast from './queryAndStatistics/ymconstrast/ymconstrast'; //同比环比
import Statistics from './queryAndStatistics/statistics/statistics'; //报表统计
import PlatformConfig from './sysManage/platformConfig'; //平台配置
import MonitorSite from './sysManage/moniterSite'; //站点配置
import Share from './share'; //共用数据
import SysUser from './sysManage/sysUser'; //用户管理
import AlarmConfig from './sysManage/alarmConfig'; //报警配置
import SysDic from './sysManage/sysDic'; //系统字典
import DicType from './sysManage/dicType'; //系统字典
import SysLog from './sysManage/sysLog'; //系统日志
import DevConfig from './deviceManage/deviceConfig'; //设备配置
import HistoryStatus from './deviceManage/historyStatus'; //设备配置DevControl
import DeviceControl from './deviceManage/deviceControl'; //设备配置DevControl
import DeviceAlarm from './deviceManage/deviceAlarm'; //设备配置DevControl
import EditReport from './report/editReport'; //设备配置DevControl
import SocketMiddle from './SocketMiddle';


export default combineReducers({
    MsgTip,
    Login,
    SingleQred,

    Scontrast,
    Mcontrast,
    Ymconstrast,
    Statistics,
    Home,
    Correlation,
    Sequence,
    PlatformConfig,
    Diffusion,
    Radar,
    Share,
    MonitorSite,
    SysUser,
    AlarmConfig,
    SysDic,
    DicType,
    SysLog,

    DevConfig,
    HistoryStatus,
    DeviceControl,
    DeviceAlarm,

    EditReport,
    SocketMiddle,
})