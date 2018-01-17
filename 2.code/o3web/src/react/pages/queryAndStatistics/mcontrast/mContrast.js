/**

 * @Title:SContrast.js
 * @Description:多点对比
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
import { Button ,message, Radio} from 'antd';
import { connect } from 'react-redux';
import * as act from '../../../../redux/actions/queryAndStatistics/mcontrast/mcontrast';
import  MContrastTop from "../../../components/queryAndStatistics/mcontrast/mContrastTop";
import  MContrastPicAll from "../../../components/queryAndStatistics/mcontrast/mContrastPicAll";
import  MHeightContrastPic from "../../../components/queryAndStatistics/mcontrast/mHeightContrastPic";
import {config} from "../../../../utils/config";
import {pubFunc} from "../../../../utils/pubFnc"
import axios from "axios";
import moment from 'moment';
const access_token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');

class MContrast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnFlag:true,//显示对比模式，true显示因子对比图，false显示高度对比图
            wctResult:[],
            scodeArr:[],
            resultData:[],
        }

    }

    render(){
        return (
            <div>
                {/**
                 搜索表单
                 **/}
                <MContrastTop
                    {...this.props}
                    d_colorsAction ={this.d_colorsAction}
                    d_colors_defaultAction ={this.d_colors_defaultAction}
                    isLoading={this.state.isLoading}
                    generate_dom = {this.generate_dom}
                />
                <hr style={{margin:"10px 10px 0 10px", borderTop:"1px solid gray",display:"block"}}/>
                {this.state.btnFlag?
                    this.state.scodeArr.length ===0? null:
                    <MContrastPicAll
                        key="SContrastPicAll"
                        {...this.props}
                         wctResult={this.state.wctResult}
                         scodeArr={this.state.scodeArr}
                        isLoading={this.state.isLoading}
                    />
                    :<MHeightContrastPic
                        key="MHeightContrastPic1"
                        {...this.props}
                        objData={this.state} />}
            </div>
        );
    }

    //调用默认查询之前把查询的条件先传给SContrastPicAll组件，生成dom的回调
    generate_dom = (selectMonitor) =>{
        if(selectMonitor.length>0){
            this.setState({
                scodeArr:selectMonitor[0],//用于提前生成dom,id取对比因子的code
            })
        }
    }

    //伪彩图默认请求查询接口_查询实时伪彩图
    d_colors_defaultAction = (queryData)=> {
        var that = this;
        let selectMonitor = queryData.selectMonitor;
        if(selectMonitor.length>0){
            let monitorCode =selectMonitor[0].key;
            let monitorName =selectMonitor[0].label;
            let time =queryData.time_cj_end;
            let time1 = moment(time).format("YYYYMMDD"),
                time2 = moment(time).format("HHmm");
            let name = parseInt(time2/5)*5;
            let firstUrl = "monitor/"+monitorCode+"/"+time1+'/'+name+".png";
            let firstTimeArr = this.getDateArrByHour(queryData.time_cj_start,queryData.time_cj_end,300*1000)
            let data =[{data:{
                imgUrl:firstUrl,
                factor:queryData.factorCode,
                fname:queryData.factorName,
                scode:monitorCode,
                sname:monitorName,
                extremum:firstTimeArr,
            }}]
            that.setState({
                heightModelFlag: true,
                wctResult:data,
            })
        }
    }

    //按照小时获取时间段中所有的值
    getDateArrByHour = (startTime,endTime,splitTime)=>{
        let arr=[];
        startTime=parseInt(startTime/splitTime)*splitTime +splitTime;
        endTime=parseInt(endTime/splitTime)*splitTime+splitTime;
        for(let i=startTime;i<endTime;i=i+splitTime){
            let date=moment(i).format("MM-DD"),
                time=moment(i).format("HH:mm");
            arr.push(date+'\n'+time);
        }
        return arr;
    }

    //查询接口
    d_colorsAction = (values)=> {
        let url;
        var that = this;
        if(values.scode === undefined || values.scode.length===0){
            message.warn("请选择监测点!")
            return
        }
        if(values.factor === ""){
            message.warn("请选择因子!")
            return
        }
        if(values.hightMode){
            //查询所有高度的,生成伪彩图,时间格式需要转换
            let ts =  new Date(values.time_cj_start).Format1("yyyy-MM-dd hh:mm:ss");
            let es =  new Date(values.time_cj_end).Format1("yyyy-MM-dd hh:mm:ss");
            values.time_cj_start=ts;
            values.time_cj_end=es;
            url = '/api/d_pcolors/list'+"?access_token="+access_token+"&username="+username;
            //循环监测点请求因子伪彩图
            let scodeArr = values.scode;
            that.setState({
                btnFlag: true,
                isLoading:true,
                wctResult:[],
                scodeArr:scodeArr,//用于提前生成dom,id取对比因子的code
            })
            let axiosArr = [];
            if(scodeArr.length>0) {
                for(let i=0;i<scodeArr.length;i++){
                    (function(i){
                        let data= scodeArr[i];
                        let kk= pubFunc.objectClone(values);
                        kk.scode = data.key
                        axiosArr.push(axios.post(url, kk, config));
                    })(i)
                }
                Promise
                    .all(axiosArr)
                    .then(function (result) {
                        //拿到请求结果,开始设置返回值
                        that.setState({
                            btnFlag: true,
                            wctResult: result,
                            isLoading:false,
                        })
                    })
                    .catch(function (err) {
                        message.error("报错了，刷新试试");
                        that.setState({
                            isLoading:false,
                        })
                    })
            }

        }else{
            that.setState({
                btnFlag: false,
                isLoading:true,
                queryData:values,
            })
            //点位转换
            let queryDate =pubFunc.objectClone(values);
            let scode = [];
            for(let i = 0;i<queryDate.scode.length;i++){
                scode.push(queryDate.scode[i].key);
            }
            queryDate.scode=scode.join();
            //查询具体高度的，生成折线图
            url = 'api/line_charts/list'+"?access_token="+access_token+"&username="+username;
            axios.post(url,queryDate,config)
                .then(function (res) {
                    if(res.data.ret==1){
                        let resultData = res.data;
                        if(resultData){
                            that.setState({
                                btnFlag:false,
                                queryData:values,
                                resultData:resultData,
                                isLoading:false,
                            })
                        }else{
                            message.error("获取数据为空!");
                            that.setState({
                                isLoading:false,
                            })
                        }
                    }
                })
                .catch(function(err){
                    message.error("报错了，刷新试试");
                    that.setState({
                        isLoading:false,
                    })
                })
        }
    }
}

function mapStateToProps(state) {
    return {
        //城市点位插件需要的参数
        cityArea:state.Share.cityArea,
        monitorSiteGroup:state.Share.monitorSiteGroup,
        factor:state.Share.factor,
        factorColorList:state.Share.factorColorList,
    }
}

export default connect(mapStateToProps)(MContrast);
