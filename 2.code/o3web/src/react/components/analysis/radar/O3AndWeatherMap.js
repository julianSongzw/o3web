/**
 * Created by zdjie on 2017/10/23.
 */
import React from "react";
// 引入 ECharts 主模块
import echarts from 'echarts'

class O3AndWeatherMap extends React.Component {



    componentWillReceiveProps(nextProps){
        if(this.props.O3AndWeatherData == nextProps.O3AndWeatherData){return}  //为了防止伪彩图更新时 又刷新了一下这个图
        let myChart = echarts.getInstanceByDom(document.getElementById('O3AndWeatherMap'));
        if(myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('O3AndWeatherMap'));

        let rawData  =nextProps.O3AndWeatherData;
        if(!rawData.data){return }
        if(rawData.data.length > 0){
            let directionMap = {};
            echarts.util.each(
                ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'],
                function (name, index) {
                    directionMap[name] = Math.PI / 8 * index;
                }
            );

            let data = echarts.util.map(rawData.data, function (entry) {
                return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
            });

            let dims = {
                time: 0,
                windSpeed: 1,
                R: 2,
                waveHeight: 3,
                minTemp: 3,
                maxTemp: 4
            };
            let arrowSize = 18;

            function renderArrow(param, api) {
                var point = api.coord([
                    api.value(dims.time),
                    api.value(dims.windSpeed)
                ]);

                return {
                    type: 'path',
                    shape: {
                        pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                        x: -arrowSize / 2,
                        y: -arrowSize / 2,
                        width: arrowSize,
                        height: arrowSize
                    },
                    rotation: directionMap[api.value(dims.R)],
                    position: point,
                    style: api.style({
                        stroke: '#555',
                        lineWidth: 1
                    })
                };
            }

            function renderWeather(param, api) {
                var point = api.coord([
                    api.value(dims.time) +  + 3600 * 24 * 1000 / 2,
                    0
                ]);

                return {
                    type: 'group',
                    children: [ {
                        type: 'text',
                        style: {
                            text: api.value(dims.minTemp) + ' - ' + api.value(dims.maxTemp) + '°',
                            textFont: api.font({fontSize: 14}),
                            textAlign: 'center',
                            textVerticalAlign: 'bottom'
                        },
                        position: [point[0], 80]
                    }]
                };
            }

           let  option = {
                title: {
                    text: 'O3浓度图谱与气象对比',
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return [
                            echarts.format.formatTime('yyyy-MM-dd', params[0].value[dims.time])
                            + ' ' + echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                            '风速：' + params[0].value[dims.windSpeed],
                            '风向：' + params[0].value[dims.R],
                            '气压：' + params[0].value[dims.waveHeight]
                        ].join('<br>');
                    }
                },
                grid: {
                    top: 60,
                    bottom: 125,
                    right: 45,
                    left: 60
                },
                xAxis: {
                    type: 'time',
                    maxInterval: 3600 * 1000 * 24,
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
               toolbox: {
                   // y: 'bottom',
                   feature: {
                       saveAsImage: {
                           pixelRatio: 2
                       }
                   }
               },
                yAxis: [{
                    name: '风速（节）',
                    nameLocation: 'middle',
                    nameGap: 35,
                    axisLine: {
                        lineStyle: {
                            color: '#666'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                }, {
                    name: '气压（mpa）',
                    nameLocation: 'middle',
                    nameGap: 35,
                    max: 1500,
                    axisLine: {
                        lineStyle: {
                            color: '#015DD5'
                        }
                    },
                    splitLine: {show: false}
                }, {
                    axisLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {show: false},
                    splitLine: {show: false}
                }],
                visualMap: {
                    type: 'piecewise',
                    // show: false,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 50,
                    pieces: [{
                        gte: 28.4,
                        color: '#CC0033',
                        label: '飓风（风速>=28.4）'
                    },{
                        gte: 20.7,
                        lt: 28.4,
                        color: '#D33C3E',
                        label: '狂风（风速20.7~28.4）'
                    },{
                        gte: 13.8,
                        lt: 20.7,
                        color: '#CCCC00',
                        label: '大风（风速13.8~20.7）'
                    },{
                        gte: 7.9,
                        lt: 13.8,
                        color: '#CCCC66',
                        label: '强风（风速7.9~13.8）'
                    }, {
                        gte: 3.3,
                        lt: 7.9,
                        color: '#33FF00',
                        label: '和风（风速3.3~7.9）'
                    }, {
                        lt: 0,
                        color: '#33FF99',
                        label: '软风（风速小于3.3）'
                    }],
                    seriesIndex: 1,
                    dimension: 1
                },
                dataZoom: [{
                    type: 'inside',
                    xAxisIndex: 0,
                    minSpan: 5
                }],
                series: [{
                    type: 'line',
                    yAxisIndex: 1,
                    showSymbol: false,
                    hoverAnimation: false,
                    symbolSize: 10,
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: 'rgba(88,160,253,1)'
                                }, {
                                    offset: 0.5, color: 'rgba(88,160,253,0.7)'
                                }, {
                                    offset: 1, color: 'rgba(88,160,253,0)'
                                }]
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'rgba(88,160,253,1)'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(88,160,253,1)'
                        }
                    },
                    encode: {
                        x: dims.time,
                        y: dims.waveHeight
                    },
                    data: data,
                    z: 2
                }, {
                    type: 'custom',
                    renderItem: renderArrow,
                    encode: {
                        x: dims.time,
                        y: dims.windSpeed
                    },
                    data: data,
                    z: 10
                }, {
                    type: 'line',
                    symbol: 'none',
                    encode: {
                        x: dims.time,
                        y: dims.windSpeed
                    },
                    lineStyle: {
                        normal: {
                            color: '#aaa',
                            type: 'dotted'
                        }
                    },
                    data: data,
                    z: 1
                }]
            };

            myChart.setOption(option);

        }
    }

    render(){
        return (
            <div id="O3AndWeatherMap" style={{height:"400px",width:"90%",marginLeft:"5%",marginTop:"10px"}}>正在查询...</div>
        );
    }
}

export default  O3AndWeatherMap;