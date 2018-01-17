/*
 * @Author: wei.jq 
 * @Date: 2017-10-31 10:01:07 
 * @Last Modified by:   wei.jq 
 * @Last Modified time: 2017-10-31 10:01:07 
 * @Function:监测点配置 
 */

import * as msAc from '../../actions/sysManage/monitorSite';
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


export default function MonitorSite(state = initState, action) {
    switch (action.type) {
        //查询
        case msAc.QUERY_SITE_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case msAc.QUERY_SITE_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case msAc.QUERY_SITE_FAIL:
            return {
                ...state,
                isLoading: false
            }
        //添加
        case msAc.ADD_SITE_SUBMIT:
            return {
                ...state,
                addObj: action.payload,
                isAdding: true
            }
        case msAc.ADD_SITE_SUCCESS:
            return addOpt(state, action);
        case msAc.ADD_SITE_FAIL:
            return {
                ...state,
                isAdding: false
            }
        //修改
        case msAc.EDIT_SITE_SUBMIT:
            return {
                ...state,
                editObj: action.payload,
                isEditing: true
            }
        case msAc.EEDIT_SITE_SUCCESS:

            return editOpt(state, action);
        case msAc.EDIT_SITE_FAIL:
            return {
                ...state,
                isEditing: false
            }
        //删除
        case msAc.DELETE_SITE_SUBMIT:
            return {
                ...state,
                delIds: action.payload,
                isDeling: true
            }
        case msAc.DELETE_SITE_SUCCESS:

            return deleteOpt(state, action);
        case msAc.DELETE_SITE_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}