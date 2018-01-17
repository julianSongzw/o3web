/**

 * @Title:YmContrastTop.js
 * @Description:同比环比柱查询条件表单
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
import * as act from '../../../../redux/actions/queryAndStatistics/singleQact';
import { connect } from 'react-redux';
import { Cascader,Select,DatePicker,Button,Slider, InputNumber  } from 'antd';
import HeightInterval from '../../../components/publicComponents/heightInterval/heightInterval'
import AreaAndFactorCascader from '../../../components/publicComponents/areaAndFactorCascader/areaAndFactorCascader'
import  {config} from '../../../../utils/config';
import moment from 'moment';
const Option = Select.Option;
const { MonthPicker } = DatePicker;

class YmContrastTop extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            startSliderValue:config.heightStep,//高度起始
            endSliderValue:3000,//高度结束
            heightInterval:config.heightStep, //高度间隔  插件
            wd:"hb",//对比模式
            monthTime:moment(new Date()),
            //监测点code,检测因子code,监测点名称,检测因子名称
            monitorCode:"",
            factorCode:'',
            monitorName:'',
            factorName:"",
            isLoading:false,
        };
    }
    //页面渲染完成时 执行默认查询条件
    componentDidMount() {
        let queryData = this.queryDataCheck();
        this.props.d_colorsAction(queryData);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.isLoading !== this.props.isLoading) {
            this.setState({
                isLoading: nextProps.isLoading
            })
        }
    }

    //点击查询按钮
    handleSubmit = (e) => {
        let queryData = this.queryDataCheck();
        this.props.d_colorsAction(queryData);
    };


    //查询条件处理
    queryDataCheck = () => {
        let timeArr = this.timeCheck(this.state.monthTime,this.state.wd)
        let queryData = {
            scode:this.state.monitorCode,
            factor:this.state.factorCode,
            factorName:this.state.factorName,
            h_start:this.state.startSliderValue,
            h_end:this.state.endSliderValue,
            time_cj_start: timeArr[0],
            time_cj_end: timeArr[1],
            h_index:this.state.heightInterval,
            date_interval:this.state.wd,
        };
        return queryData;
    }

    //时间处理，根据统计方式和本期时间，计算出上一期时间
    timeCheck = (currentMonth,wd) => {
        let ct,lt,timeArr = [];
        var currentd1 = moment(currentMonth);
        var currentd2 = moment(currentMonth);
            ct = currentd1.startOf('month')._d.getTime();
        timeArr.push(ct);
        if(wd ==="tb"){
            lt = currentd2.subtract(1, 'years').startOf('month')._d.getTime();
            timeArr.push(lt);
        }else{
            lt = currentd2.subtract(1, 'months').startOf('month')._d.getTime();
            timeArr.push(lt);
        }
        return timeArr;
    }

    /**
     * 环比增长率=（本期数－本年上期数）/上期数×100%。
     * 同比增长率=（本期数－往年同期数）/|同期数|×100%。
     * */
    render(){

        return (
            <div className={styles.singleQcomTopDiv}>
                <div style={{display: 'inline-block'}}>
                    <AreaAndFactorCascader {...this.props} getAreaAndFactorCascader={this.getAreaAndFactorCascader}/>
                </div>

                <div style={{display: 'inline-block'}}>
                    <span className={styles.span}>统计方式:</span>
                    <Select className={styles.selectright} style={{ width: 80 }} onChange={this.ModeChange} value={this.state.wd}>
                        {<option value="tb">同比</option>}
                        {<option value="hb">环比</option>}
                    </Select>
                </div>

                <div style={{display: 'inline-block'}}>
                    <span className={styles.span}>本期时间:</span>
                    <MonthPicker
                        allowClear={false}
                        className={styles.selectleft}
                        defaultValue={this.state.monthTime}
                        onChange={this.MonthPickerChange}/>
                </div>

                <Button style={{float:"right",marginRight:"68px"}} type="primary" htmlType="submit" icon="search" disabled = {this.state.isLoading}
                        onClick={this.handleSubmit}>查询
                </Button>
                <br/>
                <div style={{display: 'inline-block'}}>
                    <span style={{margin:"0 10px"}}>高度间隔:</span>
                    <div style={{display: 'inline-block',marginTop:'10px'}}>
                    <HeightInterval  className={styles.selectright} {...this.props} getHeightInterval={this.getHeightInterval}/>
                    </div>
                    <span style={{margin:"0 10px"}}>高度从:</span>
                    <InputNumber
                        min={config.minHeight}
                        max={config.maxHeight}
                        step={this.state.heightInterval}
                        style={{marginRight:"10px"}}
                        value={this.state.startSliderValue}
                        onChange={this.inputNumberChange1}
                    /><span style={{margin:"0 10px"}}>至</span>
                    <InputNumber
                        min={config.minHeight}
                        max={config.maxHeight}
                        step={this.state.heightInterval}
                        style={{marginLeft:"10px"}}
                        value={this.state.endSliderValue}
                        onChange={this.inputNumberChange2}
                    />
                </div>
                <div style={{width:"60%",display:"inline-block"}}>
                    <Slider
                        range
                        value={[this.state.startSliderValue, this.state.endSliderValue]}
                        min={config.minHeight}
                        max={config.maxHeight}
                        step={this.state.heightInterval}
                        style={{top:"13px"}}
                        onChange={this.sliderChange} />
                </div>
            </div>
        );

    }

    /*
     * 传递给选择城市区域监测点因子 插件，用于获取最新的东西
     * */
    getAreaAndFactorCascader=(myjson)=> {
        this.state.cityCode = myjson.cityCode;
        this.state.monitorCode = myjson.monitorCode;
        this.state.factorCode = myjson.factorCode;
        this.state.monitorName = myjson.monitorName;
        this.state.factorName = myjson.factorName;
    }

    MonthPickerChange = (value) => {
        this.setState({
            monthTime: value,
        });
    }

    ModeChange = (value) => {
        debugger
        this.setState({
            wd: value,
        });
    }

    /*
     * 输入框高度变化的时候
     * */
    inputNumberChange1=(value)=>{
        if(value<this.state.endSliderValue){
            this.setState({
                startSliderValue:value
            })
        }
    }
    inputNumberChange2=(value)=>{
        if(value>this.state.startSliderValue) {
            this.setState({
                endSliderValue: value
            })
        }
    }
    sliderChange=(value)=>{
        this.setState({
            startSliderValue:value[0],
            endSliderValue: value[1]
        })
    }

    /*
     *传递给高度间隔插件，用于获取最新的高度间隔
     * */
    getHeightInterval=(value)=>{
        this.setState({
            heightInterval:parseInt(value)
        })
    }
}


YmContrastTop.propTypes = {
    onSearchData: React.PropTypes.func.isRequired
};
export default YmContrastTop;