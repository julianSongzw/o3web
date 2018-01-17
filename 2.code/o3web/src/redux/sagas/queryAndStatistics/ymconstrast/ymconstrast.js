/**
 * Created by DELL on 2017/10/17.
 */
import { call, put, takeEvery } from 'redux-saga/effects';
import {dataService}  from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../../actions/queryAndStatistics/ymconstrast/ymconstrast';

//单点查询查询
function* ymconstrast(action) {
    try {
        // 数据请求参数构造
        let queryData={
            reqUrl:dataService.reqUrl.singleQuery,
            reqAuth:'',
            reqParam:action.payload
        };
        console.log(queryData,"sagas接收请求参数");
        const response = yield call(dataService.postRequest,queryData);
        //处理返回结果
        if (response) {
            if(response.data.ret===0)
                yield put(act.ymcontrastQueryFail);
            else {
                yield put(act.ymcontrastQuerySuccess(response.data.userData[0]));
            }
        }
    } catch (error) {
        //处理异常
        yield put(actMsg.optFail(error.message));
    }
}

export default function* ymconstrastSaga() {
    yield takeEvery(act.YMCONTRAST_QUERY,ymconstrast);

}