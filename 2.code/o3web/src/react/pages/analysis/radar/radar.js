/**

 * @Title: radar.js
 * @Description: 雷达分析页面
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
import  {config} from '../../../../utils/config'
import  styles from '../correlation/correlation.css'
import { Cascader,Icon,Input, Button,Select,Slider,InputNumber,Radio,DatePicker,message} from 'antd'
import moment from 'moment';
import  axios from 'axios';
import  RoseMap from '../../../components/analysis/radar/RoseMap'
import * as  act from '../../../../redux/actions/analysis/correlation'
import O3Map from '../../../components/analysis/radar/O3Map'
import O3AndWeatherMap from '../../../components/analysis/radar/O3AndWeatherMap'
import  {DateSectionPicker2} from '../../../components/publicComponents/timeSectionPicker/dateSectionPicker2'
import O3AndFloorMap from '../../../components/analysis/radar/O3AndFloorMap'
import  TimeSectionPicker from '../../../components/publicComponents/timeSectionPicker/timeSectionPicker'
import AreaAndFactorCascader from '../../../components/publicComponents/areaAndFactorCascader/areaAndFactorCascader'


const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class Radar extends   React.Component{
    constructor(props) {
        super(props);
        this.state={
            cityCode:[], //[城市，区域]code
            timeSectionValue:{},
            monitorCode:"", //监测点code
            factorCode:'', //检测因子code
            monitorName:'',//监测点名称
            factorName:"",//检测因子名称
            heightInterval:config.heightStep, //高度间隔
            mapType:'category', //展示哪种图  默认对比图
            xAxisData:[] ,//这是时间段选择器后，返回的时间间隔，
            floorDataArr:[], //折线图数据
            flag:0,
            isLoading:false ,//伪彩图是不是在加载中
            imgUrl:'' ,//伪彩图路径
            maxArr:[], // 伪彩图最大值对应的高度,
            maxValueArr:[],
            maxHeightArr:[],
            O3AndWeatherData:[], // 气象图数据
            fitstQueryData:false, //是不是第一次请求数据 用来获取第一个伪彩图
            mgtUrl:'',//玫瑰图的url
        }
    }

    componentDidMount(){
        let monitorCode = this.state.monitorCode;
        let time =this.state.timeSectionValue.time[1] ;
        let time1 = moment(time).format("YYYYMMDD"),
            time2 = moment(time).format("HHmm");
        let name = parseInt(time2/5)*5-300; //求时间整数再往前推5分钟
        this.queryDataClick("monitor/"+monitorCode+"/"+time1+'/'+name+".png");
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
                    <DateSectionPicker2 splitTime={300} showTime={true} startTime ={moment().subtract(1,"day")}
                                        endTime = { moment()}
                        {...this.props} getTimeSection={this.getTimeSection}
                    />

                    <Button type="primary" disabled ={this.state.isLoading} onClick={this.queryDataClick} style={{float:"right",marginRight:"68px"}}>查询</Button>
                </header>
                {/*
                 展示图
                 */}
                <content>
                    {/*
                     O3浓度图谱与地面站浓度对比
                     */}
                    <O3AndFloorMap {...this.props}  xAxisData ={this.state.xAxisData}  floorDataArr={this.state.floorDataArr}
                                                    maxArr={this.state.maxArr} maxValueArr={this.state.maxValueArr}
                                                    maxHeightArr={this.state.maxHeightArr} fitstQueryData={this.state.fitstQueryData}
                                                    isLoading={this.state.isLoading} imgUrl={this.state.imgUrl}
                                                    lktObj={this.state}
                    />

                    {/*
                     O3浓度图谱与气象对比
                     */}
                    <O3AndWeatherMap {...this.props}  O3AndWeatherData={this.state.O3AndWeatherData}/>


                    <RoseMap {...this.props}  factorCode={this.state.factorCode} mgtUrl={this.state.mgtUrl}/>

                </content>
            </div>
        )
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
     * 传递给时间段插件，用于获取最新的时间
     * 格式是 type:  time:[起始时间戳,终点时间戳]
     * */
    getTimeSection=(value)=> {
        this.state.timeSectionValue = value;
        this.state.xAxisData = value.xAxisData;
    }

    /*
    点击查询
    * */
    queryDataClick=(imgUrl)=>{
        let params={
            time_cj_start: this.state.timeSectionValue.time[0],//转成毫秒, moment(this.state.startDate).startOf('day').format('X')
            time_cj_end: this.state.timeSectionValue.time[1],
            scode:this.state.monitorCode,
            factor:this.state.factorCode,
            h_value:config.floorHeight,
            date_interval:'day'
        }
        let _self = this;
        let fitstQueryData = typeof  imgUrl  == "string" ? true :false;
        _self.setState({
            isLoading:true,
            fitstQueryData:fitstQueryData,
            imgUrl:imgUrl
        })
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        //先请求一下风向图
        _self.getWindChartData(access_token,username,params);
        //请求下玫瑰图
        _self.getRoseMapData(access_token,username,params);

        axios.post('/api/line_charts/list' + '?access_token=' + access_token + '&username=' + username,params,config)
            .then(function (res) {
                if (res.data) {
                    let arr = res.data[_self.state.monitorCode][_self.state.factorCode][0];
                    for(let i =0 ,le =arr.length;i<le;i++){
                        _self.state.floorDataArr.push(arr[i][1] || 0);
                    }
                }
                _self.getPcolorData(access_token,username,params);
            })
            .catch(function (err) {
                _self.getPcolorData(access_token,username,params);
            })
    }
    /*
    * 伪彩图调用接口
    * */
    getPcolorData=(access_token,username,params)=>{
        params.time_cj_start = moment(params.time_cj_start).format("YYYY-MM-DD HH:mm:ss");
        params.time_cj_end = moment(params.time_cj_end).format("YYYY-MM-DD HH:mm:ss");
        delete params.h_value;
        delete params.date_interval;
        params.h_index = config.heightStep;
        params.h_start =config.minHeight;
        params.h_end =config.maxHeight;
        params.valueMax=config.valueMax;
        params.valueMin=config.valueMin;
        let _self = this;
        axios.post('/api/d_pcolors/list' + '?access_token=' + access_token + '&username=' + username,params,config)
            .then(function (res) {
                debugger;
                if (res.data) {
                    let extremum =res.data.extremum;
                    let maxArr=[]; //最大值所在高度数组只要第一个
                    let maxValueArr=[];//最大值数组，
                    let maxHeightArr =[] ; //最大值所在高度数组
                    for(let index in extremum){
                        let data = extremum[index];
                        if(data.max){
                            let height =parseInt(data.max.height)/1000 || "0";
                            let maxValue  = data.max.value || 0 ;
                            maxArr.push(height);
                            maxHeightArr.push(data.max.height || "0");
                            maxValueArr.push(maxValue);
                        }
                    }
                    _self.setState({
                        flag:_self.state.flag+1,
                        isLoading:false,
                        imgUrl:res.data.imgUrl,
                        maxArr:maxArr,
                        maxValueArr:maxValueArr,
                        maxHeightArr:maxHeightArr,
                        fitstQueryData:false
                    })
                } else {
                    message.error('请求数据失败');
                    _self.setState({
                        flag:0,
                        isLoading:false,
                    })
                }
            })
            .catch(function (err) {
                message.error('请求数据失败' + err);
                _self.setState({
                    flag:0,
                    isLoading:false,
                })
            })
    }

    /*
    * 风速风向接口
    * */
    getWindChartData=(access_token,username,params)=>{
        let _self = this;
        axios.post('/api/d_weathers/windChart' + '?access_token=' + access_token + '&username=' + username,params,config)
            .then(function (res) {
                if (res.data.datas) {
                    let datas =res.data.datas;
                    for(let i =0,le=datas.length;i<le;i++){
                        let obj = datas[i];
                        obj.time = moment(obj.time).format();
                        obj.windSpeed = parseInt(obj.windSpeed);
                        obj.waveHeight = parseInt(obj.waveHeight);
                    }
                    _self.setState({
                        O3AndWeatherData:{data:datas,title:'气象图'}
                    })
                } else {
                    message.error('气象图请求数据失败');
                }
            })
            .catch(function (err) {
                message.error('气象图请求数据失败' + err);
            })
    }

    /*
    * 玫瑰图调用接口
    * */
    getRoseMapData=(access_token,username,params)=>{
        let _self = this;
        axios.post('/api/wind_roses/list' + '?access_token=' + access_token + '&username=' + username,params,config)
            .then(function (res) {
                if (res.data.ret == "1") {
                        _self.setState({
                            mgtUrl:res.data.imgUrl
                        })
                } else {
                    message.error('玫瑰图请求失败');
                }
            })
            .catch(function (err) {
                message.error('玫瑰图请求数据失败' + err);
            })
    }
}

function mapStateToProps(state) {
    return {
        O3AndWeatherMap:state.Radar.O3AndWeatherMap,
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

export default connect(mapStateToProps, mapDispatchToProps)(Radar);




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