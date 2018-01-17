/*
 * @Author: wei.jq 
 * @Date: 2017-11-01 16:32:41 
 * @Last Modified by:   wei.jq 
 * @Last Modified time: 2017-11-01 16:32:41 
 *@Function:undefined 
 */


import * as hsAc from '../../actions/deviceManage/historyStatus';
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

export default function HisStatus(state = initState, action) {
    switch (action.type) {
        //查询
        case hsAc.QUERY_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case hsAc.QUERY_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case hsAc.QUERY_FAIL:
            return {
                ...state,
                isLoading: false
            }

        //删除
        case hsAc.DELETE_SUBMIT:
            return {
                ...state,
                delIds: action.payload,
                isDeling: true
            }
        case hsAc.DELETE_SUCCESS:

            return deleteOpt(state, action);
        case hsAc.DELETE_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}