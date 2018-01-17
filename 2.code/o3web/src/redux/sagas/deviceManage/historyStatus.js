/**
 * weijq
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { dataService } from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/deviceManage/historyStatus';

function* queryData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.devManageUrl.queryHisStatus,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg));                
            } else {
                yield put(act.querySuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* monitorSiteSaga() {
    yield takeEvery(act.QUERY_SUBMIT, queryData);
}
