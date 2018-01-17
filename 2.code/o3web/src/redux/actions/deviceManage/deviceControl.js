/**
 * weijq
 */

import { createAction } from 'redux-actions';

//add
export const DEVICE_CONTROL_SUBMIT = 'DEVICE_CONTROL_SUBMIT';
export const deviceControlSubmit = createAction(DEVICE_CONTROL_SUBMIT);

export const DEVICE_CONTROL_SUCCESS = 'DEVICE_CONTROL_SUCCESS';
export const deviceControlSuccess = createAction(DEVICE_CONTROL_SUCCESS);

export const DEVICE_CONTROL_FAIL = 'DEVICE_CONTROL_FAIL';
export const deviceControlFail = createAction(DEVICE_CONTROL_FAIL);

//query
export const QUERY_DEVICE_CONTROL = 'QUERY_DEVICE_CONTROL';
export const queryDeviceControl = createAction(QUERY_DEVICE_CONTROL);

export const QUERY_DEVICE_CONTROL_SUCCESS = 'QUERY_DEVICE_CONTROL_SUCCESS';
export const queryDeviceControlSuccess = createAction(QUERY_DEVICE_CONTROL_SUCCESS);

export const QUERY_DEVICE_CONTROL_FAIL = 'QUERY_DEVICE_CONTROL_FAIL';
export const queryDeviceControlFail = createAction(QUERY_DEVICE_CONTROL_FAIL);