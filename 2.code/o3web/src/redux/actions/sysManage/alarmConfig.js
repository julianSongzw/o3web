/**
 * weijq
 */

import { createAction } from 'redux-actions';

//add
export const ALARM_ADD_SUBMIT = 'ALARM_ADD_SUBMIT';
export const addAlarmSubmit = createAction(ALARM_ADD_SUBMIT);

export const ALARM_ADD_SUCCESS = 'ALARM_ADD_SUCCESS';
export const addAlarmSuccess = createAction(ALARM_ADD_SUCCESS);

export const ALARM_ADD_FAIL = 'ALARM_ADD_FAIL';
export const addAlarmFail = createAction(ALARM_ADD_FAIL);

//edit
export const ALARM_EDIT_SUBMIT = 'ALARM_EDIT_SUBMIT';
export const editAlarmSubmit = createAction(ALARM_EDIT_SUBMIT);

export const ALARM_EDIT_SUCCESS = 'ALARM_EDIT_SUCCESS';
export const editAlarmSuccess = createAction(ALARM_EDIT_SUCCESS);

export const ALARM_EDIT_FAIL = 'ALARM_EDIT_FAIL';
export const editAlarmFail = createAction(ALARM_EDIT_FAIL);

//del
export const ALARM_DELETE_SUBMIT = 'ALARM_DELETE_SUBMIT';
export const deleteAlarmSubmit = createAction(ALARM_DELETE_SUBMIT);

export const ALARM_DELETE_SUCCESS = 'ALARM_DELETE_SUCCESS';
export const deleteAlarmSuccess = createAction(ALARM_DELETE_SUCCESS);

export const ALARM_DELETE_FAIL = 'ALARM_DELETE_FAIL';
export const deleteAlarmFail = createAction(ALARM_DELETE_FAIL);

//query
export const ALARM_QUERY_SUBMIT = 'ALARM_QUERY_SUBMIT';
export const queryAlarmSubmit = createAction(ALARM_QUERY_SUBMIT);

export const ALARM_QUERY_SUCCESS = 'ALARM_QUERY_SUCCESS';
export const queryAlarmSuccess = createAction(ALARM_QUERY_SUCCESS);

export const ALARM_QUERY_FAIL = 'ALARM_QUERY_FAIL';
export const queryAlarmFail = createAction(ALARM_QUERY_FAIL);