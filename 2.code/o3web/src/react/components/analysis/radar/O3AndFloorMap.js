/**

 * @Title: 雷达分析页面
 * @Description:  地面站浓度
 * @author jiezd@ahtsoft.com （揭志东）
 * @date 2017年12月12日
 * @version V1.0
 * @Revision : $Rev$
 * @Id: $Id$
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
import React from "react";
// 引入 ECharts 主模块
import echarts from 'echarts'
import  {config} from '../../../../utils/config'
import moment from 'moment';
import { Modal, Button,Tabs } from 'antd';
import LkLine from '../../publicComponents/line/lkLine'

class O3AndFloorMap extends React.Component {

    constructor(props) {
        console.log("constructor");
        super(props);
        this.state = {
            modelShow:false,
            factor:this.props.lktObj.factorCode,
            h_start:config.heightStep,
            h_end:config.maxHeight,
            h_index:config.heightStep,
            scode:this.props.lktObj.monitorCode,
            time_cj:'',
            time:'',
        }
    }

    componentWillReceiveProps(nextProps){
        let myChart = echarts.getInstanceByDom(document.getElementById('O3AndFloorMapData'));
        if(myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('O3AndFloorMapData'));
        myChart.getZr().on('click',params=>{
            const pointInPixel= [params.offsetX, params.offsetY];
            if (myChart.containPixel('grid',pointInPixel)) {
                let xIndex=myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
                /*事件处理代码书写位置*/
                let time = myChart.getOption("xAxisData").xAxis[0].data[xIndex];
                let year = new Date().getFullYear();
                let fullDate = year+" "+time;
                let time_cj =Date.parse(new Date(fullDate));
                this.setState({
                    time_cj:time_cj,
                    time:time,
                    modelShow:true
                })
            }
        });

        if(nextProps.isLoading && !nextProps.fitstQueryData){
            myChart.showLoading({
                text : '数据获取中',
                effect: 'whirling'
            });
            return ;
        }else{
            myChart.hideLoading();
        }
        let O3AndFloorMapData  =O3AndFloorMapOptions();
        O3AndFloorMapData.xAxis.data= nextProps.xAxisData;
        O3AndFloorMapData.yAxis.push({
            nameLocation: 'middle',
            nameGap: 35,
            axisLine: {
                lineStyle: {
                    color: '#015DD5'
                }
            },
            splitLine: {show: false}
        })
        O3AndFloorMapData.series.push({
            name:'近地面浓度',
            type:'line',
            stack: '总量',
            data:nextProps.floorDataArr,
            yAxisIndex: 1,
            z: 3
        })
        O3AndFloorMapData.series.push({
            name:'',
            type:'line',
            stack: '总量',
            data:nextProps.maxArr,
            yAxisIndex: 0,
            z: -63,
            opacity:0
        })
        O3AndFloorMapData.tooltip= {
            trigger: 'axis',
            formatter: function (params) {
                let par1 =params[0],
                    par2 =params[1];
                let index =par1.dataIndex;
                return par1.axisValueLabel +"<br/>近地面浓度: "+par1.data+"<br/>"+"最大浓度值: "+(nextProps.maxValueArr[index] || "0") +"<br/>所在高度: "+ (nextProps.maxHeightArr[index] || "0");
            }
        }

        if(O3AndFloorMapData){
            myChart.setOption(O3AndFloorMapData);
        }

        var st=  myChart.convertToPixel({gridIndex: 0}, [0, 0]); // 返回一个 number
        var et=  myChart.convertToPixel({gridIndex: 0}, [nextProps.xAxisData.length-1,nextProps.xAxisData.length-1]); // 返回一个 number
        let sx=parseInt(st[0]);
        let sy=500-parseInt(st[1]);
        let w=parseInt(et[0]-st[0]);

        //伪彩图图片下载跨域问题
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.tagcrossOrigin = "anonymous";
        img.src = config.wctImgServer + nextProps.imgUrl;

        myChart.setOption({
            graphic: [
                {
                    type: 'image',
                    id: 'logo',
                    left: sx-3,
                    bottom: 60,
                    z: -10,
                    bounding: 'raw',
                    style: {
                        image: img,
                        width: w+6,
                        height: 382,
                        opacity:1
                    }
                }
            ]
        });

        let fcode = this.state.factor;
        let factorColorList = nextProps.factorColorList;
        let  currentFactorColorList =  factorColorList[fcode];
        if(currentFactorColorList.length>0){
            let hkc = [];
            for(let i=0;i<currentFactorColorList.length;i++){
                let fc = currentFactorColorList[i];
                let color = "rgb("+fc[2]+")";
                hkc.push(color);
            }
            myChart.setOption({
                //色块
                visualMap: {
                    min: 0,
                    max: 10000,
                    //realtime: false,
                    orient:'vertical',
                    right: 'right',
                    calculable: false,
                    itemWidth:40,
                    itemHeight:380,
                    top:55,
                    right:-20,
                    inRange: {
                        color: hkc,
                    }
                },
            });
        }

    }

    render(){

        return (
            <div>
                <div id="O3AndFloorMapData" style={{height:"500px",width:"90%",marginLeft:"5%"}}>zha</div>
                {/*
                 弹出框 ---- 三个伪彩图
                 */}
                <Modal
                    title={this.state.time+" 轮廓图"}
                    footer={null}
                    onCancel={() => this.closeModel()}
                    visible={this.state.modelShow}
                    width={850}
                >
                    <div className="card-container">
                        <LkLine {...this.props} lktQueryObj={this.state}/>
                    </div>
                </Modal>
            </div>
        );
    }

    closeModel = ()=>{
        this.setState({
            modelShow:false,
        })
    }
}

export default  O3AndFloorMap;


function O3AndFloorMapOptions(){
    var xData = [];
    var yData = [];
    let minH = config.minHeight,
        maxH =config.maxHeight;

    for(let i=minH;i<maxH/1000;i+=20){
        yData.push(i);
    }

    var option = {
        tooltip: {},
        grid: {
            right: 55,
            left: 60
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        title: {
            text: 'O3浓度图谱与近地面浓度对比'
        },
        xAxis: {
            type: 'category',
            data: xData,

        },
        yAxis: [{
            type: 'category',
            data: yData,
            axisLabel: {
                formatter: '{value} km'
            },
            axisLine: {onZero: true},
            boundaryGap: false,
        }],
        series: []
    };
    return option
}