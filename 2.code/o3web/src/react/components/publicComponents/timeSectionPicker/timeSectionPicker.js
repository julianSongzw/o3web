/**

 * @Title: timeSectionPicker.js
 * @Description: 时间段选择插件 包括月 周 天   接受showType参数  ‘day ，week’表示显示日和周
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from 'react'
import  {DatePicker,Select} from  'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;
const { MonthPicker,WeekPicker } = DatePicker;

class TimeSectionPicker extends  React.Component{

    constructor(props){
        super(props);
        this.state={
            timeQuantum:"day",
            today:moment(new Date()),
            showType:this.props.showType || "day,week,month",
        }
    }
    componentWillMount(){
        this.getTimeSection();
    }


    componentDidUpdate(){
        this.getTimeSection();
    }
    render(){
        let timeQuantum=this.state.timeQuantum;
        let datepicker=[];
        if(timeQuantum === "month"){
            datepicker.push(<MonthPicker key={"month"} disabledDate={disabledDate}
                                         value={this.state.today} placeholder="Select month" style={{ width: 100 }}
                                         onChange={this.dateChange} allowClear={false} />);
        }else{
            datepicker.push(<DatePicker key={"nomonth"} disabledDate={disabledDate}
                                        value={this.state.today} style={{ width: 100 }} onChange={this.dateChange} allowClear={false} />);
        }

        return (
            <div style={{display:"inline-block"}}>
                <Select value={this.state.timeQuantum} style={{ width: 50 }} onChange={this.timeQuantumChange}>
                    <Option value="day">天</Option>
                    <Option value="week">周</Option>
                    <Option value="month" style={{display : this.state.showType.indexOf("month") > -1 ?  "block":"none" }}>月</Option>
                </Select>
                　----　
                {datepicker}

            </div>
        )

    }

    /*
    *  改变格式类型的时候
    * */
    timeQuantumChange=(value)=>{
        this.setState({
            timeQuantum:value
        })
    }

    /*
    * 改变具体日期的时候
    * */
    dateChange=(value)=>{
        this.setState({
            today:value
        })
    }

    //把值返回给父页面
    getTimeSection=()=>{
        if(this.props.getTimeSection){
            let type=this.state.timeQuantum,
                 date = this.state.today;
            let startTime,endTime;
            let xAxisData=[];
            if(type  === "day" ){
                startTime = moment(date).startOf('day').format('X');
                endTime = moment(date).endOf('day').format('X');
            }else if (type  === "week"){
                startTime = moment(date).startOf('week').format('X');
                endTime = moment(date).endOf('week').format('X');
            }else {
                startTime = moment(date).startOf('month').format('X');
                endTime = moment(date).endOf('month').format('X');
            }
            if(endTime > moment(new Date()).endOf('hour').format("X") ){
                endTime= moment(new Date()).endOf('hour').format("X");
            }
            xAxisData = this.getDateArrByHour(startTime,endTime);
            this.props.getTimeSection({xAxisData:xAxisData,type:type,time:[startTime*1000,endTime*1000]})
        }
    }


    //按照小时获取时间段中所有的值
    getDateArrByHour = (startTime,endTime)=>{
        let arr=[];
        startTime=parseInt(startTime);
        endTime=parseInt(endTime);
        for(let i=startTime;i<endTime;i=i+3600){
            arr.push( moment(i*1000).format('MM-DD HH:mm'))
        }
        return arr;
    }
}


export  default TimeSectionPicker

function disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
}
function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}