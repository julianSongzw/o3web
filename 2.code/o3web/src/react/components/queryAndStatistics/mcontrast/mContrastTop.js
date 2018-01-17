/**

 * @Title:MContrastTop.js
 * @Description: 多点对比查询条件表单
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
import { connect } from 'react-redux';
import { Select,Cascader,Button ,InputNumber,Slider,Radio,message } from 'antd';
import moment from 'moment';
import * as act from '../../../../redux/actions/queryAndStatistics/singleQact';
import { DateSectionPicker } from '../../../../react/components/publicComponents/timeSectionPicker/DateSectionPicker';
import  {config} from '../../../../utils/config';
const Option = Select.Option;
const RadioGroup = Radio.Group;

class MContrastTop extends React.Component {
    constructor(props) {
        super(props);

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
            factorCode:"",//监测因子选中的值
            factorName:'',//检测因子名称
            selectMonitor:[],//被选中的监测点
            cityName:[this.props.cityArea[0].label,this.props.cityArea[0].children[0].label],//城市名称label
            cityCode:[this.props.cityArea[0].value,this.props.cityArea[0].children[0].value] ,//城市区域选中的值
            //高度滑块默认值
            sliderValue:3000,
            //高度切换
            hightMode:true,
            //开始时间结束时间
            time_cj_start: st,
            time_cj_end: et,
            isLoading:false,
        };
    }
    componentDidMount() {
        //初始化监测点和检测因子
        let oo = this.changeCityArea(this.state.cityCode);
        oo.time_cj_start = this.state.time_cj_start;
        oo.time_cj_end = this.state.time_cj_end;
        //第一次查询
        let sm = [oo.selectMonitor];
        this.props.generate_dom(sm);

        this.props.d_colors_defaultAction(oo);
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
        let  queryData = this.queryDataCheck();
        this.props.d_colorsAction(queryData);
    };

    //查询条件处理
    queryDataCheck = () => {
        let queryData;
        let hightMode = this.state.hightMode;
        if(hightMode){
            queryData = {
                scode:this.state.selectMonitor,
                factor:this.state.factorCode,
                factorName:this.state.factorName,
                h_index:config.heightStep,
                time_cj_start: this.state.time_cj_start._d.getTime(),
                time_cj_end: this.state.time_cj_end._d.getTime(),
                h_start:config.minHeight,
                h_end:config.maxHeight,
                valueMax:config.valueMax,
                valueMin:config.valueMin,
                hightMode:hightMode,
            };
        }else{
            queryData = {
                scode:this.state.selectMonitor,
                factor:this.state.factorCode,
                factorName:this.state.factorName,
                h_value: this.state.sliderValue,
                time_cj_start: this.state.time_cj_start._d.getTime(),
                time_cj_end: this.state.time_cj_end._d.getTime(),
                hightMode:hightMode,
            };
        }
        return queryData;
    }

    render(){
        const monitorAreaOptions = this.state.monitorArea.map(monitor => <Option key={monitor.code}>{monitor.name}</Option>);
        const factorAreaOptions = this.state.factorArea.map(factor => <Option key={factor.fcode}>{factor.fname}</Option>);
        let  selectMonitorOptions = [];
            this.state.selectMonitor.map(sm =>{selectMonitorOptions.push(sm.code)});

        return (
            <div className={styles.singleQcomTopDiv}>
                <div style={{display:"inline-block"}}>
                    <span style={{margin:"0 10px"}}>城市区域:</span>
                    <Cascader  style={{width: 100}} options={this.props.cityArea} onChange={(value)=>this.changeCityArea(value) }
                               value={this.state.cityCode} allowClear={false}
                    />

                    <span style={{margin:"0 10px"}}>监测点:</span>
                    <Select
                        className={styles.selectright}
                        labelInValue={true}
                        multiple
                        allowClear
                        style={{ width: 200 }}
                        value={this.state.selectMonitor}
                        onSelect={(value)=>this.changeMonitorArea(value) }
                        onDeselect={(value)=>this.disChangeMonitorArea(value) }>
                        {monitorAreaOptions}
                    </Select>

                    <span style={{margin:"0 10px"}}>对比因子:</span>
                    <Select  className={styles.selectright} style={{marginTop:10, width: 80 }} labelInValue={true} value={{key:this.state.factorCode,label:this.state.factorName}} onChange={(value)=>this.changeFactor(value) }>
                        {factorAreaOptions}
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

                <br/>

                <RadioGroup onChange={this.heightChange} value={this.state.value?this.state.value:1}>
                    <Radio key="a" value={1}>所有高度</Radio>
                    <Radio key="b" value={2}>其他高度</Radio>
                </RadioGroup>
                <div style={{width:"10%",minWidth:"120px",display:"inline-block"}}>
                    <span className={styles.span}>高度:</span>
                    <InputNumber disabled={this.state.hightMode}
                                 min={0}
                                 max={30000}
                                 step={15}
                                 style={{marginRight:"10px"}}
                                 value={this.state.sliderValue}
                                 onChange={this.inputNumberChange1}
                    />
                </div>
                <div style={{width:"60%",display:"inline-block"}}>
                    <Slider disabled={this.state.hightMode}
                            value={this.state.sliderValue}
                            min={0}
                            max={30000}
                            step={15}
                            style={{top:"13px"}}
                            onChange={this.sliderChange} />
                </div>
            </div>
        );
    }

    //监听城市和区域改变的时候
    changeCityArea = (value)=>{
        this.state.cityCode=value;
        let sites=this.props.monitorSiteGroup[value[1]].sites; //获取这个区域可有监测点
        let factorArea =this.state.factorArea;
        if(sites.length>0){
            let factors = sites[0].factor.split(",");
            for(let i =0 ,le=factors.length ;i<le ;i++){
                for(let j =0 ,lej=this.state.factor.length ;j<lej ;j++){
                    if(this.state.factor[j].fcode == factors[i]){
                        factorArea.push(this.state.factor[j]);
                    }
                }
            }
        }
        let defaultMonitor = sites[0]?[{key:sites[0].code,label:sites[0].name}]:[];
        this.setState({
            monitorArea:sites,
            selectMonitor:defaultMonitor,//重新选了区域之后，默认城市
            factorArea:factorArea,
        })
        let factorCode ="";
        let factorName="";
        if(factorArea.length>0){
            factorCode = factorArea[0].fcode;
            factorName = factorArea[0].fname;
        }
        this.state.monitorArea = sites;
        this.state.factorArea = factorArea;
        this.state.factorCode = factorCode;
        this.state.factorName = factorName;

        let ro = {
            selectMonitor:defaultMonitor,
            factorCode:factorCode,
            factorName:factorName,
        };

        return ro;
    }
    //监听监测点改变的时候
    changeMonitorArea=(value)=>{
        let currentSite ;
        let selectMonitor = this.state.selectMonitor;
        for(let i=0,le=this.state.monitorArea.length;i<le;i++){
            if(value.key == this.state.monitorArea[i].code){
                currentSite = this.state.monitorArea[i];
                selectMonitor.push({key:this.state.monitorArea[i].code,label:this.state.monitorArea[i].name});
            }
        }
        let factorArea =this.state.factorArea;
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
        if(factorArea.length>0){
            factorCode = factorArea[0].fcode;
            factorName = factorArea[0].fname;
        }
        this.setState({
            factorArea:factorArea,
            factorCode:factorCode,
            factorName:factorName,
            selectMonitor:selectMonitor
        })
        this.state.factorArea = factorArea;
        this.state.factorCode = factorCode;
        this.state.factorName = factorName;
    }

    //监听监测点不选的时候
    disChangeMonitorArea=(value)=>{
        let selectMonitor = this.state.selectMonitor;
        for(let i=0,le=this.state.monitorArea.length;i<le;i++){
            if(selectMonitor.length>0 && selectMonitor[i] !== undefined){
                if(value.key === selectMonitor[i].key){
                    selectMonitor.splice(i);
                }
            }
        }
        this.setState({
            selectMonitor:selectMonitor
        })
    }

    //因子
    changeFactor=(value)=>{
        this.setState({
            factorCode:value.key,
            factorName:value.label
        })
    }

    heightChange = (e) => {
        if(e.target.value == 1){
            this.setState({
                hightMode:true,
                value: e.target.value,
                sliderValue:0
            })
        }else{
            this.setState({
                hightMode:false,
                value: e.target.value,
            })
        }
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
            sliderValue:value
        })
    }
    sliderChange=(value)=>{
        this.setState({
            sliderValue:value,
        })
    }
}
export default MContrastTop;