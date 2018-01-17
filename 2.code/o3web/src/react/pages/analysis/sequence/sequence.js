/**

 * @Title: sequence.js
 * @Description: 时序分布页面
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from 'react';
import { connect } from 'react-redux';
import  styles from '../correlation/correlation.css'
import  {config} from '../../../../utils/config'
import { Cascader,Icon,Input, Button,Select,Slider,InputNumber,Radio,DatePicker,message} from 'antd'
import moment from 'moment';
import  axios from 'axios'
import * as  act from '../../../../redux/actions/analysis/correlation'
import SequenceMap from '../../../components/analysis/sequence/sequenceMap'
import TimeSectionPicker from '../../../components/publicComponents/timeSectionPicker/timeSectionPicker'
import HeightInputNumber from '../../../components/publicComponents/heightInputNumber/heightInputNumber'
import  {DateSectionPicker2} from '../../../components/publicComponents/timeSectionPicker/dateSectionPicker2'
import AreaAndFactorCascader from '../../../components/publicComponents/areaAndFactorCascader/areaAndFactorCascader'

const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';


class Sequence extends   React.Component{
    constructor(props) {
        super(props);
        this.state={
            sliderValue:3000,//高度起始
            startDate:moment().subtract(30, 'days'),//开始时间
            timeSectionValue:{},
            endDate:moment(),//结束时间
            xAxisData:[] ,//这是时间段选择器后，返回的时间间隔，
            cityCode:[], //[城市，区域]code
            monitorCode:"", //监测点code
            factorCode:'', //检测因子code
            monitorName:'',//监测点名称
            factorName:"",//检测因子名称,
            sequenceData:[], //时序图结构
            colorArr:[],//颜色数组
            flag:0,
            isLoading:false
        }
    }

    //实例化后,开始请求数据
    componentDidMount(){
        this.queryDataClick();
    }


    render(){
        return(
            <div  className={styles.correlation}>
                {/*
                 查询条件
                 */}
                <header>
                    <div style={{display:"inline-block"}}>
                        <AreaAndFactorCascader {...this.props} getAreaAndFactorCascader={this.getAreaAndFactorCascader}/>
                    </div>

                    <span className={styles.span}>时间段:</span>
                    {/*
                     <RangePicker
                     defaultValue={[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]}
                     format={dateFormat} allowClear={false} onChange={this.changeDate} disabledDate={disabledDate}
                     />
                    */}
                    <DateSectionPicker2 splitTime={3600*24}  showTime={false} startTime ={moment().subtract(30,"day").startOf("day")}
                                        endTime = { moment().endOf("day")}
                        {...this.props} getTimeSection={this.getTimeSection}
                    />

                    <Button type="primary" disabled ={this.state.isLoading} onClick={this.queryDataClick} style={{float:"right",marginRight:"68px"}}>查询</Button>
                    <br/>
                    <div style={{width:"12%",minWidth:"120px",display:"inline-block"}}>
                        <span className={styles.span}>高度:</span>
                        <InputNumber
                            min={config.minHeight}
                            max={config.maxHeight}
                            value={this.state.sliderValue}
                            onChange={this.sliderChange}
                            step={config.heightStep}
                            onBlur={this.onblured}
                        />

                    </div>
                    <div style={{width:"75%",display:"inline-block"}}>
                        <Slider  value={this.state.sliderValue}
                                min={config.minHeight} max={config.maxHeight} step={config.heightStep}  style={{top:"13px"}} onChange={this.sliderChange} />
                    </div>

                </header>
                {/*
                 展示图
                 */}
                <content>
                    <SequenceMap {...this.props} sequenceData={this.state.sequenceData}
                                                 colorArr={this.state.colorArr} isLoading={this.state.isLoading}
                                                 xAxisData={this.state.xAxisData} flag={this.state.flag}/>
                </content>
            </div>
        )
    }

    /*
     * 日期改变的时候
     * */
    changeDate=(a,b)=>{
        this.setState({
            startDate:a[0],
            endDate:a[1]
        })
    }

    onblured=(value)=>{
        value=parseInt(value.target.value);
        value=parseInt(value/config.heightStep)*config.heightStep;
        this.setState({
           sliderValue : value
        })
    }

    /*
     * 传递给时间段插件，用于获取最新的时间
     * 格式是 type:  time:[起始时间戳,终点时间戳]
     * */
    getTimeSection=(value)=> {
        this.state.timeSectionValue = value;
        this.state.xAxisData = value.xAxisData;
    }


    /*
    * 高度改变的时候
    * */
    sliderChange=(value)=>{
        this.setState({
            sliderValue:value
        })
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

    /*
    * 点击查询
    * */
    queryDataClick = () =>{
        let params={
            scode:this.state.monitorCode,
            factor:this.state.factorCode,
            scodeName:this.state.monitorName,
            factorName:this.state.factorName,
            time_cj_start: this.state.timeSectionValue.time[0],//转成毫秒, moment(this.state.startDate).startOf('day').format('X')
            time_cj_end: this.state.timeSectionValue.time[1],
            h_value:this.state.sliderValue,
        }
        //this.state.xAxisData= getDateArrByDay(params.time_cj_start,params.time_cj_end);
        let _self =this;
        _self.setState({
            isLoading:true
        })
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        let _colorArr=[];
        let colorArr =this.props.factorColorList[params.factor];
        for(let i=0,le=colorArr.length;i<le;i++){
            _colorArr.push('rgb('+colorArr[i][2]+")");
        }
        _self.state.colorArr =_colorArr;
        _self.getColorArrByFactor(access_token,username,params);
    }

    getColorArrByFactor=(access_token,username,params)=>{
        let _self = this;
        axios.post('/api/time_to_times/list' + '?access_token=' + access_token + '&username=' + username,params,config)
            .then(function (res) {
                if (res.data) {
                    let  sequenceData=res.data[_self.state.monitorCode][_self.state.factorCode][_self.state.sliderValue];
                    _self.setState({
                        sequenceData:sequenceData,
                        flag:_self.state.flag+1,
                        isLoading:false
                    })
                } else {
                    _self.setState({
                        isLoading:false
                    })
                    message.error('请求数据失败');
                }
            })
            .catch(function (err) {
                message.error('请求数据失败' + err);
                _self.setState({
                    isLoading:false
                })
            })
    }
}

function mapStateToProps(state) {
    return {
        sequenceMould:state.Sequence.sequenceMould,
        cityArea:state.Share.cityArea,
        monitorSiteGroup:state.Share.monitorSiteGroup,
        factor:state.Share.factor,
        factorColorList:state.Share.factorColorList,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sequence);


function disabledDate(current) {
    return current && current.valueOf() > Date.now();
}

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function getDateArrByDay(startTime,endTime){
    startTime=startTime/1000;
    endTime=endTime/1000;
    let arr=[];
    for(let i=startTime;i< endTime;i=i+(3600*24)){
        arr.push(moment(i*1000).format('MM月-DD日'));
    }
    return arr;

}