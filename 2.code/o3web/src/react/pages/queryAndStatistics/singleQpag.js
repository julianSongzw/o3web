/**

 * @Title:SingleQpag.js
 * @Description:单点对比
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
import styles from "./singleQpag.css";
import { Button ,message, Radio} from 'antd';
import { connect } from 'react-redux';
import  SingleQcomTop from "../../components/queryAndStatistics/singleQcomTop";
import  SingleQcomPicLow from "../../components/queryAndStatistics/singleQcomPicLow";
import  SingleQcomPicAll from "../../components/queryAndStatistics/singleQcomPicAll";
import {config} from "../../../utils/config"
import axios from "axios";
import moment from 'moment';
import LkLine from '../../../react/components/publicComponents/line/lkLine'
const access_token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');

class SingleQpag extends React.Component {
    constructor(props){
        super(props);
        this.state={
            heightModelFlag:true,//所有高度OR某一高度
            queryData:"",//查询条件需要带回到子组件
            resultData:[],//数据库返回数据
            //伪彩图需要的state
            imgUrl:"",
            maxArr:[], // 伪彩图最大值对应的高度,
            maxValueArr:[],
            maxHeightArr:[],
            timeArr:[],
            isLoading:false ,//伪彩图是不是在加载中
        };
    }

    render(){
        return (
            <div>
                <SingleQcomTop {...this.props}
                    d_colorsAction ={this.d_colorsAction}
                    d_colors_defaultAction ={this.d_colors_defaultAction}
                    isLoading={this.state.isLoading}
                />
                <hr style={{margin:"10px 10px 0 10px", borderTop:"1px solid gray",display:"block"}}/>
                {this.state.heightModelFlag?<SingleQcomPicAll {...this.props}  objData={this.state}/>:<SingleQcomPicLow {...this.props} objData={this.state}/>}
            </div>
        );
    }

    //伪彩图默认请求查询接口_查询实时伪彩图
    d_colors_defaultAction = (queryData)=> {
        var that = this;
        that.setState({
            isLoading:true,
            heightModelFlag: true,
        })
        let monitorCode = queryData.scode;
        let time =queryData.time_cj_end;
        let time1 = moment(time).format("YYYYMMDD"),
            time2 = moment(time).format("HHmm");
        let name = parseInt(time2/5)*5;
        let firstUrl = "monitor/"+monitorCode+"/"+time1+'/'+name+".png";
        let firstTimeArr = this.getDateArrByHour(queryData.time_cj_start,queryData.time_cj_end,300*1000)
        that.setState({
            heightModelFlag: true,
            imgUrl:firstUrl,
            firstTimeArr:firstTimeArr,
            isLoading:false,
            sname:queryData.monitorName,
            scode:queryData.scode,
            fname:queryData.factorName,
            fcode:queryData.factor,
        })

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
    d_colorsAction = (queryData)=> {
        let url;
        var that = this;
        if(queryData.h_value === undefined){
            //查询所有高度的,生成伪彩图,时间格式需要转换
            let ts =  new Date(queryData.time_cj_start).Format1("yyyy-MM-dd hh:mm:ss");
            let es =  new Date(queryData.time_cj_end).Format1("yyyy-MM-dd hh:mm:ss");
            queryData.time_cj_start=ts;
            queryData.time_cj_end=es;
            queryData.timeStep = config.timeStep;//时间间隔
            that.setState({
                isLoading:true,
                heightModelFlag: true,
            })
            url = 'api/d_pcolors/list'+"?access_token="+access_token+"&username="+username;
            axios.post(url,queryData,config)
                .then(function (res) {
                    if(res.data.ret==1) {
                        let imgUrl = res.data.imgUrl;
                        let extremum =res.data.extremum;
                        let sname = res.data.sname;
                        let fname = res.data.fname;
                        let fcode = res.data.factor;
                        let maxArr=[]; //最大值所在高度数组只要第一个
                        let maxValueArr=[];//最大值数组，
                        let maxHeightArr =[] ; //最大值所在高度数组
                        let timeArr = [];//时间数组
                        for(let index in extremum){
                            let data = extremum[index];
                            if(data.max !==undefined){
                                timeArr.push(index);
                                let height =parseInt(data.max.height)/1000 || "0";
                                let maxValue  = data.max.value || 0 ;
                                maxArr.push(height);
                                maxHeightArr.push(data.max.height || "0");
                                maxValueArr.push(maxValue);
                            }
                        }
                        that.setState({
                            heightModelFlag: true,
                            imgUrl:imgUrl,
                            maxArr:maxArr,
                            maxValueArr:maxValueArr,
                            maxHeightArr:maxHeightArr,
                            timeArr:timeArr,
                            isLoading:false,
                            sname:sname,
                            fname:fname,
                            fcode:fcode,
                        })
                    }else{
                        message.error(res.data.msg);
                    }
                })
                .catch(function(err){
                    message.error("报错了，刷新试试");
                    console.log(err);
                    that.setState({
                        isLoading:false,
                    })
                })
        }else{
            that.setState({
                isLoading:true
            })
            //查询具体高度的，生成折线图
            url = 'api/line_charts/list'+"?access_token="+access_token+"&username="+username;
            var that = this;
            axios.post(url,queryData,config)
                .then(function (res) {
                    if(res.data.ret==1){
                        let resultData = res.data[queryData.scode][queryData.factor];
                        that.setState({
                            heightModelFlag:false,
                            queryData:queryData,
                            resultData:resultData,
                            isLoading:false,
                        })
                    }else{
                        message.error(res.data.msg);
                    }
                })
                .catch(function(err){
                    message.error("报错了，刷新试试");
                    console.log(err);
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

export default connect(mapStateToProps)(SingleQpag);