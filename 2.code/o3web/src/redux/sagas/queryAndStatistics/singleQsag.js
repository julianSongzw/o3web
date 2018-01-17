/**
 * Created by DELL on 2017/10/17.
 */
import { call, put, takeEvery } from 'redux-saga/effects';
import {dataService}  from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/queryAndStatistics/singleQact';

//查询
function* singleQuery(action) {
    try {
        // 数据请求参数构造
        let queryData={
            reqUrl:dataService.reqUrl.singleQuery,
            reqAuth:'',
            reqParam:action.payload
        };
        console.log(queryData,"sagas接收请求参数");
        debugger;
        const response = yield call(dataService.postRequest,queryData);
        //console.log(response.data,"8888888");
        //处理返回结果
        if (response) {
            if(response.data.ret===0)
                yield put(act.singleQueryFail());
            else {
                yield put(act.singleQuerySuccess(response.data.userData[0]));
            }
        }
    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* singleQuerySaga() {
    yield takeEvery(act.SINGLE_QUERY,singleQuery);

}