/**

 * @Title:SingleQcomTop.js
 * @Description: 单点对比查询条件表单
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
import {dataService}  from '../../../utils/request';
import { Cascader,Select,Button,InputNumber,Slider,Radio,message  } from 'antd';
import moment from 'moment';
import { DateSectionPicker } from './../../../react/components/publicComponents/timeSectionPicker/DateSectionPicker';
import AreaAndFactorCascader from './../../components/publicComponents/areaAndFactorCascader/areaAndFactorCascader'
import  {config} from './../../../utils/config';
const RadioGroup = Radio.Group;

class SingleQcomTop extends React.Component {

    constructor(props) {
        super(props);

        //初始化时间
        let et = moment(new Date());
        let st = moment(new Date()).subtract(24, 'hours');
        this.state = {
            //高度滑块默认值
            sliderValue: 3000,
            //高度切换
            hightMode: true,
            //开始时间结束时间
            time_cj_start: st,
            time_cj_end: et,
            //监测点code,检测因子code,监测点名称,检测因子名称
            monitorCode:"",
            factorCode:'',
            monitorName:'',
            factorName:"",
            heightInterval:config.heightStep, //高度间隔  插件
            isLoading:false,
        };
    }

    //页面渲染完成时 执行默认查询条件
    componentDidMount() {
        let queryData = this.queryDataCheck();
        this.props.d_colors_defaultAction(queryData);
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
        let that = this;
        let queryData;
        if(that.state.hightMode){
            //所有高度,伪彩图时间需要转换
            queryData = {
                scode:this.state.monitorCode,
                monitorName:this.state.monitorName,
                factor:this.state.factorCode,
                factorName:this.state.factorName,
                time_cj_start: that.state.time_cj_start._d.getTime(),
                time_cj_end: that.state.time_cj_end._d.getTime(),
                h_index:config.heightStep,
                h_start:config.minHeight,
                h_end:config.maxHeight,
                valueMax:config.valueMax,
                valueMin:config.valueMin,
            };
        }else{
            //指定高度
            queryData = {
                scode:this.state.monitorCode,
                monitorName:this.state.monitorName,
                factor:this.state.factorCode,
                factorName:this.state.factorName,
                h_value: that.state.sliderValue,
                time_cj_start: that.state.time_cj_start._d.getTime(),
                time_cj_end: that.state.time_cj_end._d.getTime(),
            };
        }
        return queryData;
    }

    render() {

        return (
            <div className={styles.singleQcomTopDiv}>
                <div style={{display:"inline-block"}}>
                    <AreaAndFactorCascader {...this.props} getAreaAndFactorCascader={this.getAreaAndFactorCascader}/>
                </div>

                <div style={{display: 'inline-block'}}>
                    <DateSectionPicker
                        className={styles.selectright}
                        {...this.props}
                        //初始化时间
                        state = {this.state}
                        //回调方法
                        get_time={this.get_time}
                    />
                </div>

                <Button style={{float:"right",marginRight:"68px"}} type="primary" htmlType="submit" icon="search" disabled = {this.state.isLoading}
                        onClick={this.handleSubmit}>查询
                </Button>

                <br/>

                <div style={{display: 'inline-block'}}>
                <RadioGroup onChange={this.heightChange} value={this.state.value?this.state.value:1}>
                    <Radio key="a" value={1}>所有高度</Radio>
                    <Radio key="b" value={2}>其他高度</Radio>
                </RadioGroup>
                </div>

                <div style={{width:"10%",minWidth:"120px",display:"inline-block"}}>
                    <span className={styles.span}>高度:</span>
                    <InputNumber disabled={this.state.hightMode}
                                 min={config.minHeight}
                                 max={config.maxHeight}
                                 step={this.state.heightInterval}
                                 style={{marginRight:"10px"}}
                                 value={this.state.sliderValue}
                                 onChange={this.inputNumberChange1}
                    />
                </div>
                <div style={{width:"60%",display:"inline-block"}}>
                    <Slider disabled={this.state.hightMode}
                            value={this.state.sliderValue}
                            min={config.minHeight}
                            max={config.maxHeight}
                            step={this.state.heightInterval}
                            style={{top:"10px"}}
                            onChange={this.sliderChange}/>
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

    /*
     *时间插件回调传入最新时间
     * */
    get_time=(field, value)=>{
        if(field === "startValue"){
            this.setState({
                time_cj_start:value
            })
        }else{
            this.setState({
                time_cj_end:value
            })
        }
    }

    heightChange = (e) => {
        if (e.target.value == 1) {
            this.setState({
                hightMode: true,
                value: e.target.value,
                sliderValue: 0
            })
        } else {
            this.setState({
                hightMode: false,
                value: e.target.value,
            })
        }
    }

    /*
     * 输入框高度变化的时候
     * */
    inputNumberChange1 = (value)=> {
        this.setState({
            sliderValue: value
        })
    }
    sliderChange = (value)=> {
        this.setState({
            sliderValue: value,
        })
    }
}

//SingleQcomTop.propTypes = {
//    d_colorsAction: React.PropTypes.func.isRequired
//};

export default SingleQcomTop;

