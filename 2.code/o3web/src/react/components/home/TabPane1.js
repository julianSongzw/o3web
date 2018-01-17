/**
 * Created by zdjie on 2017/10/17.
 * modify by weijq on 2017/12/26
 */
import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts'
import { message } from 'antd';
import axios from 'axios';
import { config } from '../../../utils/config';
import moment from "moment";
import O3AndFloorMap from "./O3AndFloorMap";

class WebDevice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeSectionValue: {},
            heightInterval: config.heightStep, //高度间隔
            mapType: 'category', //展示哪种图  默认对比图
            xAxisData: [],//这是时间段选择器后，返回的时间间隔，
            floorDataArr: [], //折线图数据
            flag: 0,
            isLoading: false,//伪彩图是不是在加载中
            imgUrl: '',//伪彩图路径
            maxArr: [], // 伪彩图最大值对应的高度,
            maxValueArr: [],
            maxHeightArr: [],
            O3AndWeatherData: [], // 气象图数据
            fitstQueryData: false, //是不是第一次请求数据 用来获取第一个伪彩图
            mgtUrl: '',//玫瑰图的url
        }
    }


    componentDidMount() {
        this.setImgByTime();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisiableFlag) {
            this.setImgByTime();
        }

    }

    setImgByTime = () => {

        let monitorCode = this.props.selectWebDeviceInfo.site_info.code;
        let time = new Date();
        let time1 = moment(time).format("YYYYMMDD"),
            time2 = moment(time).format("HHmm");
        let name = parseInt(time2 / 5) * 5;
        let imgUrl = "monitor/" + monitorCode + "/" + time1 + '/' + name + ".png"
        console.log(imgUrl);
        let startTime = moment().subtract(1, "day").format('X'),
            endTime = moment().format('X');
        //回调父组件
        let xAxisData = this.getDateArrByHour(startTime, endTime);
        this.getTimeSection({ xAxisData: xAxisData, time: [startTime * 1000, endTime * 1000] });
        this.setState({
            xAxisData: this.state.xAxisData,
            floorDataArr: this.state.floorDataArr,
            imgUrl: imgUrl
        });

    }

    getTimeSection = (value) => {
        this.state.timeSectionValue = value;
        this.state.xAxisData = value.xAxisData;
    }

    //按照小时获取时间段中所有的值
    getDateArrByHour = (startTime, endTime) => {
        let arr=[];
        let splitTime = 300; //默认5min
        startTime=parseInt(startTime/splitTime)*splitTime +splitTime;
        endTime=parseInt(endTime/splitTime)*splitTime+splitTime;
        if(true){
            for(let i=startTime;i<endTime;i=i+splitTime){
                let date=moment(i*1000).format("MM-DD"),
                    time=moment(i*1000).format("HH:mm");
                arr.push(date+'\n'+time);
            }
        }else{
            for(let i=startTime;i<endTime;i=i+splitTime){
                arr.push( moment(i*1000).format("MM-DD"))
            }
        }
        return arr;
    }
    render() {
        return (
            <div >
                {/*
                     O3浓度图谱与地面站浓度对比
                     */}
                <O3AndFloorMap {...this.props} xAxisData={this.state.xAxisData} floorDataArr={this.state.floorDataArr}
                    maxArr={this.state.maxArr} maxValueArr={this.state.maxValueArr}
                    maxHeightArr={this.state.maxHeightArr} fitstQueryData={this.state.fitstQueryData}
                    isLoading={this.state.isLoading} imgUrl={this.state.imgUrl} />
            </div>
        )
    }

}


export default WebDevice