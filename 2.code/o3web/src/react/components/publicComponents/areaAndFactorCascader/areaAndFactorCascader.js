/**

 * @Title: areaAndFactorCascader.js
 * @Description: 城市/区域/监测点/监测因子 联动显示
 * @author jiezd@cychina.cn （揭志东）
 * @date 2017年11月1日 上午10:35:51
 * @version
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from 'react'
import { Cascader,Select} from 'antd'
const Option = Select.Option;


class AreaAndFactorCascader extends  React.Component{

    constructor(props){
        super(props);
        this.state={
            cityArea :this.props.cityArea, //城市区域
            monitorSiteGroup:this.props.monitorSiteGroup, //key是区域id
            factor:this.props.factor,
            monitorArea:[], //插件显示的数组
            factorArea:[], //插件显示的数组,
            monitorCode:"", //监测点选中的值
            factorCode:"",//监测因子选中的值
            factorName:'',//检测因子名称
            monitorName:'',//监测点名称
            cityName:[this.props.cityArea[0].label,this.props.cityArea[0].children[0].label],//城市名称label
            cityCode:[this.props.cityArea[0].value,this.props.cityArea[0].children[0].value] ,//城市区域选中的值
            longAndLat:[], //这个监测点的经纬度
        }
    }

    componentWillMount(){
        this.changeCityArea(this.state.cityCode);
        this.getAreaAndFactorCascader();
    }

    componentDidUpdate(){
        this.getAreaAndFactorCascader();
    }

    render(){
        const monitorAreaOptions = this.state.monitorArea.map(monitor => <Option key={monitor.code}>{monitor.name}</Option>);
        const factorAreaOptions = this.state.factorArea.map(factor => <Option key={factor.fcode}>{factor.fname}</Option>);

        return (
            <div style={{display:"inline-block"}}>
                <span style={{margin:"0 10px"}}>城市区域:</span>
                <Cascader  options={this.props.cityArea} onChange={(value)=>this.changeCityArea(value) }
                    value={this.state.cityCode} allowClear={false}
                />

                <span style={{margin:"0 10px"}}>监测点:</span>
                <Select  style={{ width: 120 }} labelInValue={true} value={{key:this.state.monitorCode,label:this.state.monitorName}} onChange={(value)=>this.changeMonitorArea(value) }>
                    {monitorAreaOptions}
                </Select>

                <span style={{margin:"0 10px"}}>检测因子:</span>
                <Select style={{ width: 120 }} labelInValue={true} value={{key:this.state.factorCode,label:this.state.factorName}} onChange={(value)=>this.changeFactorArea(value) }>
                    {factorAreaOptions}
                </Select>
            </div>
        )
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
            this.state.longAndLat= [currentSite.longitude,currentSite.latitude];
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
            monitorCode:value.key,
            monitorName:value.label
        })
        this.state.factorArea = factorArea;
        this.state.factorCode = factorCode;
        this.state.factorName = factorName;
    }
    //监听监测因子改变的时候
    changeFactorArea=(value)=>{
        this.setState({
            factorCode:value.key,
            factorName:value.label
        })
    }

    getAreaAndFactorCascader = () =>{
        this.props.getAreaAndFactorCascader({monitorCode:this.state.monitorCode,
            factorCode:this.state.factorCode,
            cityCode:this.state.cityCode,
            cityName:this.state.cityName,
            factorName:this.state.factorName,
            monitorName:this.state.monitorName,
            longAndLat:this.state.longAndLat
        })
    }
}


export  default AreaAndFactorCascader