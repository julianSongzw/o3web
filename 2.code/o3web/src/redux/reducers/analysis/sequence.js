/**
 * Created by zdjie on 2017/10/19.
 */
import * as act  from '../../actions/analysis/correlation'


var xData = [];
var yData = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
var option = {
    tooltip: {},
    grid: {
        right: 15,
        left: 140
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    xAxis: {
        type: 'category',
        data: xData,
    },
    yAxis: {
        type: 'category',
        data: yData,
        axisLabel:{
            formatter: '{value}时'
        },
    },
    visualMap: {
        type: 'continuous',
        min: 0,
        max: 10000,
        calculable: true,
        realtime: false,
        bottom:30,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    series: [{
        type: 'heatmap',
        data: [],
        itemStyle: {
            emphasis: {
                borderColor: '#333',
                borderWidth: 1
            }
        },
        progressive: 1000,
        animation: false,
        tooltip:{
            trigger:'item',
            formatter:function(parme){
                return parme.name+"日 "+parme.data[1]+"时"+" : "+parme.data[2];
            }
        }
    }]
};




const initState = {
    sequenceMould:option
};

export default function Sequence(state = initState, action) {
    switch (action.type) {

        default:
            console.log(state ,"Sequence");
            return state;
    }
}


