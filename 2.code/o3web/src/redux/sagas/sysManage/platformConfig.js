/**
 * weijq
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { dataService } from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/sysManage/platformConfig';

function* queryPlat(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.queryPlat,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.getRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(act.queryFail());
            } else {
                yield put(act.querySuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

    function* platSubmit(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.platSubmit,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(act.submitFail());
            } else {
                yield put(act.formSubmit(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* platConfigSaga(){
    yield takeEvery(act.QUERY_SUBMIT,queryPlat);
    yield takeEvery(act.FORM_SUBMIT,platSubmit);
}
