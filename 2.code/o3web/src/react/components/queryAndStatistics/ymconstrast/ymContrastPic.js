/**

 * @Title:YmContrastPic.js
 * @Description:同比环比柱形图
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
import {message} from 'antd';
class YmContrastPic extends React.Component {

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
            if(newData){
                this.setState({
                    newData:newData,
                })
            }
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
        let factorName = objData.queryData.factorName === undefined?"":objData.queryData.factorName;
        let date_interval = objData.queryData.date_interval;//同比/环比
        if(date_interval === 'tb')
            date_interval = "同比";
        else
            date_interval = "环比";

        let date1 = this.returnDate(objData.queryData.time_cj_start);
        let date2 = this.returnDate(objData.queryData.time_cj_end);

        let resultData = objData.resultData;
        //debugger
        //if(resultData.isLoading){
        //    myChart.showLoading({
        //        text : '数据获取中',
        //        effect: 'whirling'
        //    });
        //    return ;
        //}
        if(resultData){
            let weightObjData=[],mv1ObjData=[],mv2ObjData=[];
                for(let j in resultData) {
                    if(resultData.hasOwnProperty(j)) {  // 建议加上判断,如果没有扩展对象属性可以不加
                        //获取米数,push到x轴
                        let xkey = j+"m";
                        newData.xAxisData.push(xkey);
                        //获取对比两个月的浓度值,计算环比同比比例
                        let mv1 = resultData[j][0];
                        let mv2 = resultData[j][1];
                        //环比增长率=（本期数－上期数）/上期数×100%
                        //同比增长率=（本期数－同期数）/|同期数|×100%。
                        let weight = 0;
                        if(mv2 !== 0){
                            weight = ((mv1-mv2)*100/mv2);
                        }
                        weightObjData.push(weight.toFixed(2));
                        mv1ObjData.push(mv1);
                        mv2ObjData.push(mv2);
                    }
                }
            //左边y轴增长value
            let yAxisObjleft = {
                type: 'value',
                    name: date_interval+'增长',
                //interval: 50,
                axisLabel: {
                formatter: '{value}'
                }
            };
            //右边y轴因子浓度
            let yAxisObjright = {
                type: 'value',
                    name: '因子量',
                //interval: 5,
                axisLabel: {
                formatter: '{value}'
                }
            };

            //增长比例
            let weightObj = {
                    name:date_interval+'增长',
                    type:'line',
                    yAxisIndex: 0,
                    data:weightObjData,
                    itemStyle:{
                        normal:{
                            color:'#39FB37'
                        }
                    },
                };
            //第一组浓度值
            let mv1Obj = {
                name:date1+"\t"+factorName+'浓度',
                type:'bar',
                yAxisIndex: 1,
                data:mv1ObjData,
                itemStyle:{
                    normal:{
                        color:'#EF9D9B'
                    }
                },
            };
            //第二组浓度值
            let mv2Obj = {
                name:date2+"\t"+factorName+'浓度',
                type:'bar',
                yAxisIndex: 1,
                data:mv2ObjData,
                itemStyle:{
                    normal:{
                        color:'#FCDD7F'
                    }
                },
            };
            newData.yAxisData.push(yAxisObjleft,yAxisObjright);
            newData.series.push(weightObj,mv1Obj,mv2Obj);
            newData.legend.data.push(weightObj.name,mv1Obj.name,mv2Obj.name)
            return newData;
        }
    }

    //获取年月
    returnDate = (v1)=> {
        let dateStr;
        var date=new Date(v1);
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        month =(month<10 ? "0"+month:month);
        dateStr = (year.toString()+"-"+month.toString());
        return dateStr;
    }
}
export  default YmContrastPic;

