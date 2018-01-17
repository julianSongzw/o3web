/**

 * @Title:DateRange.js
 * @Description: 开始时间结束时间插件
 * @author chengf@ahtsoft.com （程飞）
 * @date 2017/12/15 15:59
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment';
export class DateSectionPicker extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            startValue: this.props.state.time_cj_start,
            endValue: this.props.state.time_cj_end,
            endOpen: false,
        };
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        //return endValue.valueOf() <= startValue.valueOf();
        return !(endValue.valueOf() <= startValue.valueOf()+8*3600*24000 && endValue.valueOf() >= startValue.valueOf());
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
        //回调父组件
        this.props.get_time(field, value);
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
    }

    render() {
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div style={{display:"inline-block"}}>
                <span style={{margin:"0 10px"}}>查询时间:</span>
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    value={startValue}
                    placeholder="Start"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <span style={{margin:"0 10px"}}>至</span>
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
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