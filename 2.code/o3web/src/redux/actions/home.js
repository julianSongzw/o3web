/**

 * @Title: home.js
 * @Description: 主页action
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import { createAction } from 'redux-actions';

//设备列表
export const GETDEVICELIST_SUBMIT = 'GETDEVICELIST_SUBMIT';
export const getDeviceListSubmit= createAction(GETDEVICELIST_SUBMIT);

//获取设备列表成功
export const GETDEVICELIST_SUCCESS = 'GETDEVICELIST_SUCCESS';
export const getDeviceListSuccess= createAction(GETDEVICELIST_SUCCESS);

//获取设备列表失败
export const GETDEVICELIST_FAIL = 'GETDEVICELIST_FAIL';
export const getDeviceListFail= createAction(GETDEVICELIST_FAIL);

//国控点列表
export const GETNATIONALCTLPOINT_SUBMIT = 'GETNATIONALCTLPOINT_SUBMIT';
export const getNationalCtlPointSubmit= createAction(GETNATIONALCTLPOINT_SUBMIT);

//获取国控点列表成功
export const GETNATIONALCTLPOINT_SUCCESS = 'GETNATIONALCTLPOINT_SUCCESS';
export const getNationalCtlPointSuccess= createAction(GETNATIONALCTLPOINT_SUCCESS);

//获取国控点列表失败
export const GETNATIONALCTLPOINT_FAIL = 'GETNATIONALCTLPOINT_FAIL';
export const getNationalCtlPointFail= createAction(GETNATIONALCTLPOINT_FAIL);