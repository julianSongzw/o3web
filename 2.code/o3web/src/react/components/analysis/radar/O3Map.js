/**
 * Created by zdjie on 2017/10/23.
 */
import React from "react";
// 引入 ECharts 主模块
import echarts from 'echarts'

class O3Map extends React.Component {



    componentDidMount(){
        var myChart = echarts.init(document.getElementById('O3Map'));
        let O3MapData  =this.props.O3Data;
        if(O3MapData){
            myChart.setOption(O3MapData);
        }
    }

    render(){
        return (
            <div id="O3Map" style={{height:"500px",width:"90%",marginLeft:"5%"}}>正在查询...</div>
        );
    }
}

export default  O3Map;