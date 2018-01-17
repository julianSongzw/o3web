/**
 * Created by DELL on 2017/10/17.
 * 伪彩图查询接口
 */
import { createAction } from 'redux-actions';

let prefix = 'D_PCOLORS_';
//查询
export const SINGLE_QUERY = 'SINGLE_QUERY';
export const singleQuery= createAction(SINGLE_QUERY);

//查询成功
export const SINGLE_QUERY_SUCCESS = 'SINGLE_QUERY_SUCCESS';
export const singleQuerySuccess= createAction(SINGLE_QUERY_SUCCESS);

//查询失败
export const SINGLE_QUERY_FAIL = 'SINGLE_QUERY_FAIL';
export const singleQueryFail= createAction(SINGLE_QUERY_FAIL);