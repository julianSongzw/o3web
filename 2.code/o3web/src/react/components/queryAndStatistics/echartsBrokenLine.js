/**

 * @Title:EchartsBrokenLine.js
 * @Description: echarts折线图插件
 * @author chengf@ahtsoft.com （程飞）
 * @date 2017/12/14 9:40
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from "react";
import styles from "./contrast.css";
// 引入 ECharts 主模块
import echarts from 'echarts'
class EchartsBrokenLine extends React.Component {
    constructor(props) {
        super(props)
        this.setPieOption = this.setPieOption.bind(this)
        this.initPie = this.initPie.bind(this)
    }

    initPie() {
        //初始化echarts
        if(this.myChart){
            this.myChart.dispose()
        }
        this.myChart = echarts.init(document.getElementById('low'))

        //定义一个setPieOption函数将data传入option里面
        let options = this.setPieOption(this.props.newmyChart)
        debugger
        if(this.props.newmyChart.legend.data.length===0){
            this.myChart.showLoading({
                text : '数据获取中',
                effect: 'whirling'
            });
            return;
        }else if(this.props.newmyChart.legend.data.length === 0){
            return
        }else{
            this.myChart.hideLoading();
        }
        //设置options
        this.myChart.setOption(options)
    }

    componentDidMount() {
        this.initPie()
    }

    componentDidUpdate() {
        this.initPie()
    }

    render () {
        return (
            <div id="low" className = {styles.low} ></div>
        );
    }

    //一个基本的echarts图表配置函数
    setPieOption = (values) =>{
        return {
            title: {//显示标题
                left: 10,
            },
            tooltip : {
                trigger: 'axis',
                //axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                //    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                //}
            },
            toolbox: {
                show: true,//显示右上角的功能图标
                feature: {
                    mark: {show: true},
                    saveAsImage: {show: true,title:"导出",},
                    //restore: {show: true}
                }
            },
            legend: {//显示图例
                data:values.legend.data
            },
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                },
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'empty'
                },
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                },
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    filterMode: 'empty'
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : values.xAxisData,
                    axisLabel: {
                        //X轴刻度配置
                        //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数  rotate:40为倾斜度
                        interval:values.interval
                    },
                }
            ],
            yAxis : [
                {
                    name: '浓度',
                    type: 'value',
                    min: 0
                }
            ],
            series : values.series
        }
    }
}
export  default EchartsBrokenLine;