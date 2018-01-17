/**
 * Created by DELL on 2017/10/17.
 */
import { createAction } from 'redux-actions';

//多点对比查询
export const MCONTRAST_QUERY = 'MCONTRAST_QUERY';
export const mcontrastQuery= createAction(MCONTRAST_QUERY);

//多点对比查询成功
export const MCONTRAST_QUERY_SUCCESS = 'MCONTRAST_QUERY_SUCCESS';
export const mcontrastQuerySuccess= createAction(MCONTRAST_QUERY_SUCCESS);

//多点对比查询失败
export const MCONTRAST_QUERY_FAIL = 'MCONTRAST_QUERY_FAIL';
export const mcontrastQueryFail= createAction(MCONTRAST_QUERY_FAIL);