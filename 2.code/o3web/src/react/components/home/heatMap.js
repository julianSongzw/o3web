/**

 * @Title: homeMap.js
 * @Description:  首页
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
import { Popover, Button } from 'antd';
import styles from './homeMap.css';
import {config} from '../../../utils/config'
import axios from 'axios'
import moment from 'moment'
import {message} from 'antd'
import webDeviceIcon from '../../../public/images/webDevice.png'
import nowebDeviceIcon from '../../../public/images/nowebDevice.png'
import nationalCtlPointIcon from '../../../public/images/nationalCtlPoint.png'
import nonationalCtlPointIcon from '../../../public/images/nonationalCtlPoint.png'

let map,
    myCanvas,
    ctx,
    canvas;
let windData=[];
let windCanvas, windy; //fengchuangtu
let infoWindow;//鼠标移动时候显示的弹出框
const factorCode ="o3"; //弹出框显示什么因子浓度
let  factorValueList ={};
let postingFactor =false; //记录下是不是在请求每个站点的浓度值

class HomeMap extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            colorList:this.props.factorColorList[factorCode],
        }

    }
    componentWillReceiveProps(nextProps) {
        debugger;
        let _self = this;//this.props.time_cj  !==  nextProps.time_cj  ||
        if(( getLength(factorValueList) == 0) && !postingFactor && nextProps.nationalCtlPointInfos.length>0 && nextProps.webDeviceInfos.length>0){
            postingFactor =true;
            let access_token = localStorage.getItem('access_token');
            let username = localStorage.getItem('username');
            let time_cj = moment().startOf("hour").format("X")-1*60*60;
            axios.post('/api/b_sites/fvalue' + '?access_token=' + access_token + '&username=' + username,{time_cj:time_cj*1000,factor:factorCode},config)
            .then(function (res) {
                debugger;
                if (res.data.ret == 0) {
                    message.error(res.data.msg);
                }else{
                    factorValueList = res.data.datas;
                }
                _self.showmapPoint(nextProps);
                postingFactor=false;
            })
            .catch(function (err) {
                message.error('network error!');
                /*factorValueList ={
                    bjjcz:{
                        o3:1000
                    },
                    '1279A':{
                        o3:200
                    },

                }*/
                _self.showmapPoint(nextProps);
                postingFactor=false;
            })
        }else{
            _self.showmapPoint(nextProps);
        }
        
    }
    componentWillUpdate(nextProps, nextState) {
        //地图定位到中心店
        this.setCenter(nextProps);
        //nextProps.satellite.show(); //显示卫星图
        nextProps.heatmap.show();
        nextProps.heatmap.setDataSet({ data: nextProps.heatmapPoints }); // 热力图
    }


    componentDidMount() {
        infoWindow = document.createElement("div");
        infoWindow.id='infoWindow';
        infoWindow.class= 'inforWindow';
        document.body.appendChild(infoWindow);
        map = new window.AMap.Map('container', {
            zooms: [8, 14],
            center: [117.152262, 31.856611],
            resizeEnable: true,
            rotateEnable: true,
            pitchEnable: true,
            zoom:12,
           //开启3D视图,默认为关闭
            buildingAnimation: true,//楼块出现是否带动画
            expandZoomRange: true,
            features:["bg"]
        });
        map.setMapStyle('amap://styles/light');
        
        map.plugin(["AMap.ToolBar"], function () {
            let ToolBar = new window.AMap.ToolBar({
                position: {
                    left: '-70px',
                    top: '10px'
                }
            });
            map.addControl(ToolBar);
        });

        //添加卫星图
        let satellite ='';
        /*let satellite = new window.AMap.TileLayer.Satellite({
            map: map,
            zIndex: 10
        });*/
        //添加风场图
        let _self = this;
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        let time_cj = moment().startOf("hour").format("X")-1*60*60;
        axios.post('/api/d_weathers/windMap' + '?access_token=' + access_token + '&username=' + username,{time_cj:time_cj*1000},config)
        .then(function (res) {
            if (res.data.ret == 0) {
                message.error(res.data.msg);
            }else{
                windData = res.data.datas;
                for(var i=0 ,le =windData.length;i<le;i++){
                    windData[i][2] =Math.ceil(Math.random()*90) == 0 ? 15: Math.ceil(Math.random()*90);
                    windData[i][3] =Math.ceil(Math.random()*9) == 0 ? 2: Math.ceil(Math.random()*9);
                }
                addWindMap(map);
            }
        })
        .catch(function (err) {
            message.error('风场图数据请求失败!');
        })

        let heatmap;
        map.plugin(["AMap.Heatmap"], function () {
            //初始化heatmap对象
            heatmap = new window.AMap.Heatmap(map);
            //回调父页面 将map对象和卫星图传递出去
            _self.props.MapDidMount()(map, satellite, heatmap);
        });
    }

    render() {
        return (
                <div className={styles.right} id="container" >

                </div>

        )
    }


    //定位到地图的中心点
    setCenter = (nextProps) => {
        let lnglat=['',''];
        if (nextProps.webDeviceInfo) {
            lnglat = [nextProps.webDeviceInfo.longitude, nextProps.webDeviceInfo.latitude];
        } else if (nextProps.nationalCtlPointInfo) {
            lnglat = [nextProps.nationalCtlPointInfo.longitude, nextProps.nationalCtlPointInfo.latitude];
        }
        if(lnglat[0] && lnglat[1]){
            nextProps.map?nextProps.map.setCenter(lnglat):null;
        }
    }

    //根据code查找出浓度值
    getValueByCode = (code)=>{
        for(let key in factorValueList){
            if(key  == code){
                return factorValueList[key][factorCode]
            }
        }
        return '';
    }

    //根据浓度值获取颜色
    getColorByValue =(value)=>{
        value  = value ? value :2;
        let colorList  = this.state.colorList;
        for(let i =0, le= colorList.length;i<le;i++){
            let color =colorList[i];
            if(value<color[1] && value>color[0]){
                return color[2];
            }
        }
        return '255,0,0';
    }

    //showPoint
    showmapPoint = (nextProps)=>{
        debugger;
        //添加点的
        let nationalCtlPointInfos = nextProps.nationalCtlPointInfos || [],
            webDeviceInfos = nextProps.webDeviceInfos || [];
        let clickWebDevice = nextProps.clickWebDevice,
            clickNationalCtlPoint = nextProps.clickNationalCtlPoint;
        let _self=this;
        nationalCtlPointInfos.map(function (item, index) {
            if(item.longitude && item.latitude){
                debugger;
                let value = _self.getValueByCode(item.code) ; //根据code找浓度值
                let color  = "rgb("+_self.getColorByValue(value)+")";
                let newColor = "radial-gradient(circle, #fff, "+color+", #e86a43);-webkit-radial-gradient(circle, #fff, "+color+", #e86a43);-moz-radial-gradient(circle, #fff, "+color+", #e86a43);";
                let width = item.name.length*15+"px";
                let left=-(item.name.length*15-20)/2 +"px";
                let content = `<div class=${styles.circle} style='background: ${newColor}'></div>
                <div class=${styles.labelName} style="width:${width};margin-left:${left}">${item.name}</div>
                `;
                new window.AMap.Marker({
                    map: map,
                    index: index,
                    content: content,
                    position: [item.longitude, item.latitude],
                }).on("click", (e) => {
                    clickNationalCtlPoint(e)(e.target.F.index);
                }).on("mouseover",(e)=>{
                    debugger;
                    let kk = map.lngLatToContainer(new window.AMap.LngLat(item.longitude, item.latitude))
                    let x= kk.x+477+10;
                    let y =kk.y +80;
                    let code = item.code;
                    openInfo(x,y,value);
                }).on("mouseout",(e)=>{
                    openInfo(-1000,-1000);
                })
            }
        });
        webDeviceInfos.map(function (item, index) {
            if(item.longitude && item.latitude){
                let value = _self.getValueByCode(item.site_info.code) ; //根据code找浓度值
                let color  = "rgb("+_self.getColorByValue(value)+")";
                //let newColor = "-webkit-radial-gradient(circle, #fff, "+color+", #e86a43);";
                let width = item.name.length*15+"px";
                let left=-(item.name.length*15-20)/2 +"px";
                let content = `<div class=${styles.square} style='background: ${color}'></div>
                <div class=${styles.labelName} style="width:${width};margin-left:${left}">${item.site_info.name}</div>
                `;
                new window.AMap.Marker({
                    map: map,
                    index: index,
                    content: content,
                    position: [item.longitude, item.latitude],
                }).on("click", (e) => {
                    clickWebDevice(e)(e.target.F.index);
                }).on("mouseover",(e)=>{
                    debugger;
                    let kk = map.lngLatToContainer(new window.AMap.LngLat(item.longitude, item.latitude))
                    let x= kk.x+477+10;
                    let y =kk.y +80;
                    let code = item.site_info.code;
                    openInfo(x,y,value);
                }).on("mouseout",(e)=>{
                    openInfo(-1000,-1000);
                })
            }
        })

    }


}

