/**

 * @Title:SContrast.js
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
import { Button ,message, Radio} from 'antd';
import { connect } from 'react-redux';
import  SContrastTopForm from "../../../components/queryAndStatistics/scontrast/sContrastTop";
import * as act from '../../../../redux/actions/queryAndStatistics/scontrast/scontrast';
import  SContrastPicAll from "../../../components/queryAndStatistics/scontrast/sContrastPicAll";
import  SHeightContrastPic from "../../../components/queryAndStatistics/scontrast/sHeightContrastPic";
import {config} from "../../../../utils/config"
import {pubFunc} from "../../../../utils/pubFnc"
import axios from "axios";
import moment from 'moment';
const access_token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');

class SContrast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnFlag:true,//显示对比模式，true显示因子对比图，false显示高度对比图
            resultData:[],//数据库返回数据
            isLoading:false ,//伪彩图是不是在加载中
            factorArr:[],
            maxArr:[], // 伪彩图最大值对应的高度,
            maxValueArr:[],
            maxHeightArr:[],
            timeArr:[],
        }

    }

    render(){
        let pic = [];
        if(this.state.btnFlag){
            pic.push(<SContrastPicAll key="SContrastPicAll"  {...this.props} objData={this.state} factorArr={this.state.factorArr} />);
        }else{
            pic.push(<SHeightContrastPic key="SHeightContrastPic1" {...this.props}  objData={this.state}/>)
        }
        return (
            <div>
                {/*
                 查询条件表单
                 */}
                <SContrastTopForm {...this.props}
                    d_colorsAction ={this.d_colorsAction}
                    d_colors_defaultAction ={this.d_colors_defaultAction}
                    generate_dom = {this.generate_dom}
                    isLoading={this.state.isLoading}
                />
                <hr style={{margin:"10px 10px 0 10px", borderTop:"1px solid gray",display:"block"}}/>
                {/**
                  伪彩图
                 **/}
                {this.state.factorArr.length ===0? null:pic}
                 </div>
        );
    }

    //调用默认查询之前把查询的条件先传给SContrastPicAll组件，生成dom的回调
    generate_dom = (factorArr) =>{
        this.setState({
            factorArr:factorArr,//用于提前生成dom,id取对比因子的code
        })
    }

    //伪彩图默认请求查询接口_查询实时伪彩图
    d_colors_defaultAction = (queryData)=> {
        var that = this;
        let time =queryData.time_cj_end;
        let time1 = moment(time).format("YYYYMMDD"),
            time2 = moment(time).format("HHmm");
        let name = parseInt(time2/5)*5;
        let firstUrl1 = "monitor/"+queryData.scode+"/"+time1+'/'+name+".png";
        let firstUrl2 = "monitor/"+queryData.scode+"/"+time1+'/'+name+".png";
        let firstTimeArr = this.getDateArrByHour(queryData.time_cj_start,queryData.time_cj_end,300*1000);
        let resultData = [
            {data:{
                imgUrl:firstUrl1,
                factor:queryData.factorCode1,
                fname:queryData.factorName1,
                scode:queryData.scode,
                sname:queryData.sname,
                firstTimeArr:firstTimeArr,
            }},
            {data:{
                imgUrl:firstUrl2,
                factor:queryData.factorCode2,
                fname:queryData.factorName2,
                scode:queryData.scode,
                sname:queryData.sname,
                firstTimeArr:firstTimeArr,
            }},
        ]
        //拿到请求结果,开始设置返回值
        that.setState({
            btnFlag: true,
            resultData: resultData,
            isLoading:false,
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
        if(queryData.contrastMode==="factor"){
            //查询所有高度的,生成伪彩图,时间格式需要转换
            let ts =  new Date(queryData.time_cj_start).Format1("yyyy-MM-dd hh:mm:ss");
            let es =  new Date(queryData.time_cj_end).Format1("yyyy-MM-dd hh:mm:ss");
            queryData.time_cj_start=ts;
            queryData.time_cj_end=es;
            //查询所有高度的,生成伪彩图
            url = '/api/d_pcolors/list'+"?access_token="+access_token+"&username="+username;
            //循环请求因子伪彩图
            let factorArr = [queryData.factorCode1,queryData.factorCode2];
            if(queryData.factorCode1 === queryData.factorCode2){
                message.error("不能选择相同的因子进行对比!");
                return;
            }
            that.setState({
                isLoading:true,
                btnFlag: true,
                factorArr:factorArr,//用于提前生成dom,id取对比因子的code
                resultData:[],
            })
            let axiosArr = [];
            if(factorArr.length>0) {
                for(let i=0;i<factorArr.length;i++){
                    (function(i){
                        let data= factorArr[i];
                        let kk= pubFunc.objectClone(queryData);
                        kk.factor = data
                        axiosArr.push(axios.post(url, kk, config));
                    })(i)
                }
                Promise
                    .all(axiosArr)
                    .then(function (result) {
                        //拿到请求结果,开始设置返回值
                        that.setState({
                            btnFlag: true,
                            resultData: result,
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

        }else {
            let h_start = queryData.h_start;
            let h_end = queryData.h_end;
            let h_index = queryData.h_index;
            if(parseInt((h_end-h_start)/h_index) >10){//包含0，所以一共是11个条线
                message.warn("请增加高度间隔!")
                return
            }
            that.setState({
                heightModelFlag:false,
                queryData:queryData,
                resultData:"",
                isLoading:true
            })
            //查询具体高度的，生成折线图
            url = 'api/line_charts/list' + "?access_token=" + access_token + "&username=" + username;
            axios.post(url, queryData, config)
                .then(function (res) {
                    if (res.data.ret == 1) {
                        let resultData = res.data[queryData.scode][queryData.factor];
                        if(resultData.length === 0){
                            message.warn("获取数据为空!")
                            that.setState({
                                isLoading:false,
                            })
                        }
                        that.setState({
                            btnFlag: false,
                            queryData: queryData,
                            resultData: resultData,
                            isLoading:false,
                        })
                    }else{
                        message.error("获取数据为空!");
                        that.setState({
                            isLoading:false,
                        })
                    }
                })
                .catch(function (err) {
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



export default connect(mapStateToProps)(SContrast);