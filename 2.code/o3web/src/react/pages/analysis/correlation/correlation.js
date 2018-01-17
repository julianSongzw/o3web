/**

 * @Title: correlation.js
 * @Description: 因子相关性界面
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
import  styles from './correlation.css'
import { Cascader,Icon,Input, Button,Select,Slider,InputNumber,Radio,message} from 'antd'
import  {config} from '../../../../utils/config'
import * as  act from '../../../../redux/actions/analysis/correlation'
import  Category from '../../../components/analysis/correlation/category'
import  WindRose from '../../../components/analysis/correlation/windRose'
import  axios from 'axios'
import moment from 'moment'
import  {DateSectionPicker2} from '../../../components/publicComponents/timeSectionPicker/dateSectionPicker2'
import HeightInterval from '../../../components/publicComponents/heightInterval/heightInterval'
import HeightInputNumber from '../../../components/publicComponents/heightInputNumber/heightInputNumber'
import AreaAndFactorCascader from '../../../components/publicComponents/areaAndFactorCascader/areaAndFactorCascader'

const Option = Select.Option;


class Correlation extends   React.Component{
    constructor(props) {
        super(props);
        this.state={
            startSliderValue:0,//高度起始
            endSliderValue:3000,//高度结束
            timeSectionValue:{},//时间段
            cityCode:[], //[城市，区域]code
            monitorCode:"", //监测点code
            factorCode:'', //检测因子code
            monitorName:'',//监测点名称
            factorName:"",//检测因子名称
            heightInterval:config.heightStep, //高度间隔
            mapType:'category', //展示哪种图  默认对比图
            xAxisData:[] ,//这是时间段选择器后，返回的时间间隔，
            categoryDate:'', // 请求后的数据
            gkObj:'',//国控点数据
            flag:0,//用于判断是不是点击了提交  点击后每次加一
            isLoading:false //伪彩图是不是在加载中
        }
    }

    //实例化后,开始请求数据
    componentDidMount(){
        this.queryData();
    }

    render(){
        //哪种类型的图
        let mapType=this.state.mapType;
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
                     <TimeSectionPicker {...this.props} getTimeSection={this.getTimeSection}  showType={'day,week'}/>
                    */}
                    <DateSectionPicker2 limitDay={true} splitTime={3600} showTime={true} startTime ={moment().subtract(1,"day")}
                        endTime = { moment()}
                        {...this.props} getTimeSection={this.getTimeSection}
                    />
                    <span className={styles.span}>高度间隔:</span>
                    <div style={{width:"6%",display:"inline-block",marginRight:"10px"}}>
                        <HeightInterval  {...this.props} getHeightInterval={this.getHeightInterval}/>
                    </div>
                    <Button type="primary" disabled ={this.state.isLoading} onClick={this.queryData} style={{float:"right",marginRight:"68px"}}>查询</Button>
                    <br/>
                    <div style={{width:"20%",minWidth:"250px",display:"inline-block"}}>
                        <span className={styles.span}>高度:</span>
                        <HeightInputNumber {...this.props}  value={this.state.startSliderValue}
                                                            getNumber={this.inputNumberChange1}
                                                            heightInterval={this.state.heightInterval}
                        />
                        <span style={{margin:'0 10px'}}>至</span>
                        <HeightInputNumber {...this.props}  value={this.state.endSliderValue}
                                                            getNumber={this.inputNumberChange2}
                                                            heightInterval={this.state.heightInterval}
                        />
                    </div>
                    <div style={{width:"75%",display:"inline-block"}}>
                        <Slider range value={[this.state.startSliderValue, this.state.endSliderValue]}
                                min={config.minHeight} max={config.maxHeight} step={parseInt(this.state.heightInterval)} style={{top:"13px"}} onChange={this.sliderChange}  />
                    </div>

                </header>
                {/*
                     展示图
                */}
                <content>
                    {/*
                     <aside className={styles.aside}>
                     <Radio.Group defaultValue={mapType}  onChange={this.mapTypeChange}>
                     <Radio.Button value="category" >对比图</Radio.Button>
                     <Radio.Button value="windRose" >玫瑰图</Radio.Button>
                     </Radio.Group>
                     </aside>
                    */}
                    {/*
                        两种图
                    */}
                    <div style={{display:mapType === "category" ? "block" : "none" }}>
                        <Category {...this.props} categoryDate={this.state.categoryDate} isLoading={this.state.isLoading}
                                                  xAxisData={this.state.xAxisData}  factorName={this.state.factorName}
                                                  factorCode={this.state.factorCode} gkObj={this.state.gkObj} flag={this.state.flag}
                        />
                    </div>
                    
                </content>
            </div>
        )
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
    *传递给高度间隔插件，用于获取最新的高度间隔
    * */
    getHeightInterval=(value)=>{
        this.state.heightInterval=value;
        this.setState({
            startSliderValue:config.minHeight,
            endSliderValue: parseInt(3000/value)*value
        })
    }

    /*
    * 统计类型改变的时候
    * */
    countTypeChange=(value)=>{
        this.setState({
            countType:value
        })
    }

    /*
    * 图 类型 改变的时候
    * */
    mapTypeChange=(e)=>{
        this.setState({
            mapType:e.target.value
        })
    }

    /*
    * 点击查询
    * */
    queryData=(e)=>{
        let params={
            time_cj_start:this.state.timeSectionValue.time[0],
            time_cj_end:this.state.timeSectionValue.time[1],
            scode:this.state.monitorCode,
            factor:this.state.factorCode,
            h_start:this.state.startSliderValue,
            h_end:this.state.endSliderValue,
            h_index:this.state.heightInterval,
            date_interval:this.state.timeSectionValue.type
        }
        //角色列表
        let _self = this;
        _self.setState({
            isLoading:true
        })
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        if(!_self.state.gkObj){
            axios.post('/api/b_sites/list' + '?access_token=' + access_token + '&username=' + username,{type:1,pageIndex:1,pageSize:1000,},config)
                .then(function (res) {
                    if (res.data.datas) {
                        let arr=res.data.datas;
                        let gkObj={};
                        for(let i=0,le=arr.length;i<le;i++){
                            gkObj[arr[i].code]=arr[i].name;
                        }
                        _self.state.gkObj = gkObj;
                    }
                    _self.getCategoryDate(access_token,username,params);
                })
                .catch(function (err) {
                    _self.getCategoryDate(access_token,username,params);
                })
        }else{
            _self.getCategoryDate(access_token,username,params);
        }

    }

    getCategoryDate=(access_token,username,params)=>{
        let _self = this;
        axios.post('/api/factor_relateds/list' + '?access_token=' + access_token + '&username=' + username,params,config)
            .then(function (res) {
                if (res.data) {
                    _self.setState({
                        categoryDate:res.data,
                        flag:_self.state.flag+1,
                        isLoading:false
                    })
                } else {
                    message.error('请求数据失败');
                    _self.setState({
                        isLoading:false
                    })
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
        queryData:state.Correlation.queryData,
        categoryMould:state.Correlation.categoryMould,
        //categoryDate:state.Correlation.categoryDate,
        cityArea:state.Share.cityArea,
        monitorSiteGroup:state.Share.monitorSiteGroup,
        factor:state.Share.factor,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Correlation);