//鼠标移入的时候提示框
function openInfo(x,y,text) {
    //构建信息窗体中显示的内容
    infoWindow.style='left:'+x+'px;top:'+y+'px;position:absolute';
    let html= '当前站点O3浓度值:<span style="color:red">'+text+'</span>';
    infoWindow.innerHTML =html;
}



//绘制风长途
function addWindMap(map){

    windCanvas = document.createElement('canvas');
    windCanvas.id = "windCanvas";
    windCanvas.width = map.getSize().width;
    windCanvas.height = map.getSize().height;
    windCanvas.style.position = 'absolute';
    windCanvas.style.top = 0;
    windCanvas.style.left = 0;
    windy = new window.Windy({
        canvas: windCanvas
    });
    let options = {
        size: .8,
        color: 'rgba(6,90,236,0.8)',
    };
    windy.change(options);
    let cavasLayer = new  window.AMap.CustomLayer(windCanvas, {
        zooms: [3, 20],
        zIndex: 1999,
        opacity:0.7
    });
    cavasLayer.setMap(map);
    cavasLayer.render = onRender;
    function onRender() {
        console.log(1111);
        //drawBackground();
        windDraw();
    }
//        map.getView().on('propertychange',function(){
//            windy.stop();
//            $(canvas).hide();
//        });
//        map.on("moveend",function(){
//            windDraw();
//        });
}

