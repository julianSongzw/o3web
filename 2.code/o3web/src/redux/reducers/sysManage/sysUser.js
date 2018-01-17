/*
 * @Author: wei.jq 
 * @Date: 2017-10-30 17:01:21 
 * @Last Modified by: wei.jq
 * @Last Modified time: 2017-10-30 17:39:18
 * @Function:user reducer 
 */

import * as suAc from '../../actions/sysManage/userManage';
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

export default function SysUser(state = initState, action) {
    switch (action.type) {
        //查询
        case suAc.QUERY_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case suAc.QUERY_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case suAc.QUERY_FAIL:
            return {
                ...state,
                isLoading: false
            }
        //添加
        case suAc.ADD_SUBMIT:
            return {
                ...state,
                addObj: action.payload,
                isAdding: true
            }
        case suAc.ADD_SUCCESS:
            return addOpt(state, action);
        case suAc.ADD_FAIL:
            return {
                ...state,
                isAdding: false
            }
        //修改
        case suAc.EDIT_SUBMIT:
            return {
                ...state,
                editObj: action.payload,
                isEditing: true
            }
        case suAc.EDIT_SUCCESS:
            
            return editOpt(state,action);
        case suAc.EDIT_FAIL:
            return {
                ...state,
                isEditing: false
            }
        //删除
        case suAc.DELETE_SUBMIT:
            return {
                ...state,
                delIds: action.payload,
                isDeling: true
            }
        case suAc.DELETE_SUCCESS:
            
            return deleteOpt(state,action);
        case suAc.DELETE_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}