/**

 * @Title:roaseMap.js
 * @Description:  玫瑰图
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
import  RoseMapCss from "../../../../react/pages/analysis/radar/radar.css"

const  radius =216; //玫瑰图半径
const  defaultWidth = 300 ; //传给我的图片的高度和宽度都是300
let barDis = 0,
    barDis2=0;
let display= 'none'
class RoseMap extends React.Component {


    componentWillReceiveProps(nextProps){
        if(this.props.mgtUrl == nextProps.mgtUrl){return}  //为了防止伪彩图更新时 又刷新了一下这个图
        let myChart = echarts.getInstanceByDom(document.getElementById('RoseMap'));
        if(myChart) {
            myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('RoseMap'));
        let RoseMapData  = getOption();
        myChart.setOption(RoseMapData);

        let imgUrl =config.mgtImgServer + nextProps.mgtUrl;
        let div = document.querySelector("#RoseMap>div");
        let clientHeight = div.clientHeight;
        let clientWidth = div.clientWidth;

        let width = radius*2;
        let height = radius*2;
        let bottom =clientHeight-(radius*2); //500是div的高度
        let left = (clientWidth/2)-radius;

        if(nextProps.mgtUrl){
            myChart.setOption({
                graphic: [
                    {
                        type: 'image',
                        id: 'logo',
                        left: left,
                        bottom: bottom/2,
                        z: 10,
                        bounding: 'raw',
                        style: {
                            image:  imgUrl,
                            width: width,
                            height: height,
                            opacity:0.9
                        }
                    }
                ]

            });
        }
        debugger;
        let fcode = this.props.factorCode;
        let factorColorList = nextProps.factorColorList;
        let  currentFactorColorList =  factorColorList[fcode];
        barDis = (clientWidth-radius*2)/2-60;
        barDis2 = barDis +clientWidth*0.05;
        if(currentFactorColorList.length>0){
            display="block";
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
                    itemWidth:26,
                    itemHeight:radius*2,
                    top:23,
                    right:barDis,
                    inRange: {
                        color: hkc,
                    }
                },
            });
        }
    }



    componentDidMount(){
        var myChart = echarts.init(document.getElementById('RoseMap'));
        let RoseMapData  = getOption();
        myChart.setOption(RoseMapData);
    }



    render(){
        let maxLevel =12;
        let arr =[];
        for(let i =maxLevel;i>0;i=i-2){
            arr.push( <p><span></span><n>{i}</n></p>);
        }
        arr.push( <p><span></span><n>0</n></p>);
        for(let i =1;i<maxLevel;i=i+2){
            arr.push( <p><span></span><n>{i+1}</n></p>);
        }
        return (
            <div style={{position:"relative"}}>
                <div className={RoseMapCss.heightL} style={{left:barDis2+"px",display:display}}></div>
                <div className={RoseMapCss.heightBar} style={{left:barDis2+"px",display:display}}>
                    {arr}
                </div>
                <div id="RoseMap" style={{height:"500px",width:"90%",marginLeft:"5%"}}>正在查询...</div>
            </div>
        );
    }
}

export default  RoseMap;

function getOption(){
    let h=6;
    let maxLevel=12;
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '臭氧玫瑰图'
        },
        tooltip: {trigger: 'axis'},
        legend: {
        },
        radar: [
            {
                shape:'circle',
                splitNumber:12,
                axisLine:{
                    lineStyle:{
                        type:'dotted'
                    }
                },
                splitLine: {
                    lineStyle: {
                        type:'dotted',
                        color: ['#ccc']
                    }
                },
                splitArea:{
                    show:false
                },
                indicator: [
                    {text: 'N', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'NW', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'W', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'SW', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'S', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'SE', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'E', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: 'NE', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel},
                    {text: '', max: maxLevel}
                ],
                center: ['50%','50%'],
                radius: radius,
                triggerEvent:true
            }
        ],
        series: [{
            type: 'radar',
            data:[
                {
                    value: [h,h,h,h,4,h,h,h,h,h,h,h,3,h,h,h,h,h,3,h,h,h,h,h,2,h,h,h,h,h,h,5],
                    symbolSize:0,
                    label:{
                        normal: {
                            show:false
                        },
                    },
                    lineStyle: {
                        normal: {
                            width:0,
                        },
                    }

                }
            ]
        }]
    };
    return option;
}