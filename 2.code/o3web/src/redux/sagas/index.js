/**
 * Created by zll on 2017/10/11.
 */
import { fork } from 'redux-saga/effects';

import loginSaga from './login'; //登录页面
import singleQuerySaga from './queryAndStatistics/singleQsag'; //登录页面
import  correlationQuerySage from './analysis/correlation'
import  diffusionQuerySage from './analysis/diffusion'
import platConfigSaga from './sysManage/platformConfig'; //平台配置
import monitorSiteSaga from './sysManage/monitorSite'; //监测点配置
import alarmConfigSaga from './sysManage/alarmConfig'; //报警配置
import sysDicSaga from './sysManage/sysDic'; //系统字典   
import dicTypeSaga from './sysManage/dicType'; //字典类型   
import sysLogSaga from './sysManage/sysLog'; //系统日志   
import sysUserSaga from './sysManage/sysUser'; //系统用户   
import deviceConfigSaga from './deviceManage/deviceConfig'; //设备配置
import deviceAlarmSaga from './deviceManage/deviceAlarm'; //设备报警
import deviceControlSaga from './deviceManage/deviceControl'; //设备质控
import historyStatusSaga from './deviceManage/historyStatus'; //设备历史状态
import editReportSaga from './report/editRepoert'; //报告编辑
import shareSaga from './share'; //设备历史状态
import homeSaga from './home'; //home页

export default function* root() {

	yield [
		fork(loginSaga),
		fork(shareSaga),
		fork(singleQuerySaga),
		fork(platConfigSaga),
		fork(monitorSiteSaga),
		fork(alarmConfigSaga),
		fork(sysDicSaga),
		fork(dicTypeSaga),
		fork(sysLogSaga),
		fork(sysUserSaga),
		fork(deviceConfigSaga),
		fork(deviceAlarmSaga),
		fork(deviceControlSaga),
		fork(historyStatusSaga),
		fork(editReportSaga),
		fork(correlationQuerySage),
		fork(diffusionQuerySage),
        fork(homeSaga)
	]
}

