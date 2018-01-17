/**

 * @Title: diffusion.js
 * @Description: 扩散分析页面
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
import  distyles from '../diffusion/diffusion.css'
import { Cascader,Icon,Input, Button,Select,Slider,InputNumber,Radio,DatePicker} from 'antd'
import  bofang from '../../../../public/images/bofang.png'
import  zanting from '../../../../public/images/zanting.png'
import AreaAndFactorCascader from '../../../components/publicComponents/areaAndFactorCascader/areaAndFactorCascader'
import moment from 'moment';
import  * as act from '../../../../redux/actions/analysis/diffusion'
import webDeviceIcon from '../../../../public/images/webDevice.png'

moment.locale('zh-cn');

const Option = Select.Option;
const hours=["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00",
    "11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]

class Diffusion extends   React.Component{
    constructor(props) {
        super(props);
        this.state={
            map:'',//地图对象
            heatmap:'',//热力图对象
            defaultValue:moment(new Date()), //默认时间点
            setIntervalHeatMap:{},//循环
            setIntervalHeatMapIndex:-1,
            moveFalg:false,
            cityCode:[], //[城市，区域]code
            monitorCode:"", //监测点code
            factorCode:'', //检测因子code
            monitorName:'',//监测点名称
            factorName:"",//检测因子名称,
            timeGrain:{key:"60",label:"60分钟"}, //时间粒度
            longAndLat:[],//选择的站点的经纬度
            diffusionFlag:this.props.diffusionFlag
        }
    }

    componentWillReceiveProps(nextProps){
        debugger;
        if(nextProps.heatmapPointArr){
            this.state.map.setCenter(this.state.longAndLat);
            new window.AMap.Marker({
                map:  this.state.map,
                position: this.state.longAndLat,
                icon: new window.AMap.Icon({
                    size: new window.AMap.Size(40, 50),  //图标大小
                    image:  webDeviceIcon
                })
            })
            clearInterval(this.state.setIntervalHeatMap);
            this.state.setIntervalHeatMapIndex=-1;
            this.state.setIntervalHeatMapIndex=this.state.setIntervalHeatMapIndex  >  24 ? 0 : this.state.setIntervalHeatMapIndex;
            this.state.heatmap.show();
            this.state.heatmap.setDataSet({data:nextProps.heatmapPointArr[this.state.setIntervalHeatMapIndex],max:20}); // 热力图
            this.state.setIntervalHeatMapIndex++;
            this.setState({
                setIntervalHeatMapIndex:this.state.setIntervalHeatMapIndex++
            })
            this.state.setIntervalHeatMap=setInterval(function(){
                this.state.setIntervalHeatMapIndex=this.state.setIntervalHeatMapIndex  >  24 ? 0 : this.state.setIntervalHeatMapIndex;
                this.state.heatmap.show();
                this.state.heatmap.setDataSet({data:nextProps.heatmapPointArr[this.state.setIntervalHeatMapIndex],max:20}); // 热力图
                this.setState({
                    setIntervalHeatMapIndex:this.state.setIntervalHeatMapIndex++
                })
                this.state.setIntervalHeatMapIndex++;
            }.bind(this),1000);
        }
    }


    componentDidMount(){
        let map,heatmap;
        map = new window.AMap.Map('container_Diffusion', {
            zoom: 11,
            center:[117.152262,31.856611],
        });
        map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new window.AMap.ToolBar());
        });

        if(!window.AMap.Heatmap){
            map.plugin(["AMap.Heatmap"]);
        }

        //初始化heatmap对象
        heatmap = new window.AMap.Heatmap(map,{
            radius: 25, //给定半径
            opacity: [0, 0.8]});
        this.state.map=map;
        this.state.heatmap=heatmap;
    }

    componentWillUnmount(){
        clearInterval(this.state.setIntervalHeatMap);
    }

    render(){

        let mapIndex=this.state.setIntervalHeatMapIndex;
        //循环进度条
        let process=[];
        debugger;
        if(this.props.heatmapPointArr ||  true){
            hours.map(function(item,index){
                if(index < mapIndex){
                    process.push(<div key={index} className={distyles.moved}><span className={distyles.road}></span><span className={distyles.cir}></span>
                        <span className={distyles.font}>{hours[index]}</span></div>)
                }else if(index === mapIndex){
                    process.push(<div key={index} className={distyles.moveing}><span className={distyles.road}></span><span className={distyles.cir}></span>
                        <span className={distyles.font}>{hours[index]}</span></div>)
                }else{
                    process.push(<div key={index} ><span className={distyles.road}></span><span className={distyles.cir}></span>
                        <span className={distyles.font}>{hours[index]}</span></div>)
                }
            })
        }



        return(
            <div  className={styles.correlation}>
                {/*
                 查询条件
                 */}
                <header>
                    <div style={{display:"inline-block"}}>
                        <AreaAndFactorCascader {...this.props} getAreaAndFactorCascader={this.getAreaAndFactorCascader}/>
                    </div>
                    <span className={styles.span}>日期:</span>
                    <DatePicker value={this.state.defaultValue} style={{ width: 100 }} onChange={this.dateChange} allowClear={false} />

                    <span className={styles.span}>粒度:</span>
                    <Select value={this.state.timeGrain} style={{width:"100px"}} labelInValue={true} onChange={this.timeGrainChange}>
                        <Option value='60'>60分钟 </Option>
                    </Select>

                    <Button type="primary" onClick={this.queryDataClick} style={{float:"right",marginRight:"68px"}}>查询</Button>
                </header>
                {/*
                 展示图
                 */}
                <content>
                    <div id="container_Diffusion" style={{height:"500px",width:"90%",marginLeft:"5%",marginTop:"20px"}}>
                    </div>
                    <section className={distyles.toolBar}>
                        {process}
                    </section>
                    <section style={{marginTop:"32px"}}>
                        <img src={this.state.moveFalg ? zanting : bofang}
                             onClick={this.bofang}
                             style={{cursor:"pointer",display: this.props.heatmapPointArr ? "block" : "none"}} />
                    </section>
                </content>

            </div>
        )
    }

    /*
    * 时间改变
    * */
    dateChange = (value)=>{
        this.setState({
            defaultValue:value
        })
    }
    /*
    * 时间粒度改变
    * */
    timeGrainChange=(value)=>{
        this.setState({
            timeGrain:value
        })
    }

    /*
    * 点击查询按钮
    * */
    queryDataClick=()=>{
        let params={
            scode:this.state.monitorCode,
            factor:this.state.factorCode,
            scodeName:this.state.monitorName,
            factorName:this.state.factorName,
            timeGrain:this.state.timeGrain.key,
            time:moment(this.state.defaultValue).format('X')*1000, //精确到毫秒的,
            longAndLat:this.state.longAndLat
        }
        console.log(params,"asdfasdfasd");
        this.props.queryDataSubmit();
    }

    /*
    点击播放或者暂停按钮
    * */
    bofang=()=>{
        debugger;
        if(this.state.moveFalg){
            clearInterval(this.state.setIntervalHeatMap);
           this.state.setIntervalHeatMap=setInterval(function(){
                this.state.setIntervalHeatMapIndex=this.state.setIntervalHeatMapIndex  >  24 ? 0 : this.state.setIntervalHeatMapIndex;
                this.state.heatmap.show();
                this.state.heatmap.setDataSet({data:this.props.heatmapPointArr[this.state.setIntervalHeatMapIndex],max:20}); // 热力图
                this.setState({
                    setIntervalHeatMapIndex:this.state.setIntervalHeatMapIndex++
                })
                this.state.setIntervalHeatMapIndex++;
            }.bind(this),1000);
            this.setState({
                moveFalg:false,
            })
        }else{
            this.setState({
                moveFalg:true,
                setIntervalHeatMapIndex:this.state.setIntervalHeatMapIndex-1
            })
            clearInterval(this.state.setIntervalHeatMap);
        }
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
        this.state.longAndLat =myjson.longAndLat;
    }
}

function mapStateToProps(state) {
    return {
        heatmapPointArr:state.Diffusion.heatmapPointArr,
        diffusionFlag:state.Diffusion.diffusionFlag,
        cityArea:state.Share.cityArea,
        monitorSiteGroup:state.Share.monitorSiteGroup,
        factor:state.Share.factor
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryDataSubmit:(param) => {
            dispatch(act.queryDataSubmit(param))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Diffusion);