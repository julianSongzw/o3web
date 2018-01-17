/**

 * @Title:dateSectionPicker2.js
 * @Description: 选择日期段插件 返回开始、结束时间。时间段数组
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017/12/19 11:14
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment'

export  class DateSectionPicker2 extends React.Component {

    constructor(props) {
        super(props);
        let startValue = moment().subtract(7,"day"),
            endValue =  moment(),
            format="YYYY-MM-DD HH:mm:ss";
        if(!this.props.showTime){
            startValue= moment(startValue).startOf("day");
            endValue= moment(endValue).endOf("day");
            format="YYYY-MM-DD";
        }
        this.state = {
            startValue: this.props.startTime ||  startValue, //开始时间
            endValue:this.props.endTime ||  endValue,//结束时间
            format:format,
            endOpen: false,
            limitDay:this.props.limitDay
        };
    }

    componentWillMount(){
        let startTime=this.state.startValue.format('X'),
            endTime =this.state.endValue.format('X');
        //回调父组件
        let xAxisData=this.getDateArrByHour(startTime,endTime);
        this.props.getTimeSection({xAxisData:xAxisData,time:[startTime*1000,endTime*1000]});
    }


    componentDidUpdate(){
        let startTime=this.state.startValue.format('X'),
            endTime =this.state.endValue.format('X');
        //回调父组件
        let xAxisData=this.getDateArrByHour(startTime,endTime);
        this.props.getTimeSection({xAxisData:xAxisData,time:[startTime*1000,endTime*1000]});
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        if(this.state.limitDay && false){
            return !(startValue.valueOf() >= endValue.valueOf()-8*3600*24000 &&  startValue.valueOf() <= endValue.valueOf());
        }else{
            return startValue.valueOf() > endValue.valueOf();
        }

    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        if(this.state.limitDay){
            return !(endValue.valueOf() <= startValue.valueOf()+8*3600*24000 && endValue.valueOf() >= startValue.valueOf());
        }else{
            return endValue.valueOf() <= startValue.valueOf();
        }

    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
        this.state[field]=value;
    }

    //按照小时获取时间段中所有的值
    getDateArrByHour = (startTime,endTime)=>{
        let arr=[];
        let splitTime = this.props.splitTime || 3600; //默认按照小时来
        startTime=parseInt(startTime/splitTime)*splitTime +splitTime;
        endTime=parseInt(endTime/splitTime)*splitTime+splitTime;
        if(this.props.showTime){
            for(let i=startTime;i<endTime;i=i+splitTime){
                let date=moment(i*1000).format("MM-DD"),
                    time=moment(i*1000).format("HH:mm");
                arr.push(date+'\n'+time);
            }
        }else{
            for(let i=startTime;i<endTime;i=i+splitTime){
                arr.push( moment(i*1000).format("MM-DD"))
            }
        }
        return arr;
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
        let startValue  = this.state.startValue;
        let endValue = this.state.endValue;
        if(endValue.valueOf() >= startValue.valueOf()+8*3600*24000){
            this.state.endValue = moment(startValue).subtract(-7,"day");
        }
    }

    render() {
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div style={{display:"inline-block"}}>
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime = {this.props.showTime}
                    allowClear={false}
                    format={this.state.format}
                    value={startValue}
                    placeholder="Start"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <span style={{margin:"0 5px"}}>至</span>
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime= {this.props.showTime}
                    format={this.state.format}
                    allowClear={false}
                    //format="YYYY-MM-DD"
                    value={endValue}
                    placeholder="End"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                />
            </div>
        );
    }
}