/**
 * weijq
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { dataService } from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/sysManage/sysDic';

function* queryData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.querySysDic,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg.message));
            } else {
                yield put(act.querySuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

function* addData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.addSysDic,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg.message));
            } else {
                yield put(act.addSuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

function* editData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.editSysDic,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg.message));
            } else {
                yield put(act.editSuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

function* deleteData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.delSysDic,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                yield put(actMsg.optFail(response.data.msg.message));
            } else {
                yield put(act.deleteSuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* sysDicSaga() {
    yield takeEvery(act.QUERY_SUBMIT, queryData);
    yield takeEvery(act.ADD_SUBMIT, addData);
    yield takeEvery(act.EDIT_SUBMIT, editData);
    yield takeEvery(act.DELETE_SUBMIT, deleteData);
}
