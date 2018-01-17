/*
 * @Author: wei.jq 
 * @Date: 2017-11-01 16:32:41 
 * @Last Modified by:   wei.jq 
 * @Last Modified time: 2017-11-01 16:32:41 
 *@Function:undefined 
 */


import * as erAc from '../../actions/report/editReport';
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

export default function EditReport(state = initState, action) {
    switch (action.type) {
        //查询
        case erAc.QUERY_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case erAc.QUERY_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case erAc.QUERY_FAIL:
            return {
                ...state,
                isLoading: false
            }
        //添加
        case erAc.ADD_SUBMIT:
            return {
                ...state,
                addObj: action.payload,
                isAdding: true
            }
        case erAc.ADD_SUCCESS:
            return addOpt(state, action);
        case erAc.ADD_FAIL:
            return {
                ...state,
                isAdding: false
            }
        //下载
        case erAc.DOWNLOAD_SUBMIT:
            return {
                ...state,
                editObj: action.payload,
            }
        case erAc.DOWNLOAD_SUCCESS:
            return {
                ...state,
            };
        case erAc.DOWNLOAD_FAIL:
            return {
                ...state,
            }
        //删除
        case erAc.DELETE_SUBMIT:
            return {
                ...state,
                delIds: action.payload,
                isDeling: true
            }
        case erAc.DELETE_SUCCESS:

            return deleteOpt(state, action);
        case erAc.DELETE_FAIL:
            return {
                ...state,
                isDeling: false
            }
        default:
            return state;
    }
}