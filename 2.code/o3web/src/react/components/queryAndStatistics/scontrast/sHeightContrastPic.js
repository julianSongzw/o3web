/**

 * @Title:SHeightContrastPic.js
 * @Description: 单点对比某一高度对比
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
import EchartsBrokenLine from './../echartsBrokenLine'

class SHeightContrastPic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newData:""
        };
    }

    componentDidMount() {
        let objData = this.props.objData //外部传入的data数据
        let newData = this.checkData(objData);
        this.setState({
            newData:newData,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.objData !== this.props.objData) {
            let objData = nextProps.objData //外部传入的data数据
            let newData = this.checkData(objData);
            this.setState({
                newData:newData,
            })
        }
    }

    render() {
        return (
                this.state.newData ===""?null:<EchartsBrokenLine {...this.props} newmyChart={this.state.newData}/>
        );
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
        let h_start = objData.queryData.h_start;
        let h_end = objData.queryData.h_end;
        let h_index = objData.queryData.h_index;
        debugger
        if(objData.resultData && objData.resultData!==""){
            for(let i = h_start;i<=h_end;i+=h_index){
                let resultData = objData.resultData[i];
                let valueData = [];
                for (let j = 0; j < resultData.length; j++) {
                    if(i === h_start){
                        //只取一次时间，默认每个高度的所有值的时间都是一样的。
                        //时间转换
                        let time = resultData[j][0];
                        let commonTime = this.returnDate(time);
                        newData.xAxisData.push(commonTime);
                    }
                    //浓度值
                    let factor_value = resultData[j][1];
                    valueData.push(factor_value);
                }
                //每个高度的名称，及不同时间的值
                newData.legend.data.push(i+"m");
                let tmpObj = {
                    name:i+"m",
                    type:'line',
                    data:valueData,
                    smooth:true,//折线平滑
                }
                newData.series.push(tmpObj);
            }
        }
        newData.interval = parseInt(newData.xAxisData.length/24);
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
}
export  default SHeightContrastPic;

