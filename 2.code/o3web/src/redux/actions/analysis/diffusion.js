/**

 * @Title: diffusion.js
 * @Description: 扩散分析action
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

let prefix='DIFFUSION';
//请求数据
export const QUERYDATA_SUBMIT =prefix+ 'QUERYDATA_SUBMIT';
export const queryDataSubmit= createAction(QUERYDATA_SUBMIT);

//请求成功
export const QUERYDATA_SUCCESS =prefix+ 'QUERYDATA_SUCCESS';
export const queryDataSuccess= createAction(QUERYDATA_SUCCESS);

//请求失败
export const QUERYDATA_FAIL = prefix+'QUERYDATA_FAIL';
export const queryDataFail= createAction(QUERYDATA_FAIL);