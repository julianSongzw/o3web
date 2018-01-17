/**
 * Created by DELL on 2017/10/17.
 */
import { createAction } from 'redux-actions';

//报表统计查询
export const STATISTICS_QUERY = 'STATISTICS_QUERY';
export const statisticsQuery= createAction(STATISTICS_QUERY);

//报表统计查询成功
export const STATISTICS_QUERY_SUCCESS = 'STATISTICS_QUERY_SUCCESS';
export const statisticsQuerySuccess= createAction(STATISTICS_QUERY_SUCCESS);

//报表统计查询失败
export const STATISTICS_QUERY_FAIL = 'STATISTICS_QUERY_FAIL';
export const statisticsQueryFail= createAction(STATISTICS_QUERY_FAIL);