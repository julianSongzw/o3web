/**
 * Created by zdjie on 2017/10/19.
 */
import { call, put, takeEvery } from 'redux-saga/effects';
import {dataService}  from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/analysis/diffusion';

function* queryDataSubmit(action) {
    console.log("diffusion-----submit");
    try {
        // 数据请求参数构造
        let param={
            reqUrl:dataService.reqUrl.login,
            reqAuth:'',
            reqParam:action.payload
        };
        const response = yield call(dataService.postRequest,param);

        //处理返回结果
        if (response) {
            //debugger;
            if(response.data.ret===0)
                yield put(act.queryDataFail());
            else {
                yield put(act.queryDataSuccess(response.data.userData[0]));
            }
        }
    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* QueryDataSaga() {
    yield takeEvery(act.QUERYDATA_SUBMIT,queryDataSubmit);

}