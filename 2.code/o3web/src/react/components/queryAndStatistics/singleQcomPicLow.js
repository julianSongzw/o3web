/**

 * @Title:SingleQcomPicLow.js
 * @Description: 单点对比折线图
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
import EchartsBrokenLine from './echartsBrokenLine'
class SingleQcomPicLow extends React.Component {
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

    componentWillReceiveProps(nextProps) {
        debugger
        if (nextProps.objData !== this.props.objData) {
            let newData = this.checkData(nextProps.objData);
            if(newData){
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
        debugger
        let factorName = objData.queryData.factorName === undefined?"":objData.queryData.factorName;
        let h_value = objData.queryData.h_value;
        let resultData = objData.resultData[h_value];
        if(resultData){
            let valueData = [];
            for (let i = 0; i < resultData.length; i++) {
                //时间转换
                let time = resultData[i][0];
                let commonTime = this.returnDate(time);
                //浓度值
                let factor_value = resultData[i][1];

                newData.xAxisData.push(commonTime);
                valueData.push(factor_value);
            }
            newData.legend.data.push(factorName+"指定高度浓度");
            let tmpObj = {
                name:factorName+"指定高度浓度",
                type:'line',
                data:valueData,
                smooth:true,//折线平滑
            }
            newData.series.push(tmpObj);

            newData.interval = parseInt(newData.xAxisData.length/24);
        }
        return newData;
    }

    //时间处理
    returnDate = (v)=> {
        var unixTimestamp = new Date(v);
        let dateStr = this.fz(unixTimestamp.getMonth()+1) + "-" + this.fz(unixTimestamp.getDate())
                + "\n" + this.fz(unixTimestamp.getHours()) + ":" + this.fz(unixTimestamp.getMinutes())
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
export  default SingleQcomPicLow;

