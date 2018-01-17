/**

 * @Title: corelation.js
 * @Description:  因子相关性 reduces  （需要设置默认格式）
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import * as act  from '../../actions/analysis/correlation'

/*模拟多条折线图代码*/
let  categoryMould={
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    dataZoom:{
        id: 'dataZoomX',
        type: 'slider',
        xAxisIndex: [0],
        filterMode: 'filter'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            smooth:true,
            data:[120, 132, 101, 134, 90, 230, 210]
        }
    ]
}


const initState = {
    queryData:{},
    categoryDate:{},
    categoryMould:categoryMould,
};

export default function Correlation(state = initState, action) {
    switch (action.type) {
        case act.QUERYDATA_SUCCESS:
            return  {
                ...state,
                categoryDate:action.payload,
            };
        case act.QUERYDATA_FAIL:
            return  {
                ...state,
            };
        default:
            return state;
    }
}