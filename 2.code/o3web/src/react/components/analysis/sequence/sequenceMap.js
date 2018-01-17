/**
 * Created by zdjie on 2017/10/23.
 */
import React from "react";
// 引入 ECharts 主模块
import echarts from 'echarts'

class SequenceMap extends React.Component {



    componentWillReceiveProps(nextProps){
        //if(nextProps.flag == this.props.flag){return }
        debugger;
        let myChart = echarts.getInstanceByDom(document.getElementById('sequenceMap'));
        if(myChart){
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('sequenceMap'));
        if(nextProps.isLoading){
            myChart.showLoading({
                text : '数据获取中',
                effect: 'whirling'
            });
            return ;
        }else{
            myChart.hideLoading();
        }
        let sequence  =nextProps.sequenceMould;
        sequence.xAxis.data = nextProps.xAxisData;
        sequence.series[0].data = nextProps.sequenceData;
        sequence.visualMap.inRange.color = nextProps.colorArr;
        if(sequence){
            myChart.setOption(sequence);
        }
    }

    render(){
        return (
            <div id="sequenceMap" style={{height:"500px",width:"90%",marginLeft:"5%"}}>正在查询...</div>
        );
    }
}

export default  SequenceMap;
