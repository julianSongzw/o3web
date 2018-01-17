/**

 * @Title:SContrastTop.js
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
import styles from "./../contrast.css";
import * as act from '../../../../redux/actions/queryAndStatistics/singleQact';
import { connect } from 'react-redux';
import { Cascader,Select,DatePicker,Button,Form ,InputNumber,Slider,message } from 'antd';
import moment from 'moment';
import  {config} from '../../../../utils/config';
import HeightInterval from '../../../components/publicComponents/heightInterval/heightInterval'
import { DateSectionPicker } from '../../../../react/components/publicComponents/timeSectionPicker/DateSectionPicker';
const Option = Select.Option;

class SContrastTop extends React.Component {

    constructor(props) {
        super(props);
        //初始化时间
        //初始化时间
        let et = moment(new Date());
        let st = moment(new Date()).subtract(24, 'hours');
        this.state={
            //城市、监测点、检测因子
            cityArea :this.props.cityArea, //城市区域
            monitorSiteGroup:this.props.monitorSiteGroup, //key是区域id
            factor:this.props.factor,
            monitorArea:[], //插件显示的数组
            factorArea:[], //插件显示的数组,
            monitorCode:"", //监测点选中的值
            //因子对比有两个因子
            factorCode1:"",//监测因子选中的值
            factorName1:'',//检测因子名称
            factorCode2:"",//监测因子选中的值
            factorName2:'',//检测因子名称
            //高度对比模式下对比因子只有1个
            factorCode:"",//监测因子选中的值
            factorName:'',//检测因子名称
            monitorName:'',//监测点名称
            cityName:[this.props.cityArea[0].label,this.props.cityArea[0].children[0].label],//城市名称label
            cityCode:[this.props.cityArea[0].value,this.props.cityArea[0].children[0].value] ,//城市区域选中的值
            //默认对比模式是factor因子对比
            contrastMode:"factor",
            //高度的两个参数
            sliderValue1:config.heightStep,
            sliderValue2:3000,
            heightInterval:config.heightStep, //高度间隔  插件
            //开始时间结束时间
            time_cj_start: st,
            time_cj_end: et,
            isLoading:false,
        };
    }
    componentDidMount() {
        //初始化监测点和检测因子
        this.changeCityArea(this.state.cityCode);
        let queryData = this.queryDataCheck();
        //调用默认查询之前把查询的条件先传给SContrastPicAll组件，生成dom
        let factorArr = [queryData.factorCode1,queryData.factorCode2];
        this.props.generate_dom(factorArr);

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
        debugger
        let queryData = this.queryDataCheck();
        this.props.d_colorsAction(queryData);
    };

    //查询条件处理
    queryDataCheck = () => {
        let queryData;
        if(this.state.contrastMode === "factor"){
            //因子对比
            queryData = {
                scode:this.state.monitorCode,
                sname:this.state.monitorName,
                factorCode1:this.state.factorCode1,
                factorName1:this.state.factorName1,
                factorCode2:this.state.factorCode2,
                factorName2:this.state.factorName2,
                time_cj_start: this.state.time_cj_start._d.getTime(),
                time_cj_end: this.state.time_cj_end._d.getTime(),
                contrastMode:this.state.contrastMode,
                h_index:this.state.heightInterval,
                h_start:config.minHeight,
                h_end:config.maxHeight,
                valueMax:config.valueMax,
                valueMin:config.valueMin,
            };
        }else if(this.state.contrastMode === "height"){
            //高度对比
            queryData = {
                scode:this.state.monitorCode,
                sname:this.state.monitorName,
                factor:this.state.factorCode,
                factorName:this.state.factorName,
                h_start:this.state.sliderValue1,
                h_end:this.state.sliderValue2,
                h_index:this.state.heightInterval,
                time_cj_start: this.state.time_cj_start._d.getTime(),
                time_cj_end: this.state.time_cj_end._d.getTime(),
                contrastMode:this.state.contrastMode,
            };
        }
        return queryData;
    }

    render(){
        const monitorAreaOptions = this.state.monitorArea.map(monitor => <Option key={monitor.code}>{monitor.name}</Option>);
        const factorAreaOptions = this.state.factorArea.map(factor => <Option key={factor.fcode}>{factor.fname}</Option>);
        return (
            <div className={styles.singleQcomTopDiv}>
                <div style={{display:"inline-block"}}>
                    <span style={{margin:"0 10px"}}>城市区域:</span>
                    <Cascader  style={{width: 100}} options={this.props.cityArea} onChange={(value)=>this.changeCityArea(value) }
                               value={this.state.cityCode} allowClear={false}
                    />

                    <span style={{margin:"0 10px"}}>监测点:</span>
                    <Select  style={{ width: 100 }} labelInValue={true} value={{key:this.state.monitorCode,label:this.state.monitorName}} onChange={(value)=>this.changeMonitorArea(value) }>
                        {monitorAreaOptions}
                    </Select>
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


                    <div style={{display:"inline-block"}}>
                    <Select className={styles.selectright} style={{ width: 80 }} onChange={this.handleConstrastModeChange} value={this.state.contrastMode}>
                        {<option value="factor">因子对比</option>}
                        {<option value="height">高度对比</option>}
                    </Select>
                    </div>

                    {this.state.contrastMode ==="factor"?

                        <div style={{display:"inline-block"}}>
                            <span style={{margin:"0 10px"}}>因子1:</span>
                            <Select  className={styles.selectright} style={{ width: 60 }} labelInValue={true}
                                     value={{key:this.state.factorCode1,label:this.state.factorName1}} onChange={(value)=>this.changeFactor1(value) }
                            >
                                {factorAreaOptions}
                            </Select>

                            <span style={{margin:"0 10px"}}>因子2:</span>
                            <Select  className={styles.selectright} style={{ width: 60 }} labelInValue={true}
                                     value={{key:this.state.factorCode2,label:this.state.factorName2}} onChange={(value)=>this.changeFactor2(value) }
                            >
                                {factorAreaOptions}
                            </Select>
                        </div>
                        :
                        <div>
                            <span style={{margin:"0 10px"}}>对比因子:</span>
                            <Select  className={styles.selectright} style={{marginTop:10, width: 80 }} labelInValue={true} value={{key:this.state.factorCode,label:this.state.factorName}} onChange={(value)=>this.changeFactor(value) }>
                                {factorAreaOptions}
                            </Select>

                            <span style={{margin:"0 10px"}}>高度间隔:</span>
                            <div style={{display: 'inline-block',marginTop:'10px',width: '60px'}}>
                            <HeightInterval  className={styles.selectright} {...this.props} getHeightInterval={this.getHeightInterval}/>
                            </div>

                            <span style={{margin:"0 10px"}}>高度从:</span>
                            <InputNumber
                                className={styles.selectright}
                                min={config.minHeight}
                                max={config.maxHeight}
                                step={this.state.heightInterval}
                                style={{width: 70}}
                                value={this.state.sliderValue1}
                                onChange={this.inputNumberChange1}
                            /><span style={{margin:"0 10px"}}>至</span>
                            <InputNumber
                                className={styles.selectright}
                                min={config.minHeight}
                                max={config.maxHeight}
                                step={this.state.heightInterval}
                                style={{width: 70}}
                                value={this.state.sliderValue2}
                                onChange={this.inputNumberChange2}
                            />
                            <Slider range value={[this.state.sliderValue1, this.state.sliderValue2]}
                                    min={0} max={30000} step={this.state.heightInterval} onChange={this.sliderChange}
                                    style={{width:"40%",top:"10px",display:"inline-block"}}
                                />
                        </div>
                    }
            </div>
        );
    }

    //监听城市和区域改变的时候
    changeCityArea = (value)=>{
        this.state.cityCode=value;
        let monitorCode="";
        let monitorName="";
        let sites=this.props.monitorSiteGroup[value[1]].sites; //获取这个区域可有监测点
        if(sites.length > 0){
            monitorCode=sites[0].code;
            monitorName=sites[0].name;
        }
        this.setState({
            monitorArea:sites,
            monitorCode:monitorCode,
            monitorName:monitorName
        })
        this.state.monitorArea = sites;
        this.state.monitorCode = monitorCode;
        this.state.monitorName = monitorName;
        this.changeMonitorArea({key:monitorCode,label:monitorName});

    }
    //监听监测点改变的时候
    changeMonitorArea=(value)=>{
        let currentSite ;
        for(let i=0,le=this.state.monitorArea.length;i<le;i++){
            if(value.key == this.state.monitorArea[i].code){
                currentSite = this.state.monitorArea[i];
            }
        }
        let factorArea =[];
        if(currentSite){
            let factors = currentSite.factor.split(",");
            for(let i =0 ,le=factors.length ;i<le ;i++){
                for(let j =0 ,lej=this.state.factor.length ;j<lej ;j++){
                    if(this.state.factor[j].fcode == factors[i]){
                        factorArea.push(this.state.factor[j]);
                    }
                }
            }
        }
        let factorCode ="";
        let factorName="";
        let factorCode1 ="";
        let factorName1="";
        let factorCode2 ="";
        let factorName2="";
        if(factorArea.length>1){
            factorCode = factorArea[0].fcode;
            factorName = factorArea[0].fname;
            factorCode1 = factorArea[0].fcode;
            factorName1 = factorArea[0].fname;
            factorCode2 = factorArea[1].fcode;
            factorName2 = factorArea[1].fname;
        }
        this.setState({
            factorArea:factorArea,
            factorCode:factorCode,
            factorName:factorName,
            factorCode1:factorCode1,
            factorName1:factorName1,
            factorCode2:factorCode2,
            factorName2:factorName2,
            monitorCode:value.key,
            monitorName:value.label
        })
        this.state.factorArea = factorArea;
        this.state.factorCode = factorCode;
        this.state.factorName = factorName;
        this.state.factorCode1 = factorCode1;
        this.state.factorName1 = factorName1;
        this.state.factorCode2 = factorCode2;
        this.state.factorName2 = factorName2;
    }

    //因子
    changeFactor=(value)=>{
        this.setState({
            factorCode:value.key,
            factorName:value.label
        })
    }
    //因子1
    changeFactor1=(value)=>{
        debugger
        this.setState({
            factorCode1:value.key,
            factorName1:value.label
        })
    }
    //因子2
    changeFactor2=(value)=>{
        this.setState({
            factorCode2:value.key,
            factorName2:value.label
        })
    }

    handleConstrastModeChange = (value) => {
        this.setState({
            contrastMode: value
        })
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

    /*
     * 输入框高度变化的时候
     * */
    inputNumberChange1=(value)=>{
        this.setState({
            sliderValue1:value
        })
    }
    sliderChange=(value)=>{
        this.setState({
            sliderValue1:value[0],
            sliderValue2: value[1]
        })
    }
    inputNumberChange2=(value)=>{
        this.setState({
            sliderValue2:value
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


SContrastTop.propTypes = {
    onSearchData: React.PropTypes.func.isRequired
};
const SContrastTopForm = Form.create()(SContrastTop);
export default SContrastTopForm;

