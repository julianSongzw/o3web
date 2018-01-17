/**
 * Created by DELL on 2017/10/17.
 */
import { createAction } from 'redux-actions';

//单点对比查询
export const SCONTRAST_QUERY = 'SCONTRAST_QUERY';
export const scontrastQuery= createAction(SCONTRAST_QUERY);

//单点对比查询成功
export const SCONTRAST_QUERY_SUCCESS = 'SCONTRAST_QUERY_SUCCESS';
export const scontrastQuerySuccess= createAction(SCONTRAST_QUERY_SUCCESS);

//单点对比查询失败
export const SCONTRAST_QUERY_FAIL = 'SCONTRAST_QUERY_FAIL';
export const scontrastQueryFail= createAction(SCONTRAST_QUERY_FAIL);