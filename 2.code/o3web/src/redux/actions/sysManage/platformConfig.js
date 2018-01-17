/**
 * weijq
 */

 import {createAction} from 'redux-actions';

 export const FORM_SUBMIT = 'FORM_SUBMIT';
 export const formSubmit = createAction(FORM_SUBMIT);

 export const SUBMIT_SUCCESS = 'FORM_SUBMIT';
 export const submitSuccess = createAction(SUBMIT_SUCCESS);

 export const SUBMIT_FAIL = 'SUBMIT_FAIL';
 export const submitFail = createAction(SUBMIT_FAIL);

 export const QUERY_SUBMIT = 'QUERY_SUBMIT';
 export const querySubmit = createAction(QUERY_SUBMIT);

 export const QUERY_SUCCESS = 'QUERY_SUCCESS';
 export const querySuccess = createAction(QUERY_SUCCESS);

 export const QUERY_FAIL = 'QUERY_FAIL';
 export const queryFail = createAction(QUERY_FAIL);