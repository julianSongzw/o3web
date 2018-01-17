/**

 * @Title:MHeightContrastPic.js
 * @Description: 多点对比某一高度的因子
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
import EchartsBrokenLine from './../echartsBrokenLine'
class MHeightContrastPic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newData:""
        };
    }

    componentDidMount() {
        let objData = this.props.objData;
        let newData = this.checkData(objData);
        this.setState({
            newData:newData,
        })
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.objData !== this.props.objData) {
            if(nextProps.objData.resultData){
                let newData = this.checkData(nextProps.objData);
                this.setState({
                    newData:newData,
                })
            }
        }
    }

    //数据库返回数据处理
    checkData = (objData) =>{
        let newData = {
            xAxisData: [],
            legend: {
                data: []
            },
            series: [],
            interval:0,
        }
        let factor = objData.queryData.factor;
        let h_value = objData.queryData.h_value;
        for(let i=0;i<objData.queryData.scode.length;i++){
            debugger
            let scode = objData.queryData.scode[i].key;
            let sname = objData.queryData.scode[i].label;
            if(objData.resultData !==undefined && objData.resultData[scode] !==undefined && objData.resultData[scode][factor] !== undefined){
                let factorInfo = objData.resultData[scode][factor];
                let resultData =[];
                if(factorInfo){
                    resultData =factorInfo[h_value];
                }
                let valueData = [];
                if (resultData) {
                        for (let j = 0; j < resultData.length; j++) {
                            //时间转换
                            if(i === 0){
                                let time = resultData[j][0];
                                let commonTime = this.returnDate(time);
                                newData.xAxisData.push(commonTime);
                            }
                            //浓度值
                            let factor_value = resultData[j][1];
                            valueData.push(factor_value);
                        }
                        //处理
                        newData.legend.data.push(sname);
                        let tmpObj = {
                            name:sname,
                            type:'line',
                            data:valueData,
                            smooth:true,//折线平滑
                        }
                        newData.series.push(tmpObj);
                    }
                }
            }
        newData.interval = parseInt(newData.xAxisData.length/24);
        return newData;
    }

    //时间处理
    returnDate = (v)=> {
        var unixTimestamp = new Date(v);
        let dateStr = this.fz(unixTimestamp.getMonth()+1) + "-" + this.fz(unixTimestamp.getDate())
            + "\n" + this.fz(unixTimestamp.getHours()) + "时"
        return dateStr;
    }
    // 给月和天，不足两位的前面补0
    fz = (num) => {
        if (num < 10) {
            num = "0" + num;
        }
        return num
    }

    render() {
        return (
            this.state.newData ===""?null:<EchartsBrokenLine {...this.props} newmyChart={this.state.newData}/>
        );
    }

}
export  default MHeightContrastPic;

