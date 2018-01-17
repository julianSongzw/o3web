/**
 * weijq
 */

import * as platAc from '../../actions/sysManage/platformConfig.js';

const initState = {
    //数据列表
    list: {
        count: 0,
        datas: [],
        msg: '',
        ret: 0
    },

    isLoading: false
    
}

export default function platConfig(state = initState, action) {

    switch (action.type) {
        //查询
        case platAc.QUERY_SUBMIT:
            return {
                ...state,
                isLoading: true
            }
        case platAc.QUERY_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            }
        case platAc.QUERY_FAIL:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }

}