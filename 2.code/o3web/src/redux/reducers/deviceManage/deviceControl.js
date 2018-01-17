/*
 * @Author: wei.jq 
 * @Date: 2017-11-01 16:32:41 
 * @Last Modified by:   wei.jq 
 * @Last Modified time: 2017-11-01 16:32:41 
 *@Function:undefined 
 */


import * as dcAc from '../../actions/deviceManage/deviceControl';
import { addOpt, editOpt, deleteOpt } from '../share';

const initState = {
    //数据列表
    list: {
        count: 0,
        datas: [],
        msg: '',
        ret: 0
    },
    //质控ids            
    addObj: [],
    //查询操作状态
    isLoading: false,
    //质控操作状态    
    isAdding: false
}

export default function DevControl(state = initState, action) {
    switch (action.type) {
        //查询
        case dcAc.QUERY_DEVICE_CONTROL:
            return {
                ...state,
                isLoading: true
            }
        case dcAc.QUERY_DEVICE_CONTROL_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case dcAc.QUERY_DEVICE_CONTROL_FAIL:
            return {
                ...state,
                isLoading: false
            }
        //质控
        case dcAc.DEVICE_CONTROL_SUBMIT:
            return {
                ...state,
                addObj: action.payload,                
                isDeling: true
            }
        case dcAc.DEVICE_CONTROL_SUCCESS:
            return addOpt(state, action);
        case dcAc.DEVICE_CONTROL_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}