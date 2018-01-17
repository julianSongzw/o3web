/*
 * @Author: wei.jq 
 * @Date: 2017-10-30 11:39:14 
 * @Last Modified by: weijq@cychina.cn (韦继强)
 * @Last Modified time: 2017-12-18 15:57:13
 * @Function:share
 */

/**weijq share */

import * as shareAc from '../actions/share';
import * as platAc from '../actions/sysManage/platformConfig.js';

import { pubFunc } from '../../utils/pubFnc';

const initState = {
    //平台配置信息
    platConfig:{},
    //数据列表
    sysDic: [],
    //城市区划
    area: [],
    //检测因子
    factor: [],
    //级联选格式
    cityArea: [],
    //监测点
    monitorSite: {},
    //区域下的监测点组
    monitorSiteGroup: {},
    //站点下的因子组
    factorGroup: {},
    //色域
    factorColorList:{},
    //查询操作状态
    isSysDicLoading: false,
    isAreaLoading: false,
    isFactorLoading: false,
    isMSLoading: false,
    isMSGLoading: false
}


export default function Share(state = initState, action) {
    switch (action.type) {
        //平台查询
        case platAc.QUERY_SUBMIT:
        return {
            ...state,
            isPCLoading: true
        }
    case platAc.QUERY_SUCCESS:
        return {
            ...state,
            platConfig: action.payload,
            isPCLoading: false
        }
    case platAc.QUERY_FAIL:
        return {
            ...state,
            isPCLoading: false
        }
        //字典
        case shareAc.QUERY_SYSDIC:
            return {
                ...state,
                isSysDicLoading: true
            }
        case shareAc.QUERY_SYSDIC_SUCCESS:
            return {
                ...state,
                sysDic: action.payload,
                isSysDicLoading: false
            }
        case shareAc.QUERY_SYSDIC_FAIL:
            return {
                ...state,
                isSysDicLoading: false
            }

        //区划
        case shareAc.QUERY_AREA:
            return {
                ...state,
                isAreaLoading: true
            }
        case shareAc.QUERY_AREA_SUCCESS:
            return {
                ...state,
                area: action.payload,
                cityArea: pubFunc.areaOptions(pubFunc.arrayClone(action.payload)) || [],
                isAreaLoading: false
            }
        case shareAc.QUERY_SYSDIC_FAIL:
            return {
                ...state,
                isAreaLoading: false
            }

        //监测因子
        case shareAc.QUERY_FACTOR:
            return {
                ...state,
                isFactorLoading: true
            }
        case shareAc.QUERY_FACTOR_SUCCESS:
            return {
                ...state,
                factor: action.payload.datas,
                factorGroup: action.payload.group || {},
                isFactorLoading: false
            }
        case shareAc.QUERY_FACTOR_FAIL:
            return {
                ...state,
                isFactorLoading: false
            }

        //监测因子色域
        case shareAc.FACTOR_COLOR_LIST_QUERY:
            return {
                ...state,
                isFactorLoading: true
            }
        case shareAc.FACTOR_COLOR_LIST_QUERY_SUCCESS:
            return {
                ...state,
                factorColorList: action.payload,
                isFactorLoading: false
            }
        case shareAc.FACTOR_COLOR_LIST_QUERY_FAIL:
            return {
                ...state,
                isFactorLoading: false
            }

        //监测站点
        case shareAc.QUERY_SYS_SITE:
            return {
                ...state,
                isMSLoading: true
            }
        case shareAc.QUERY_SYS_SITE_SUCCESS:
            return {
                ...state,
                monitorSite: action.payload,
                isMSLoading: false
            }
        case shareAc.QUERY_SYS_SITE_FAIL:
            return {
                ...state,
                isMSLoading: false
            }

        case shareAc.LOGIN_OUT:
            return {
                ...state,
                outMsg: action.payload
            };
        //监测站点分组
        case shareAc.G_QUERY_SYS_SITE:
            return {
                ...state,
                isMSGLoading: true
            }
        case shareAc.G_QUERY_SYS_SITE_SUCCESS:
            return {
                ...state,
                monitorSiteGroup: action.payload,
                isMSGLoading: false
            }
        case shareAc.G_QUERY_SYS_SITE_FAIL:
            return {
                ...state,
                isMSGLoading: false
            }
        default:
            return state;
    }
}

//添加操作
export function addOpt(state, action) {
    let nextState = Object.assign({}, state);
    nextState.addObj.id = action.payload.id;
    nextState.list.datas.unshift(nextState.addObj);
    nextState.list.count += 1;
    nextState.isAdding = false;
    return nextState;
}
//修改操作
export function editOpt(state, action) {
    let nextState = Object.assign({}, state);
    nextState.list.datas.map(function (item, index) {
        if (nextState.list.datas[index].id == nextState.editObj.id) {
            nextState.list.datas[index] = nextState.editObj;
        }
    });
    nextState.isEditing = false;
    return nextState;
}
//删除操作
export function deleteOpt(state, action) {
    let nextState = Object.assign({}, state);
    let idArrLen = 0;
    let newData = nextState.list.datas.filter((data) => {
        let strLen = nextState.delIds.id.match(/,/);
        if (!(Object.prototype.toString.call(strLen) == '[object Array]')) {
            idArrLen = 1;
            return nextState.delIds.id !== data.id;
        } else {
            //批量删除
            let idArr = nextState.delIds.id.split(',');
            idArrLen = idArr.length;
            let flag = true;
            for (let i = idArr.length - 1; i >= 0; i--) {
                if (idArr[i] == data.id) {
                    flag = false;
                }
            }
            return flag;
        }
    });
    nextState.list.datas = newData;
    nextState.list.count -= idArrLen;
    nextState.isDeling = false;
    return nextState;
}