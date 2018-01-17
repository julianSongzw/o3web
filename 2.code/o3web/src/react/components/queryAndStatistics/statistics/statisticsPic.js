/**

 * @Title:StatisticsPic.js
 * @Description: 统计查询柱形图
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
import styles from "./../contrast.css";
// 引入 ECharts 主模块
import echarts from 'echarts'
import EchartsBar from './../echartsBar'
class StatisticsPic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newData:""
        }
    }

    componentDidMount() {
        let objData = this.props.objData //外部传入的data数据
        let newData = this.checkData(objData);
        this.setState({
            newData:newData,
        })
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.objData !== this.props.objData) {
            let objData = nextProps.objData //外部传入的data数据
            let newData = this.checkData(objData);
            this.setState({
                newData:newData,
            })
        }
    }

    render(){
        return (
            this.state.newData ===""?null:<EchartsBar {...this.props} newmyChart={this.state.newData}/>
        );
    }

    //数据库返回数据处理
    checkData = (objData) =>{
        let newData = {
            xAxisData: [],
            yAxisData:[],
            legend: {
                data: []
            },
            series: [],
            interval:0,
        }
        let data = objData.resultData;//外部传入的data数据
        debugger
        if(data.length>0){
            let selectFactorCode = this.props.objData.queryData.factor;
            let factors = data[0].factor;
            //获取因子名称
            let factorNameArr = [];
            let seriesObjArr =[];
            for(let i=0;i<factors.length;i++){
                let factorName;
                selectFactorCode.map((item, index)=> {
                    if (factors[i] === item.key) {
                        factorName=item.label;
                        factorNameArr.push(factorName);
                    }
                })
                //获取每个因子item1的对应点的近地面值
                let sObjdata =[];
                data.map((item2, index)=> {
                    let lowDataArr = item2.text_low;
                    sObjdata.push(lowDataArr[i]==="-"?0:lowDataArr[i]);
                })
                let seriesObj = {
                    name:factorName,
                        type:'bar',
                    data:sObjdata,
                }
                seriesObjArr.push(seriesObj);
            }
            //获取监测点名称
            let siteNameArr = [];
            data.map((item, index)=> {
                siteNameArr.push(item.site);
            })
            newData.legend.data = factorNameArr;
            newData.xAxisData = siteNameArr;
            newData.yAxisData = {
                type: 'value',
                name: '平均浓度',
                interval: 5,
                axisLabel: {
                    formatter: '{value}'
                }
            }
            newData.series = seriesObjArr;
        }
        return newData;
    }
}
export  default StatisticsPic;

