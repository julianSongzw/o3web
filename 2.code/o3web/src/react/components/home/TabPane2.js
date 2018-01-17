/**
 * Created by zdjie on 2017/10/17.
 */
import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts'

class WebDevice extends React.Component {


    componentDidMount(){
        debugger;
        var myChart = echarts.init(document.getElementById('tabPane2'));
        let O3  =this.props.option;
        if(O3){
            myChart.setOption(O3);
        }
    }

    render(){
        return (
            <div >
                <div id="tabPane2" style={{width:'100%',height:'300px'}}>正在加载中...</div>
            </div>
        )
    }

}


export  default WebDevice