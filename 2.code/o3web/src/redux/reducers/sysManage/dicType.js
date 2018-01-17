/*
 * @Author: wei.jq 
 * @Date: 2017-11-01 16:32:41 
 * @Last Modified by:   wei.jq 
 * @Last Modified time: 2017-11-01 16:32:41 
 *@Function:undefined 
 */


import * as sdAc from '../../actions/sysManage/dicType';
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

export default function DicType(state = initState, action) {
    switch (action.type) {
        //查询
        case sdAc.QUERY_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case sdAc.QUERY_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case sdAc.QUERY_FAIL:
            return {
                ...state,
                isLoading: false
            }
        //添加
        case sdAc.ADD_SUBMIT:
            return {
                ...state,
                addObj: action.payload,
                isAdding: true
            }
        case sdAc.ADD_SUCCESS:
            return addOpt(state, action);
        case sdAc.ADD_FAIL:
            return {
                ...state,
                isAdding: false
            }
        //修改
        case sdAc.EDIT_SUBMIT:
            return {
                ...state,
                editObj: action.payload,
                isEditing: true
            }
        case sdAc.EDIT_SUCCESS:

            return editOpt(state, action);
        case sdAc.EDIT_FAIL:
            return {
                ...state,
                isEditing: false
            }
        //删除
        case sdAc.DELETE_SUBMIT:
            return {
                ...state,
                delIds: action.payload,
                isDeling: true
            }
        case sdAc.DELETE_SUCCESS:

            return deleteOpt(state, action);
        case sdAc.DELETE_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}