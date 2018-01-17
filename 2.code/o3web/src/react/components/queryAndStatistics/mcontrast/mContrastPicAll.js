/**

 * @Title:MContrastPicAll.js
 * @Description: 多点对比伪彩图
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
// 引入 ECharts 主模块
import echarts from 'echarts'
import { config } from "../../../../utils/config"
import LkLine from '../../../../react/components/publicComponents/line/lkLine';
import { Modal } from 'antd';

class MContrastPicAll extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //轮廓线
            modelShow: false,
            h_start: config.heightStep,
            h_end: config.maxHeight,
            h_index: config.heightStep,
            time_cj: '',
            time: '',
        }
    }

    componentDidMount() {
        //看数据是否需要重新渲染
        let resultDataArr = this.props.wctResult;
        debugger
        if (resultDataArr.length > 0) {
            for (let i = 0; i < resultDataArr.length; i++) {
                //获取每个返回结果
                let res = resultDataArr[i];
                //初始化echarts,domid取对比因子的code
                let id = res.data.scode;
                let myChart = echarts.getInstanceByDom(document.getElementById(id));
                if (myChart) {
                    myChart.dispose();
                }
                myChart = echarts.init(document.getElementById(id));

                //事件
                myChart.getZr().on('click', params => {
                    const pointInPixel = [params.offsetX, params.offsetY];
                    if (myChart.containPixel('grid', pointInPixel)) {
                        let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
                        /*事件处理代码书写位置*/
                        debugger
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

                let imgUrl = res.data.imgUrl;
                let extremum = res.data.extremum;
                let maxArr = []; //最大值所在高度数组只要第一个
                let maxValueArr = [];//最大值数组，
                let maxHeightArr = []; //最大值所在高度数组
                let xData = extremum;
                //最大高度 米转成KM，然后每0.5KM取一次
                let yData = [];
                let h_end = config.maxHeight;
                for (let i = 0; i < h_end / 1000; i += 20) {
                    yData.push(i);
                }
                let option = {
                    color: ['#8EC9EB'],
                    legend: {
                        data: [res.data.sname + res.data.fname + '浓度伪彩图', res.data.scode, res.data.factor]
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
                            name: [res.data.sname + res.data.fname + '浓度伪彩图'],
                            type: 'line',
                            stack: '总量',
                            data: maxArr,
                            yAxisIndex: 0,
                            z: -63,
                            opacity: 0
                        }
                    ],
                }
                myChart.setOption(option);

                //色域处理
                let fcode = res.data.factor;
                let factorColorList = this.props.factorColorList;
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
                            itemHeight: 200,
                            top: 55,
                            inRange: {
                                color: hkc,
                            }
                        },
                    });
                }

                setTimeout(function () {
                    myChart.hideLoading();
                    var st = myChart.convertToPixel({ gridIndex: 0 }, [0, 0]); // 返回一个 number
                    var et = myChart.convertToPixel({ gridIndex: 0 }, [option.xAxis.data.length - 1, option.yAxis.data.length - 1]); // 返回一个 number
                    let sx = parseInt(st[0]);
                    let sy = 300 - parseInt(st[1]);
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

    componentWillReceiveProps(nextProps) {

        //看数据是否需要重新渲染
        let resultDataArr = nextProps.wctResult;
        debugger
        if (resultDataArr.length > 0) {
            for (let i = 0; i < resultDataArr.length; i++) {
                //获取每个返回结果
                let res = resultDataArr[i];
                //初始化echarts,domid取对比因子的code
                let id = res.data.scode;
                let myChart = echarts.getInstanceByDom(document.getElementById(id));
                if (myChart) {
                    myChart.dispose();
                }
                myChart = echarts.init(document.getElementById(id));

                //事件
                myChart.getZr().on('click', params => {
                    const pointInPixel = [params.offsetX, params.offsetY];
                    if (myChart.containPixel('grid', pointInPixel)) {
                        let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
                        /*事件处理代码书写位置*/
                        debugger
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

                let imgUrl = res.data.imgUrl;
                let extremum = res.data.extremum;
                let maxArr = []; //最大值所在高度数组只要第一个
                let maxValueArr = [];//最大值数组，
                let maxHeightArr = []; //最大值所在高度数组
                let timeArr = [];//时间数组
                for (let index in extremum) {
                    let data = extremum[index];
                    if (data.max !== undefined) {
                        let height = parseInt(data.max.height === undefined ? 0 : data.max.height) / 1000 || "0";
                        let maxValue = data.max.value === undefined ? 0 : data.max.value || 0;
                        maxArr.push(height);
                        maxHeightArr.push(data.max.height === undefined ? 0 : data.max.height || "0");
                        maxValueArr.push(maxValue);
                    }
                    timeArr.push(index);
                }
                let xData = this.returnDate(timeArr);
                //最大高度 米转成KM，然后每0.5KM取一次
                let yData = [];
                let h_end = config.maxHeight;
                for (let i = 0; i < h_end / 1000; i += 20) {
                    yData.push(i);
                }
                let option = {
                    color: ['#8EC9EB'],
                    legend: {
                        data: [res.data.sname + res.data.fname + '浓度伪彩图', res.data.scode, res.data.factor]
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
                            name: [res.data.sname + res.data.fname + '浓度伪彩图'],
                            type: 'line',
                            stack: '总量',
                            data: maxArr,
                            yAxisIndex: 0,
                            z: -63,
                            opacity: 0
                        }
                    ],
                }
                myChart.setOption(option);

                //色域处理
                let fcode = res.data.factor;
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
                            itemHeight: 200,
                            top: 55,
                            inRange: {
                                color: hkc,
                            }
                        },
                    });
                }

                setTimeout(function () {
                    myChart.hideLoading();
                    var st = myChart.convertToPixel({ gridIndex: 0 }, [0, 0]); // 返回一个 number
                    var et = myChart.convertToPixel({ gridIndex: 0 }, [option.xAxis.data.length - 1, option.yAxis.data.length - 1]); // 返回一个 number
                    let sx = parseInt(st[0]);
                    let sy = 300 - parseInt(st[1]);
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

    closeModel = () => {
        this.setState({
            modelShow: false,
        })
    }

    render() {
        debugger
        //根据数据生成dom,id取对比因子的code
        let divArr = [];
        let scodeArr = this.props.scodeArr;
        if (scodeArr.length > 0) {
            for (let i = 0; i < scodeArr.length; i++) {
                let id = scodeArr[i].key;
                divArr.push(
                    <div id={id} style={{ display: "inline-block", width: "90%", height: "300px", marginLeft: "6%", top: "40px" }}></div>
                )
            }
        }
        return (
            <div>
                {divArr}
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
export default MContrastPicAll;

