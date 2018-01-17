/**

 * @Title:LkLine
 * @Description:轮廓图
 * @author chengf@ahtsoft.com （程飞）
 * @date 2017/12/27 16:24
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */

import React from 'react'
import echarts from 'echarts';
import {config} from "../../../../utils/config"
import {message} from 'antd';
import axios from "axios";
const access_token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');

class LkLine extends  React.Component {
    constructor(props) {
        super(props)
        this.state={
        }
    }

    componentDidMount() {
        debugger
        let lktQueryObj = this.props.lktQueryObj;
        //请求接口获取相关数据
        //1：请求轮廓线数据  time_cj  factor    h_start    h_end    h_index     scode
        this.get_dp_colors(lktQueryObj);
    }

    componentWillReceiveProps(nextProps){
        debugger
        if(nextProps.lktQueryObj !==this.props.lktQueryObj){
            let lktQueryObj = nextProps.lktQueryObj;
            //请求接口获取相关数据
            //1：请求轮廓线数据  time_cj  factor    h_start    h_end    h_index     scode
            this.get_dp_colors(lktQueryObj);
        }
    }
    componentWillUpdate(nextProps,nextState){
        debugger
        let factor = nextProps.lktQueryObj.factor;
        let colorsList = this.props.factorColorList[factor];
        let lktObj = nextState.lktObj;
        if(colorsList && lktObj){
            //色域处理
            let pieces = [];
            for(let i=0;i<colorsList.length;i++){
                let fc = colorsList[i];
                let color = "rgb("+fc[2]+")";
                let pp={min: fc[0], max: fc[1], color:color}
                pieces.push(pp);
            }
            //数据处理
            let lktData = lktObj.datas;
            let yAxis_data = [];
            let series_data = [];
            for (let index in lktData) {
                let height = index.substring(2);
                yAxis_data.push(height);
                let value = lktData[index];
                series_data.push(value);
            }

            let myChart = echarts.getInstanceByDom(document.getElementById('lk'));
            if (myChart) {
                myChart.dispose()
            }
            myChart = echarts.init(document.getElementById('lk'))
            let options = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "高度与浓度 : <br/>{b}m : {c}"
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        filterMode: 'empty'
                    },
                    {
                        type: 'inside',
                        yAxisIndex: 0,
                        filterMode: 'empty'
                    }
                ],
                xAxis: {
                    type: 'value',
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'category',
                    axisLine: {onZero: false},
                    axisLabel: {
                        formatter: '{value} m',
                        //interval:200
                    },
                    boundaryGap: false,
                    //高度
                    data: yAxis_data,
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    //色域赋值
                    pieces:pieces,
                },
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        //浓度
                        data: series_data,
                    }
                ]
            }
            //设置options
            myChart.setOption(options)
        }
    }
    render() {
        return (
            <div id="lk" style={{display: "inline-block",width: "90%",height: "600px",marginLeft:"6%",top:"10px"}}></div>
        );
    }

    //获取轮廓线数据
    get_dp_colors = (values) => {
        let that = this;
        let url = '/api/d_pcolors/line?access_token=' + access_token + "&username=" + username;
        axios.post(url, values, config)
            .then(function (res) {
                if (res.data.ret == 1) {
                    that.setState({
                        lktObj:res.data,
                    })
                } else {
                    message.error(res.data.msg);
                }
            })
            .catch(function (err) {
                message.error("报错了，刷新试试");
                console.log(err);
            })
    }


}

export  default LkLine
