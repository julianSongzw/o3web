/**
 * Created by DELL on 2017/10/17.
 */
import * as act from '../../../actions/queryAndStatistics/ymconstrast/ymconstrast';

//城市监测点s
const siteInfo = [{
    value: 'hefei',
    label: '合肥市',
    children: [{
        value: 'mzgc',
        label: '明珠广场',
    },{
        value: 'dxc',
        label: '大学城',
    },{
        value: 'dpsk',
        label: '董铺水库',
    },],
},{
    value: 'liuan',
    label: '六安市',
    children: [{
        value: 'wxxy',
        label: '皖西学院',
    },{
        value: 'cmcc',
        label: '移动生产大楼',
    }],
}];

const constrastModes = ['因子对比', '高度对比'];
const constrastModeInfo = {
    yz: ['O3浓度', '532消光', '532退偏'],
    gd: ['100m', '200m', '300m'],
};

const MContrastQueryJson = {
    sites:[
        {
            value: 'wxxy',
            label: '皖西学院',
        },{
            value: 'cmcc',
            label: '移动生产大楼',
        }
    ],
    factor:"O3浓度"
}

const MyJson = {
    constrastModes:constrastModes,
    constrastModeInfo:constrastModeInfo,
    siteInfo:siteInfo,
    MContrastQueryJson:MContrastQueryJson,
}


const initState = {
    loginRet:-1,
    userInfo:{},
    MyJson:MyJson
};
export default function Ymconstrast(state = initState, action) {
    switch (action.type) {
        case act.YMCONTRAST_QUERY_SUCCESS:
            return  {
                ...state,
                singleQueryRet: 0,
                singleQueryInfo:action.payload
            };
        case act.YMCONTRAST_QUERY_FAIL:
            return  {
                ...state,
                singleQueryRet: state.loginRet+2
            };
        default:
            return state;
    }
}