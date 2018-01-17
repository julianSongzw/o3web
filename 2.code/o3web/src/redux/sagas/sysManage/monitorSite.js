/**
 * weijq
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { dataService } from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/sysManage/monitorSite';
import * as shareAc from '../../actions/share';

function* queryData(action) {
    try {
        // 数据请求参数构造
        let param = {
            reqUrl: dataService.sysManageUrl.queryMS,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);
        if (response) {
            if (response.data.ret === 0) {
                // yield put(act.querySiteFail(response.data));
                yield put(actMsg.optFail(response.data.msg.message));
            } else {
                yield put(act.querySiteSuccess(response.data));
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
            reqUrl: dataService.sysManageUrl.addMS,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);
        if (response) {
            if (response.data.ret === 0) {
                // yield put(act.addSiteFail(response.data));
                yield put(actMsg.optFail(response.data.msg.message));                
            } else {
                yield put(act.addSiteSuccess(response.data));
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
            reqUrl: dataService.sysManageUrl.editMS,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                // yield put(act.editSiteFail());
                yield put(actMsg.optFail(response.data.msg.message));                
            } else {
                yield put(act.editSiteSuccess(response.data));
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
            reqUrl: dataService.sysManageUrl.delMS,
            reqAuth: '',
            reqParam: action.payload
        };
        const response = yield call(dataService.postRequest, param);

        if (response) {
            if (response.data.ret === 0) {
                // yield put(act.deleteSiteFail());
                yield put(actMsg.optFail(response.data.msg.message));                                
            } else {
                yield put(act.deleteSiteSuccess(response.data));
            }
        }

    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* monitorSiteSaga() {
    yield takeEvery(act.QUERY_SITE_SUBMIT, queryData);
    yield takeEvery(act.ADD_SITE_SUBMIT, addData);
    yield takeEvery(act.EDIT_SITE_SUBMIT, editData);
    yield takeEvery(act.DELETE_SITE_SUBMIT, deleteData);
}
