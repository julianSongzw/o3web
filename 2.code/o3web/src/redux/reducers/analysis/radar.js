/**
 * Created by zdjie on 2017/10/19.
 */
import * as act  from '../../actions/analysis/correlation'
import  {config} from '../../../utils/config'


var xData = [];
var yData = [];
let minH = config.minHeight,
    maxH =config.maxHeight;

for(let i=minH;i<maxH/1000;i+=0.5){
    yData.push(i);
}

var option = {
    tooltip: {},
    grid: {
        right: 35,
        left: 60
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    title: {
        text: 'O3浓度图谱与近地面浓度对比'
    },
    xAxis: {
        type: 'category',
        data: xData,
    },
    yAxis: [{
        type: 'category',
        data: yData,
        axisLabel: {
            formatter: '{value} km'
        },
    }],

    series: []
};

let O3AndWeatherMap={
    "data": [
        {
            "time": "2017-06-27T11:00:00.000Z",
            "windSpeed": 9,
            "R": "NNW",
            "waveHeight": 2.64
        },
        {
            "time": "2017-06-27T12:30:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 2.57
        },
        {
            "time": "2017-06-27T14:00:00.000Z",
            "windSpeed": 12,
            "R": "NNW",
            "waveHeight": 2.49
        },
        {
            "time": "2017-06-27T15:30:00.000Z",
            "windSpeed": 12,
            "R": "NNW",
            "waveHeight": 2.44
        },
        {
            "time": "2017-06-27T17:00:00.000Z",
            "windSpeed": 11,
            "R": "NNW",
            "waveHeight": 2.38
        },
        {
            "time": "2017-06-27T18:30:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 2.34
        },
        {
            "time": "2017-06-27T20:00:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 2.3
        },
        {
            "time": "2017-06-27T21:30:00.000Z",
            "windSpeed": 11,
            "R": "NNW",
            "waveHeight": 2.26
        },
        {
            "time": "2017-06-27T23:00:00.000Z",
            "windSpeed": 12,
            "R": "NNW",
            "waveHeight": 2.22
        },
        {
            "time": "2017-06-28T00:30:00.000Z",
            "windSpeed": 12,
            "R": "N",
            "waveHeight": 2.18
        },
        {
            "time": "2017-06-28T02:00:00.000Z",
            "windSpeed": 12,
            "R": "N",
            "waveHeight": 2.13
        },
        {
            "time": "2017-06-28T03:30:00.000Z",
            "windSpeed": 12,
            "R": "N",
            "waveHeight": 2.09
        },
        {
            "time": "2017-06-28T05:00:00.000Z",
            "windSpeed": 12,
            "R": "NNE",
            "waveHeight": 2.04
        },
        {
            "time": "2017-06-28T06:30:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 2.01
        },
        {
            "time": "2017-06-28T08:00:00.000Z",
            "windSpeed": 9,
            "R": "N",
            "waveHeight": 1.99
        },
        {
            "time": "2017-06-28T09:30:00.000Z",
            "windSpeed": 8,
            "R": "NNW",
            "waveHeight": 2
        },
        {
            "time": "2017-06-28T11:00:00.000Z",
            "windSpeed": 8,
            "R": "NW",
            "waveHeight": 2.01
        },
        {
            "time": "2017-06-28T12:30:00.000Z",
            "windSpeed": 8,
            "R": "NW",
            "waveHeight": 2.06
        },
        {
            "time": "2017-06-28T14:00:00.000Z",
            "windSpeed": 9,
            "R": "WNW",
            "waveHeight": 2.12
        },
        {
            "time": "2017-06-28T15:30:00.000Z",
            "windSpeed": 10,
            "R": "WNW",
            "waveHeight": 2.19
        },
        {
            "time": "2017-06-28T17:00:00.000Z",
            "windSpeed": 11,
            "R": "WNW",
            "waveHeight": 2.27
        },
        {
            "time": "2017-06-28T18:30:00.000Z",
            "windSpeed": 12,
            "R": "WNW",
            "waveHeight": 2.33
        },
        {
            "time": "2017-06-28T20:00:00.000Z",
            "windSpeed": 13,
            "R": "NW",
            "waveHeight": 2.39
        },
        {
            "time": "2017-06-28T21:30:00.000Z",
            "windSpeed": 13,
            "R": "NW",
            "waveHeight": 2.43
        },
        {
            "time": "2017-06-28T23:00:00.000Z",
            "windSpeed": 14,
            "R": "NW",
            "waveHeight": 2.46
        },
        {
            "time": "2017-06-29T00:30:00.000Z",
            "windSpeed": 16,
            "R": "NW",
            "waveHeight": 2.48
        },
        {
            "time": "2017-06-29T02:00:00.000Z",
            "windSpeed": 18,
            "R": "NNW",
            "waveHeight": 2.49
        },
        {
            "time": "2017-06-29T03:30:00.000Z",
            "windSpeed": 20,
            "R": "WNW",
            "waveHeight": 2.53
        },
        {
            "time": "2017-06-29T05:00:00.000Z",
            "windSpeed": 22,
            "R": "W",
            "waveHeight": 2.58
        },
        {
            "time": "2017-06-29T06:30:00.000Z",
            "windSpeed": 26,
            "R": "WSW",
            "waveHeight": 2.89
        },
        {
            "time": "2017-06-29T08:00:00.000Z",
            "windSpeed": 30,
            "R": "WSW",
            "waveHeight": 3.21
        },
        {
            "time": "2017-06-29T09:30:00.000Z",
            "windSpeed": 30,
            "R": "SW",
            "waveHeight": 3.58
        },
        {
            "time": "2017-06-29T11:00:00.000Z",
            "windSpeed": 29,
            "R": "SW",
            "waveHeight": 3.94
        },
        {
            "time": "2017-06-29T12:30:00.000Z",
            "windSpeed": 29,
            "R": "SW",
            "waveHeight": 4.08
        },
        {
            "time": "2017-06-29T14:00:00.000Z",
            "windSpeed": 29,
            "R": "SW",
            "waveHeight": 4.22
        },
        {
            "time": "2017-06-29T15:30:00.000Z",
            "windSpeed": 28,
            "R": "SW",
            "waveHeight": 4.25
        },
        {
            "time": "2017-06-29T17:00:00.000Z",
            "windSpeed": 28,
            "R": "SW",
            "waveHeight": 4.28
        },
        {
            "time": "2017-06-29T18:30:00.000Z",
            "windSpeed": 29,
            "R": "SSW",
            "waveHeight": 4.37
        },
        {
            "time": "2017-06-29T20:00:00.000Z",
            "windSpeed": 30,
            "R": "SSW",
            "waveHeight": 4.45
        },
        {
            "time": "2017-06-29T21:30:00.000Z",
            "windSpeed": 29,
            "R": "SSW",
            "waveHeight": 4.45
        },
        {
            "time": "2017-06-29T23:00:00.000Z",
            "windSpeed": 27,
            "R": "SSW",
            "waveHeight": 4.45
        },
        {
            "time": "2017-06-30T00:30:00.000Z",
            "windSpeed": 26,
            "R": "SSW",
            "waveHeight": 4.32
        },
        {
            "time": "2017-06-30T02:00:00.000Z",
            "windSpeed": 25,
            "R": "SSW",
            "waveHeight": 4.2
        },
        {
            "time": "2017-06-30T03:30:00.000Z",
            "windSpeed": 22,
            "R": "SSW",
            "waveHeight": 4.01
        },
        {
            "time": "2017-06-30T05:00:00.000Z",
            "windSpeed": 20,
            "R": "SSW",
            "waveHeight": 3.82
        },
        {
            "time": "2017-06-30T06:30:00.000Z",
            "windSpeed": 19,
            "R": "SSW",
            "waveHeight": 3.66
        },
        {
            "time": "2017-06-30T08:00:00.000Z",
            "windSpeed": 19,
            "R": "SSW",
            "waveHeight": 3.51
        },
        {
            "time": "2017-06-30T09:30:00.000Z",
            "windSpeed": 17,
            "R": "SSW",
            "waveHeight": 3.37
        },
        {
            "time": "2017-06-30T11:00:00.000Z",
            "windSpeed": 14,
            "R": "SSW",
            "waveHeight": 3.22
        },
        {
            "time": "2017-06-30T12:30:00.000Z",
            "windSpeed": 12,
            "R": "SSW",
            "waveHeight": 3.09
        },
        {
            "time": "2017-06-30T14:00:00.000Z",
            "windSpeed": 10,
            "R": "SW",
            "waveHeight": 2.96
        },
        {
            "time": "2017-06-30T15:30:00.000Z",
            "windSpeed": 9,
            "R": "WSW",
            "waveHeight": 2.83
        },
        {
            "time": "2017-06-30T17:00:00.000Z",
            "windSpeed": 9,
            "R": "W",
            "waveHeight": 2.7
        },
        {
            "time": "2017-06-30T18:30:00.000Z",
            "windSpeed": 10,
            "R": "W",
            "waveHeight": 2.58
        },
        {
            "time": "2017-06-30T20:00:00.000Z",
            "windSpeed": 10,
            "R": "WNW",
            "waveHeight": 2.45
        },
        {
            "time": "2017-06-30T21:30:00.000Z",
            "windSpeed": 10,
            "R": "WNW",
            "waveHeight": 2.33
        },
        {
            "time": "2017-06-30T23:00:00.000Z",
            "windSpeed": 10,
            "R": "WNW",
            "waveHeight": 2.21
        },
        {
            "time": "2017-07-01T00:30:00.000Z",
            "windSpeed": 10,
            "R": "NW",
            "waveHeight": 2.13
        },
        {
            "time": "2017-07-01T02:00:00.000Z",
            "windSpeed": 10,
            "R": "NW",
            "waveHeight": 2.05
        },
        {
            "time": "2017-07-01T03:30:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 2.02
        },
        {
            "time": "2017-07-01T05:00:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 2
        },
        {
            "time": "2017-07-01T06:30:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 2
        },
        {
            "time": "2017-07-01T08:00:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.99
        },
        {
            "time": "2017-07-01T09:30:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.98
        },
        {
            "time": "2017-07-01T11:00:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.96
        },
        {
            "time": "2017-07-01T12:30:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.94
        },
        {
            "time": "2017-07-01T14:00:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 1.93
        },
        {
            "time": "2017-07-01T15:30:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 1.93
        },
        {
            "time": "2017-07-01T17:00:00.000Z",
            "windSpeed": 11,
            "R": "NNW",
            "waveHeight": 1.93
        },
        {
            "time": "2017-07-01T18:30:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 1.94
        },
        {
            "time": "2017-07-01T20:00:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 1.96
        },
        {
            "time": "2017-07-01T21:30:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 1.97
        },
        {
            "time": "2017-07-01T23:00:00.000Z",
            "windSpeed": 10,
            "R": "NNW",
            "waveHeight": 1.97
        },
        {
            "time": "2017-07-02T00:30:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.96
        },
        {
            "time": "2017-07-02T02:00:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 1.94
        },
        {
            "time": "2017-07-02T03:30:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 1.91
        },
        {
            "time": "2017-07-02T05:00:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.88
        },
        {
            "time": "2017-07-02T06:30:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.84
        },
        {
            "time": "2017-07-02T08:00:00.000Z",
            "windSpeed": 10,
            "R": "N",
            "waveHeight": 1.8
        },
        {
            "time": "2017-07-02T09:30:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 1.78
        },
        {
            "time": "2017-07-02T11:00:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 1.76
        },
        {
            "time": "2017-07-02T12:30:00.000Z",
            "windSpeed": 12,
            "R": "N",
            "waveHeight": 1.76
        },
        {
            "time": "2017-07-02T14:00:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.77
        },
        {
            "time": "2017-07-02T15:30:00.000Z",
            "windSpeed": 14,
            "R": "N",
            "waveHeight": 1.81
        },
        {
            "time": "2017-07-02T17:00:00.000Z",
            "windSpeed": 15,
            "R": "N",
            "waveHeight": 1.85
        },
        {
            "time": "2017-07-02T18:30:00.000Z",
            "windSpeed": 14,
            "R": "N",
            "waveHeight": 1.86
        },
        {
            "time": "2017-07-02T20:00:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.87
        },
        {
            "time": "2017-07-02T21:30:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.88
        },
        {
            "time": "2017-07-02T23:00:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.9
        },
        {
            "time": "2017-07-03T00:30:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.91
        },
        {
            "time": "2017-07-03T02:00:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.93
        },
        {
            "time": "2017-07-03T03:30:00.000Z",
            "windSpeed": 13,
            "R": "N",
            "waveHeight": 1.96
        },
        {
            "time": "2017-07-03T05:00:00.000Z",
            "windSpeed": 13,
            "R": "NNE",
            "waveHeight": 1.99
        },
        {
            "time": "2017-07-03T06:30:00.000Z",
            "windSpeed": 12,
            "R": "NNE",
            "waveHeight": 2.03
        },
        {
            "time": "2017-07-03T08:00:00.000Z",
            "windSpeed": 11,
            "R": "NNE",
            "waveHeight": 2.08
        },
        {
            "time": "2017-07-03T09:30:00.000Z",
            "windSpeed": 11,
            "R": "N",
            "waveHeight": 2.12
        },
        {
            "time": "2017-07-03T11:00:00.000Z",
            "windSpeed": 11,
            "R": "NNW",
            "waveHeight": 2.16
        },
        {
            "time": "2017-07-03T12:30:00.000Z",
            "windSpeed": 15,
            "R": "N",
            "waveHeight": 2.22
        },
        {
            "time": "2017-07-03T14:00:00.000Z",
            "windSpeed": 20,
            "R": "N",
            "waveHeight": 2.27
        },
        {
            "time": "2017-07-03T15:30:00.000Z",
            "windSpeed": 20,
            "R": "N",
            "waveHeight": 2.33
        },
        {
            "time": "2017-07-03T17:00:00.000Z",
            "windSpeed": 19,
            "R": "N",
            "waveHeight": 2.39
        },
        {
            "time": "2017-07-03T18:30:00.000Z",
            "windSpeed": 17,
            "R": "N",
            "waveHeight": 2.44
        },
        {
            "time": "2017-07-03T20:00:00.000Z",
            "windSpeed": 15,
            "R": "N",
            "waveHeight": 2.49
        },
        {
            "time": "2017-07-03T21:30:00.000Z",
            "windSpeed": 16,
            "R": "NNW",
            "waveHeight": 2.49
        },
        {
            "time": "2017-07-03T23:00:00.000Z",
            "windSpeed": 17,
            "R": "WNW",
            "waveHeight": 2.49
        },
        {
            "time": "2017-07-04T00:30:00.000Z",
            "windSpeed": 18,
            "R": "W",
            "waveHeight": 2.47
        },
        {
            "time": "2017-07-04T02:00:00.000Z",
            "windSpeed": 20,
            "R": "SW",
            "waveHeight": 2.44
        },
        {
            "time": "2017-07-04T03:30:00.000Z",
            "windSpeed": 21,
            "R": "SW",
            "waveHeight": 2.5
        },
        {
            "time": "2017-07-04T05:00:00.000Z",
            "windSpeed": 21,
            "R": "WSW",
            "waveHeight": 2.56
        },
        {
            "time": "2017-07-04T06:30:00.000Z",
            "windSpeed": 22,
            "R": "WSW",
            "waveHeight": 2.69
        },
        {
            "time": "2017-07-04T08:00:00.000Z",
            "windSpeed": 22,
            "R": "WSW",
            "waveHeight": 2.83
        },
        {
            "time": "2017-07-04T09:30:00.000Z",
            "windSpeed": 23,
            "R": "WSW",
            "waveHeight": 2.94
        },
        {
            "time": "2017-07-04T11:00:00.000Z",
            "windSpeed": 23,
            "R": "WSW",
            "waveHeight": 3.06
        },
        {
            "time": "2017-07-04T12:30:00.000Z",
            "windSpeed": 24,
            "R": "WSW",
            "waveHeight": 3.06
        },
        {
            "time": "2017-07-04T14:00:00.000Z",
            "windSpeed": 24,
            "R": "SW",
            "waveHeight": 3.06
        },
        {
            "time": "2017-07-04T15:30:00.000Z",
            "windSpeed": 25,
            "R": "SW",
            "waveHeight": 3.04
        },
        {
            "time": "2017-07-04T17:00:00.000Z",
            "windSpeed": 25,
            "R": "SW",
            "waveHeight": 3.03
        },
        {
            "time": "2017-07-04T18:30:00.000Z",
            "windSpeed": 26,
            "R": "SW",
            "waveHeight": 3
        },
        {
            "time": "2017-07-04T20:00:00.000Z",
            "windSpeed": 26,
            "R": "SW",
            "waveHeight": 2.97
        }
    ],
    "title": "HOBART",
}

const initState = {
    O3Data:option,
    O3AndWeatherMap:[],
};



export default function Radar(state = initState, action) {
    switch (action.type) {

        default:
            return state;
    }
}


