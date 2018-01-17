/**

 * @Title:StatisticsPic.js
 * @Description: 统计查询条件表单
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
import { Cascader,Select,DatePicker,Button,Form,Slider, InputNumber  } from 'antd';
import HeightInterval from '../../../components/publicComponents/heightInterval/heightInterval'
import  {config} from '../../../../utils/config';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

class StatisticsTop extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            //城市、监测点、检测因子
            cityArea :this.props.cityArea, //城市区域
            monitorSiteGroup:this.props.monitorSiteGroup, //key是区域id
            factor:this.props.factor,
            monitorArea:[], //插件显示的数组
            factorArea:[], //插件显示的数组,
            factorCode:"",//监测因子选中的值
            factorName:'',//检测因子名称
            cityName:[this.props.cityArea[0].label,this.props.cityArea[0].children[0].label],//城市名称label
            cityCode:[this.props.cityArea[0].value,this.props.cityArea[0].children[0].value] ,//城市区域选中的值

            //高度的两个参数
            //startSliderValue:config.heightStep,//高度起始
            startSliderValue:0,
            endSliderValue:3000,//高度结束
            datePick:true,
            mouth:true,
            heightInterval:config.heightStep, //高度间隔  插件
            isLoading:false,
        };
    }
    componentDidMount() {
        //初始化监测点和检测因子
        this.changeCityArea(this.state.cityCode);

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let queryData = this.queryDataCheck(values);
                //判断查询条件比较模式，回调父组件recordView方法只显示对应图表
                this.props.d_colorsAction(queryData);
            }
        });
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
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let queryData = this.queryDataCheck(values);
                //判断查询条件比较模式，回调父组件recordView方法只显示对应图表
                this.props.d_colorsAction(queryData);
            }
        });
    };

    //查询条件处理
    queryDataCheck = (values) => {
        debugger
        let that = this;
        let timeArr = this.timeCheck(values.start,values.wd)
        let queryData = {
            scode:values.scode,
            factor:values.factor,
            h_start:that.state.startSliderValue,
            h_end:that.state.endSliderValue,
            time_cj_start: timeArr[0],
            time_cj_end: timeArr[1],
            h_index:that.state.heightInterval,
            date_interval:values.wd,
            };
        return queryData;
    }

    //时间处理
    timeCheck = (momentV,wd) => {
        let st,et,timeArr = [];
        var b1 = moment(momentV);
        var b2 = moment(momentV);
        //第一个push的是开始时间，后面是结束时间
        if(wd === "day"){
            //一天的开始时间
            st = b1.startOf('day')._d.getTime();
            et = b2.endOf('day')._d.getTime();
        }else if(wd === "week"){
            st = b1.startOf('week')._d.getTime();
            et = b2.endOf('week')._d.getTime();
        }else if(wd === "month"){
            st = b1.startOf('month')._d.getTime();
            et = b2.endOf('month')._d.getTime();
        }
        timeArr.push(st,et);
        return timeArr;
    }

    ////时间处理
    //timeCheck = (momentV,wd) => {
    //    debugger
    //    let st,et,timeArr = [];
    //    var b1 = moment(momentV);
    //    var b2 = moment(momentV);
    //    //第一个push的是开始时间，后面是结束时间
    //    if(wd === "day"){
    //        //一天的开始时间
    //        st = b1.startOf('day')._d.getTime();
    //        if(st === moment(new Date()).startOf('day')._d.getTime()){
    //            //如果st等于今天的0点,则结束时间就是当前时间
    //            et = b2._d.getTime();
    //        }else{
    //            //否则结束时间应该取endOf('day')
    //            et = b2.endOf('day')._d.getTime();
    //        }
    //    }else if(wd === "week"){
    //        st = b1.startOf('week')._d.getTime();
    //        et = b2._d.getTime();
    //    }else if(wd === "month"){
    //        st = b1.startOf('month')._d.getTime();
    //        et = b2._d.getTime();
    //    }
    //    timeArr.push(st,et);
    //    return timeArr;
    //}

    render(){
        const { getFieldDecorator } = this.props.form;
        const monitorAreaOptions = this.state.monitorArea.map(monitor => <Option key={monitor.code}>{monitor.name}</Option>);
        const factorAreaOptions = this.state.factorArea.map(factor => <Option key={factor.fcode}>{factor.fname}</Option>);
        return (
            <div className={styles.singleQcomTopDiv}>
                <Form onSubmit={this.handleSubmit} layout="inline" className={styles.singleQcomTopForm}>
                    <div style={{display:"inline-block"}}>
                        <span style={{margin:"0 10px"}}>城市区域:</span>
                        <Cascader  style={{width: 100}} options={this.props.cityArea} onChange={(value)=>this.changeCityArea(value) }
                                   value={this.state.cityCode} allowClear={false}
                        />

                        <FormItem>
                        <span style={{margin:"0 10px"}}>监测点:</span>
                            {getFieldDecorator("scode")(
                                <Select
                                    className={styles.selectright}
                                    labelInValue={true}
                                    multiple
                                    allowClear
                                    style={{ width: 200 }}
                                    onSelect={(value)=>this.changeMonitorArea(value) }>
                                    {monitorAreaOptions}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem>
                        <span style={{margin:"0 10px"}}>检测因子:</span>
                            {getFieldDecorator("factor")(
                                <Select
                                    className={styles.selectright}
                                    labelInValue={true}
                                    multiple
                                    allowClear
                                    style={{ width: 200 }}>
                                    {factorAreaOptions}
                                </Select>
                            )}
                        </FormItem>

                    </div>
                    <FormItem>
                        <span style={{margin:"0 10px"}}>查询周期:</span>
                        {getFieldDecorator("wd",{initialValue:"day"})(
                            <Select
                                className={styles.selectright}
                                style={{ width: 80 }}
                                onChange={this.ModeChange}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                <Option key="day" value="day">日报</Option>
                                <Option key="week" value="week">周报</Option>
                                <Option key="month" value="month">月报</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem>
                        {
                            this.state.mouth ?   <span>
                               {getFieldDecorator("start",{initialValue:moment(new Date(new Date()), "YYYY-MM-DD")})(
                                   this.state.datePick?<DatePicker  allowClear={false} className={styles.selectleft}/>
                                       :<MonthPicker allowClear={false} className={styles.selectleft} />
                               )}
                        </span>:null
                        }
                    </FormItem>
                    <Button style={{float:"right",marginRight:"68px"}} type="primary" htmlType="submit" icon="search" disabled = {this.state.isLoading}>查询</Button>
                    <br/>
                    <FormItem>
                        <span style={{margin:"0 10px"}}>高度间隔:</span>
                        {getFieldDecorator("h_index",{initialValue:this.state.heightInterval === ""?"":this.state.heightInterval})(
                            <div style={{display: 'inline-block',marginTop:'10px',width: '60px'}}>
                                <HeightInterval  className={styles.selectright} {...this.props} getHeightInterval={this.getHeightInterval}/>
                            </div>
                        )}
                    </FormItem>
                    <div style={{minWidth:"250px",display:"inline-block",marginTop: '13px'}}>
                        <span style={{margin:"0 10px"}}>高度至:</span>
                        <InputNumber
                            min={0}
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
                            value={[0, this.state.endSliderValue]}
                            min={0}
                            max={config.maxHeight}
                            step={this.state.heightInterval}
                            style={{top:"13px"}}
                            onChange={this.sliderChange} />
                    </div>
                </Form>
            </div>
        );

    }

    //监听城市和区域改变的时候
    changeCityArea = (value)=>{
        this.state.cityCode=value;
        let sites=this.props.monitorSiteGroup[value[1]].sites; //获取这个区域可有监测点
        this.setState({
            monitorArea:sites,
        })
        this.state.monitorArea = sites;
    }
    //监听监测点改变的时候
    changeMonitorArea=(value)=>{
        let currentSite ;
        for(let i=0,le=this.state.monitorArea.length;i<le;i++){
            if(value.key == this.state.monitorArea[i].code){
                currentSite = this.state.monitorArea[i];
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
        })
        this.state.factorArea = factorArea;
        this.state.factorCode = factorCode;
        this.state.factorName = factorName;
    }

    /*
     *传递给高度间隔插件，用于获取最新的高度间隔
     * */
    getHeightInterval=(value)=>{
        this.setState({
            heightInterval:parseInt(value)
        })
    }

    ModeChange = (value) => {
        if(value=="day" || value=="week"){
            this.setState({
                datePick: true,
                mouth:false
            },function(){
                this.setState({mouth:true})
            });
        }else{
            this.setState({
                datePick: false,
                mouth:false
            },function(){
                this.setState({mouth:true})
            });
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
            startSliderValue:0,
            endSliderValue: value[1]
        })
    }
}


StatisticsTop.propTypes = {
    onSearchData: React.PropTypes.func.isRequired
};
const StatisticsTopForm = Form.create()(StatisticsTop);
export default StatisticsTopForm;