function drawBackground() {
    let ctx = canvas.getContext("2d");
    let r=100;
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    ctx.save();
    ctx.translate(r, r);//重新定义圆点到中心
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.fillStyle = "#00AEE8";
    ctx.strokeStyle = "#fff";
    ctx.arc(0, 0, r, 0, Math.PI * 2, false);//圆点坐标，起始角0，结束角2π，顺时针
    ctx.stroke();
    ctx.fill();
}
function windDraw(){
    let bounds = map.getBounds();
    let _min = [bounds.southwest.lng, bounds.southwest.lat];
    let _max = [bounds.northeast.lng, bounds.northeast.lat];
    let py0 = map.lngLatToContainer(new window.AMap.LngLat(
        bounds.southwest.lng,  bounds.northeast.lat)
    ); //经纬度转成屏幕坐标
    let py=[ Math.ceil(py0.x), Math.ceil(py0.y)];
    windCanvas.style.left = py[0]+ 'px';
    windCanvas.style.top = py[1]+ 'px';
    let points = invertLatLon(py); //所有站点经纬度转为canvas坐标
    let min =  map.lngLatToContainer(new window.AMap.LngLat(
        _min[0],_min[1])
    );
    let max =map.lngLatToContainer(new window.AMap.LngLat(
        _max[0], _max[1])
    );
    let extent = [
        [ Math.ceil(min.x) - py[0],  Math.ceil(max.y) - py[1]],
        [ Math.ceil(max.x) - py[0],  Math.ceil(min.y) - py[1]]
    ];
    windy.start(extent, points);
}

function invertLatLon (py) {
    let points = [];
    windData.forEach(function (station) {
        let px = map.lngLatToContainer(new window.AMap.LngLat(
            station[0],  station[1])
        );
        points.push({
            x:  Math.ceil(px.x)-py[0],
            y:  Math.ceil(px.y)-py[1],
            angle: parseInt(station[2]),
            speed: parseInt(station[3])
        });
    });
    return points;
}

//获取对象的key （原型）
function getLength(obj){

    let  count = 0;
    for(let  i in obj){
        count++;
    }
    return count;
}



export default HomeMap;