/**
 * weijq
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { dataService } from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/deviceManage/deviceControl';

function* queryData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.devManageUrl.queryDeviceControl,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg));
            } else {
                yield put(act.queryDeviceControlSuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

function* deviceControl(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.devManageUrl.deviceControl,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg));
            } else {
                yield put(act.deviceControlSuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}


export default function* monitorSiteSaga() {
    yield takeEvery(act.QUERY_DEVICE_CONTROL, queryData);
    yield takeEvery(act.DEVICE_CONTROL_SUBMIT, deviceControl);
}
