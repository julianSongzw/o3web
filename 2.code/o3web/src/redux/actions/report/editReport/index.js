/* 
 * @Title: dataDic action 
 * @Description: Todo 
 * @Author: weijq@cychina.cn (韦继强) 
 * @Date: 2017-11-129 09:31:35 
 * @Last Modified by: weijq@cychina.cn (韦继强)
 * @Last Modified time: 2017-11-29 09:32:26
 * @Version:V1.0 
 * Company: 合肥安慧软件有限公司 
 * Copyright: Copyright (c) 2017' 
 */


import { createAction } from 'redux-actions';

let prefix = 'EDIT_REPORT_';

//query
export const QUERY_SUBMIT = prefix + 'QUERY_SUBMIT';
export const querySubmit = createAction(QUERY_SUBMIT);

export const QUERY_SUCCESS = prefix + 'QUERY_SUCCESS';
export const querySuccess = createAction(QUERY_SUCCESS);

export const QUERY_FAIL = prefix + 'QUERY_FAIL';
export const queryFail = createAction(QUERY_FAIL);

//add
export const ADD_SUBMIT = prefix + 'ADD_SUBMIT';
export const addSubmit = createAction(ADD_SUBMIT);

export const ADD_SUCCESS = prefix + 'ADD_SUCCESS';
export const addSuccess = createAction(ADD_SUCCESS);

export const ADD_FAIL = prefix + 'ADD_FAIL';
export const addFail = createAction(ADD_FAIL);

//edit
export const DOWNLOAD_SUBMIT = prefix + 'DOWNLOAD_SUBMIT';
export const downloadSubmit = createAction(DOWNLOAD_SUBMIT);

export const DOWNLOAD_SUCCESS = prefix + 'DOWNLOAD_SUCCESS';
export const downloadSuccess = createAction(DOWNLOAD_SUCCESS);

export const DOWNLOAD_FAIL = prefix + 'DOWNLOAD_FAIL';
export const downloadFail = createAction(DOWNLOAD_FAIL);

//del
export const DELETE_SUBMIT = prefix + 'DELETE_SUBMIT';
export const deleteSubmit = createAction(DELETE_SUBMIT);

export const DELETE_SUCCESS = prefix + 'DELETE_SUCCESS';
export const deleteSuccess = createAction(DELETE_SUCCESS);

export const DELETE_FAIL = prefix + 'DELETE_FAIL';
export const deleteFail = createAction(DELETE_FAIL);
