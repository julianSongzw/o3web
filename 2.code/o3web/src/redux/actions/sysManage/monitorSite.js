/**
 * weijq
 */

import { createAction } from 'redux-actions';

//add
export const ADD_SITE_SUBMIT = 'ADD_SITE_SUBMIT';
export const addSiteSubmit = createAction(ADD_SITE_SUBMIT);

export const ADD_SITE_SUCCESS = 'ADD_SITE_SUCCESS';
export const addSiteSuccess = createAction(ADD_SITE_SUCCESS);

export const ADD_SITE_FAIL = 'ADD_SITE_FAIL';
export const addSiteFail = createAction(ADD_SITE_FAIL);

//edit
export const EDIT_SITE_SUBMIT = 'EDIT_SITE_SUBMIT';
export const editSiteSubmit = createAction(EDIT_SITE_SUBMIT);

export const EEDIT_SITE_SUCCESS = 'EEDIT_SITE_SUCCESS';
export const editSiteSuccess = createAction(EEDIT_SITE_SUCCESS);

export const EDIT_SITE_FAIL = 'EDIT_SITE_FAIL';
export const editSiteFail = createAction(EDIT_SITE_FAIL);

//del
export const DELETE_SITE_SUBMIT = 'DELETE_SITE_SUBMIT';
export const deleteSiteSubmit = createAction(DELETE_SITE_SUBMIT);

export const DELETE_SITE_SUCCESS = 'DELETE_SITE_SUCCESS';
export const deleteSiteSuccess = createAction(DELETE_SITE_SUCCESS);

export const DELETE_SITE_FAIL = 'DELETE_SITE_FAIL';
export const deleteSiteFail = createAction(DELETE_SITE_FAIL);

//query
export const QUERY_SITE_SUBMIT = 'QUERY_SITE_SUBMIT';
export const querySiteSubmit = createAction(QUERY_SITE_SUBMIT);

export const QUERY_SITE_SUCCESS = 'QUERY_SITE_SUCCESS';
export const querySiteSuccess = createAction(QUERY_SITE_SUCCESS);

export const QUERY_SITE_FAIL = 'QUERY_SITE_FAIL';
export const querySiteFail = createAction(QUERY_SITE_FAIL);