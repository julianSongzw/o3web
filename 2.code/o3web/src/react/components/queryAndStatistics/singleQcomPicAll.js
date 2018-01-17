/*
 * @Title:单点所有高度伪彩图
 * @Description:单点所有高度伪彩图
 * @Author: chengf@cychina.cn
 * @Date: 2017-11-27 09:19:20
 * @Version:V1.0
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017'
 */
import React from "react";
import styles from "./contrast.css";
// 引入 ECharts 主模块
import echarts from 'echarts';
import moment from 'moment';
import { Modal, message } from 'antd';
import { config } from "../../../utils/config"
import LkLine from '../../../react/components/publicComponents/line/lkLine'

class SingleQcomPicAll extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            factorColorList: props.factorColorList,
            //轮廓线
            modelShow: false,
            h_start: config.heightStep,
            h_end: config.maxHeight,
            h_index: config.heightStep,
            time_cj: '',
            time: '',
        }
    }

    /**
     * 默认不进行查询
     */
    componentDidMount() {
        //初始化echarts
        let myChart = echarts.getInstanceByDom(document.getElementById('low'));
        if (myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('low'));
        if (this.props.objData.isLoading) {
            myChart.showLoading({
                text: '数据获取中',
                effect: 'whirling'
            });
            //return ;
        } else {
            myChart.hideLoading();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.objData !== this.props.objData) {
            //初始化echarts
            let myChart = echarts.getInstanceByDom(document.getElementById('low'));
            if (myChart) {
                myChart.dispose();
            }
            myChart = echarts.init(document.getElementById('low'));
            //事件
            myChart.getZr().on('click', params => {
                const pointInPixel = [params.offsetX, params.offsetY];
                if (myChart.containPixel('grid', pointInPixel)) {
                    let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
                    /*事件处理代码书写位置*/
                    let t1 = myChart.getOption("xAxisData").xAxis[0].data[xIndex];
                    let scode = myChart.getOption("legend").legend[0].data[1];
                    let factor = myChart.getOption("legend").legend[0].data[2];
                    let year = new Date().getFullYear();
                    let fullDate = year + " " + t1;
                    let time_cj = Date.parse(new Date(fullDate));
                    this.setState({
                        time_cj: time_cj,
                        time: t1,
                        modelShow: true,
                        scode: scode,
                        factor: factor,
                    })
                }
            });

            if (nextProps.objData.isLoading) {
                myChart.showLoading({
                    text: '数据获取中',
                    effect: 'whirling'
                });
                //return ;
            } else {
                myChart.hideLoading();
            }
            let imgUrl = nextProps.objData.imgUrl;
            let maxArr = nextProps.objData.maxArr;
            let maxValueArr = nextProps.objData.maxValueArr;
            let maxHeightArr = nextProps.objData.maxHeightArr;
            let timeArr = nextProps.objData.timeArr;
            //最大高度 米转成KM，然后每2KM取一次
            let h_end = config.maxHeight;
            let yData = [];
            for (let i = 0; i < h_end / 1000; i += 20) {
                yData.push(i);
            }
            let xData = timeArr.length === 0 ? nextProps.objData.firstTimeArr : this.returnDate(timeArr);
            let option = {
                color: ['#8EC9EB'],
                legend: {
                    data: [nextProps.objData.sname + nextProps.objData.fname + '浓度伪彩图', nextProps.objData.scode, nextProps.objData.fcode]
                },
                toolbox: {
                    show: true,//显示右上角的功能图标
                    feature: {
                        mark: { show: true },
                        saveAsImage: { show: true, title: "导出", },
                        //restore: {show: true}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisTick: {
                        alignWithLabel: true
                    },
                },
                yAxis: {
                    type: 'category',
                    axisLine: { onZero: true },
                    axisLabel: {
                        formatter: '{value} km'
                    },
                    boundaryGap: false,
                    data: yData
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        let par1 = params[0],
                            par2 = params[1];
                        let index = par1.dataIndex;
                        return par1.axisValueLabel + "<br/>" + "最大浓度值: " + maxValueArr[index] + "<br/>所在高度: " + maxHeightArr[index];
                    }
                },
                series: [
                    {
                        name: [nextProps.objData.sname + nextProps.objData.fname + '浓度伪彩图'],
                        type: 'line',
                        stack: '总量',
                        data: maxArr,
                        yAxisIndex: 0,
                        z: -11,
                        opacity: 0
                    }
                ],
            }
            //if(option){
            myChart.setOption(option);
            //}
            //色域处理
            let fcode = nextProps.objData.fcode;
            let factorColorList = nextProps.factorColorList;
            let currentFactorColorList = factorColorList[fcode];
            if (currentFactorColorList.length > 0) {
                let hkc = [];
                for (let i = 0; i < currentFactorColorList.length; i++) {
                    let fc = currentFactorColorList[i];
                    let color = "rgb(" + fc[2] + ")";
                    hkc.push(color);
                }
                myChart.setOption({
                    //色块
                    visualMap: {
                        min: 0,
                        max: 10000,
                        //realtime: false,
                        orient: 'vertical',
                        right: 'right',
                        calculable: false,
                        itemWidth: 40,
                        itemHeight: 395,
                        top: 55,
                        inRange: {
                            color: hkc,
                        }
                    },
                });
            }
            if (!nextProps.objData.isLoading) {
                setTimeout(function () {
                    myChart.hideLoading();
                    var st = myChart.convertToPixel({ gridIndex: 0 }, [0, 0]); // 返回一个 number
                    var et = myChart.convertToPixel({ gridIndex: 0 }, [option.xAxis.data.length - 1, option.yAxis.data.length - 1]); // 返回一个 number
                    let sx = parseInt(st[0]);
                    let sy = 500 - parseInt(st[1]);
                    let w = parseInt(et[0] - st[0]);
                    let h = parseInt(st[1] - et[1]);
                    //伪彩图图片下载跨域问题
                    let img = new Image();
                    img.crossOrigin = "anonymous";
                    img.tagcrossOrigin = "anonymous";
                    img.src = config.wctImgServer + imgUrl;
                    myChart.setOption({
                        graphic: [
                            {
                                type: 'image',
                                id: 'logo',
                                left: sx,
                                bottom: sy,
                                z: -10,
                                bounding: 'raw',
                                style: {
                                    image: img,
                                    width: w,
                                    height: h,
                                    opacity: 1
                                }
                            }
                        ]

                    });
                }, 1000);
            }
        }
    }

    //转换时间格式
    returnDate = (timeArr) => {
        let returnData = [];
        for (let i = 0; i < timeArr.length; i++) {
            let v = timeArr[i];
            var unixTimestamp = new Date(parseInt(v));
            let dateStr = this.fz(unixTimestamp.getMonth() + 1) + "-" + this.fz(unixTimestamp.getDate())
                + "\n" + this.fz(unixTimestamp.getHours()) + ":" + this.fz(unixTimestamp.getMinutes());
            returnData.push(dateStr);
        }
        return returnData;
    }
    // 给月和天，不足两位的前面补0
    fz = (num) => {
        if (num < 10) {
            num = "0" + num;
        }
        return num
    }

    //按照小时获取时间段中所有的值
    //getDateArrByHour = (startTime,endTime,timeStep)=>{
    //    //传给后台的时间因为转换成了字符串，这里需要重新转回到时间戳
    //    let arr=[];
    //    startTime=parseInt(Date.parse(new Date(startTime)));
    //    endTime=parseInt(Date.parse(new Date(endTime)));
    //    timeStep = parseInt(timeStep);
    //    for(let i=startTime;i<endTime;i+=timeStep){
    //        //arr.push( moment(i).format('MM-DD HH:mm'))
    //        let date =  moment(i).format('MM-DD');
    //        let time =  moment(i).format('HH:mm')
    //        let add = date+"\n"+time;
    //        arr.push( add)
    //    }
    //    return arr;
    //}
    closeModel = () => {
        this.setState({
            modelShow: false,
        })
    }

    render() {
        return (
            <div id="low" style={{ display: "inline-block", width: "90%", height: "500px", marginLeft: "6%", top: "40px" }}>
                <Modal
                    title={this.state.time + "轮廓图"}
                    footer={null}
                    onCancel={() => this.closeModel()}
                    visible={this.state.modelShow}
                    width={850}
                >
                    <div className="card-container">
                        <LkLine {...this.props} lktQueryObj={this.state} />
                    </div>
                </Modal>
            </div>
        );
    }
}
export default SingleQcomPicAll;

