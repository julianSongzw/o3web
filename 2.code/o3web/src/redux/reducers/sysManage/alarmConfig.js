/*
 * @Author: wei.jq 
 * @Date: 2017-11-01 16:32:41 
 * @Last Modified by:   wei.jq 
 * @Last Modified time: 2017-11-01 16:32:41 
 *@Function:undefined 
 */


import * as msAc from '../../actions/sysManage/alarmConfig';
import { addOpt, editOpt, deleteOpt } from '../share';

const initState = {
    //数据列表
    list: {
        count: 0,
        datas: [],
        msg: '',
        ret: 0
    },
    //添加临时数据    
    addObj: {},
    //修改临时数据        
    editObj: {},
    //删除ids            
    delIds: [],
    //查询操作状态
    isLoading: false,
    //添加操作状态
    isAdding: false,
    //修改操作状态    
    isEditing: false,
    //删除操作状态    
    isDeling: false
}

export default function AlarmConfig(state = initState, action) {
    switch (action.type) {
        //查询
        case msAc.ALARM_QUERY_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case msAc.ALARM_QUERY_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case msAc.ALARM_QUERY_FAIL:
            return {
                ...state,
                isLoading: false
            }
        //添加
        case msAc.ALARM_ADD_SUBMIT:
            return {
                ...state,
                addObj: action.payload,
                isAdding: true
            }
        case msAc.ALARM_ADD_SUCCESS:
            return addOpt(state, action);
        case msAc.ALARM_ADD_FAIL:
            return {
                ...state,
                isAdding: false
            }
        //修改
        case msAc.ALARM_EDIT_SUBMIT:
            return {
                ...state,
                editObj: action.payload,
                isEditing: true
            }
        case msAc.ALARM_EDIT_SUCCESS:

            return editOpt(state, action);
        case msAc.ALARM_EDIT_FAIL:
            return {
                ...state,
                isEditing: false
            }
        //删除
        case msAc.ALARM_DELETE_SUBMIT:
            return {
                ...state,
                delIds: action.payload,
                isDeling: true
            }
        case msAc.ALARM_DELETE_SUCCESS:

            return deleteOpt(state, action);
        case msAc.ALARM_DELETE_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}