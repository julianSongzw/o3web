/**
 * Created by DELL on 2017/10/17.
 */
import { createAction } from 'redux-actions';

//环比同比查询
export const YMCONTRAST_QUERY = 'YMCONTRAST_QUERY';
export const ymcontrastQuery= createAction(YMCONTRAST_QUERY);

//环比同比查询成功
export const YMCONTRAST_QUERY_SUCCESS = 'YMCONTRAST_QUERY_SUCCESS';
export const ymcontrastQuerySuccess= createAction(YMCONTRAST_QUERY_SUCCESS);

//环比同比查询失败
export const YMCONTRAST_QUERY_FAIL = 'YMCONTRAST_QUERY_FAIL';
export const ymcontrastQueryFail= createAction(YMCONTRAST_QUERY_FAIL);