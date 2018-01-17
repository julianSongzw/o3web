/**

 * @Title: correlation.js
 * @Description:  因子相关性 saga请求
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import { call, put, takeEvery } from 'redux-saga/effects';
import {dataService}  from '../../../utils/request';
import * as actMsg from '../../actions/msgTip';
import * as act from '../../actions/analysis/correlation';

function* queryDataSubmit(action) {
    try {
        // 数据请求参数构造
        let param={
            reqUrl:dataService.correlationUrl.getCorrelationUrl,
            reqAuth:'',
            reqParam:action.payload
        };
        const response = yield call(dataService.postRequest,param);

        //处理返回结果
        if (response) {
            if(response.data.ret===0)
                yield put(act.queryDataFail());
            else {
                yield put(act.queryDataSuccess(response.data));
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