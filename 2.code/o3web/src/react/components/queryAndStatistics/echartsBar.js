/**

 * @Title:EchartsBrokenLine.js
 * @Description: echarts柱形图插件
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
class EchartsBar extends React.Component {
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
        if(this.props.objData.isLoading){
            this.myChart.showLoading({
                text : '数据获取中',
                effect: 'whirling'
            });
            return ;
        }else if(this.props.newmyChart.legend.data.length === 0){
            return
        }else{
            this.myChart.hideLoading();
        }
        //定义一个setPieOption函数将data传入option里面
        let options = this.setPieOption(this.props.newmyChart)
        //设置options
        this.myChart.setOption(options)
    }

    componentDidMount() {
        this.initPie()
    }

    componentDidUpdate() {
        this.initPie()
    }

    render() {
        return (
            <div id="low" className = {styles.low} ></div>
        );
    }

    //一个基本的echarts图表配置函数
    setPieOption = (values) =>{
        return {

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            //toolbox: {
            //    feature: {
            //        dataView: {show: true, readOnly: false},
            //        magicType: {show: true, type: ['line', 'bar']},
            //        restore: {show: true},
            //        saveAsImage: {show: true}
            //    }
            //},
            toolbox: {
                show: true,//显示右上角的功能图标
                feature: {
                    mark: {show: true},
                    saveAsImage: {show: true,title:"导出",},
                    //restore: {show: true}
                }
            },
            legend: {
                data:values.legend.data
            },
            xAxis: [
                {
                    type: 'category',
                    data: values.xAxisData,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis:values.yAxisData ,
            series: values.series
        }
    }
}
export  default EchartsBar;