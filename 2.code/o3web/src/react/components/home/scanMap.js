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
import styles from './homeMap.css';
import { config } from '../../../utils/config';
import moment from 'moment';
import axios from 'axios';
import { message } from 'antd';

import webDeviceIcon from '../../../public/images/webDevice.png'
import nowebDeviceIcon from '../../../public/images/nowebDevice.png'
import nationalCtlPointIcon from '../../../public/images/nationalCtlPoint.png'
import nonationalCtlPointIcon from '../../../public/images/nonationalCtlPoint.png'

let map,
    myCanvas,
    ctx,
    canvas;
let conMapRotateX = 0,
    conMapRotateY = 0;   //锥形图旋转的角度


class HomeMap extends React.Component {
    constructor(props) {
        console.log("constructor");
        super(props);
        this.state = {
            iconWidth: 800,
            iconHeight: 800
        }
        this.cus;
        this.imgLayer;

    }

    componentWillReceiveProps(nextProps, nextState) {
        // debugger;
        conMapRotateX = nextProps.conMapRotateX;
        conMapRotateY = nextProps.conMapRotateY;
        // this.cus.setMap();
        this.addLayer(nextProps);
        //把列表的点添加进入
        // this.addPoint(nextProps);
        // debugger;
    }
    componentWillUpdate(nextProps, nextState) {
        // this.addConeLayer(nextProps, nextState);
        console.log("componentWillReceiveProps");
        //地图定位到中心店

        this.setCenter(nextProps);
        if (nextProps.coneMap) {
            nextProps.coneMap.show(); //显示锥形图
            // nextProps.sectorMap ? nextProps.sectorMap.setMap() : null;
            // nextProps.pcolorMap ? nextProps.pcolorMap.setMap() : null;
        } else if (nextProps.sectorMap) {
            // debugger;
            nextProps.sectorMap.show(); //显示扇形图
            // nextProps.coneMap ? nextProps.coneMap.setMap() : null;
            // nextProps.pcolorMap ? nextProps.pcolorMap.setMap() : null;
        } else if (nextProps.pcolorMap) {
            nextProps.pcolorMap.show();
            // nextProps.sectorMap ? nextProps.sectorMap.setMap() : null;
            // nextProps.coneMap ? nextProps.coneMap.setMap() : null;

        }
    }


    componentDidMount() {
        map = new window.AMap.Map('container', {
            zooms: [8, 14],
            center: [117.152262, 31.856611],
            resizeEnable: true,
            rotateEnable: true,
            pitchEnable: true,
            zoom: 12,
            pitch: 80,
            viewMode: '3D',//开启3D视图,默认为关闭
            buildingAnimation: true,//楼块出现是否带动画
            expandZoomRange: true,
            features: ["bg", 'road']
        });
        map.plugin(["AMap.ControlBar"], function () {
            //map.addControl(new window.AMap.ToolBar());
            let controlBar = new window.AMap.ControlBar({
                showZoomBar: true,
                showControlButton: true,
                position: {
                    left: '-70px',
                    top: '10px'
                }
            });
            map.addControl(controlBar);
        });

        window.AMap.event.addListener(map, 'zoomchange', this.addLayer.bind(this));
        let satellite = new window.AMap.TileLayer.Satellite({
            map: map,
            zIndex: 10
        });
        //把列表的点添加进入
        // this.addPoint(this.props);

        let _self = this;
        let nextProps = this.props;
        _self.addConeLayer(nextProps);
        _self.props.MapDidMount()(map, satellite);

    }

    componentUnmount() {
        window.AMap.event.remove(map, 'zoomend', this.addLayer.bind(this));
    }

    addConeLayer = (props) => {
        //创建默认扫描点
        // debugger;
        let _self = this;
        let nextProps = props;

        if (nextProps.webDeviceInfos.length > 0 && !nextProps.webDeviceInfo) {
            let lonlat = { lon: nextProps.webDeviceInfos[0].longitude, lat: nextProps.webDeviceInfos[0].latitude };

            this.addLayer(nextProps);

        }
    }

    addLayer = (props) => {
        console.log('我在转...' + 666);

        let _self = this;
        let nextProps = props.type == 'zoomchange' ? this.props : props;
        let webDeviceInfo = {};
        let lonlat = {};
        if (nextProps.webDeviceInfo) {
            webDeviceInfo = nextProps.webDeviceInfo;
            lonlat = { lon: webDeviceInfo.longitude, lat: webDeviceInfo.latitude };
        } else if (nextProps.webDeviceInfos.length > 0) {
            webDeviceInfo = nextProps.webDeviceInfos[0];
            lonlat = { lon: webDeviceInfo.longitude, lat: webDeviceInfo.latitude };
        }

        // //10min前
        // let timestamp = Date.parse(new Date()) - 600000;
        // //5min数据
        // let dateTime = parseInt(timestamp / 300000) * 300000;
        // let dateTime = Date.parse(new Date(1515180900000));
        let dateTime = nextProps.timeBaseCurrentDate;
        let queryObj = {
            factor: webDeviceInfo.factor,
            device_code: webDeviceInfo.code,
            time: dateTime,
        }

        // console.log(webDeviceInfo.scan_type);
        //暴力清空3种类别图层
        if (_self.cus) {
            _self.cus.setMap();
        }
        if (_self.imgLayer) {
            _self.imgLayer.setMap();
        }
        if (_self.pColor) {
            _self.pColor.setMap();
        }
        if (webDeviceInfo.scan_type == 2 || webDeviceInfo.scan_type == 1) {
            //锥形图或扇形图
            axios.post('/api/d_cones/list' + '?access_token=' + localStorage.getItem('access_token') + '&username=' + localStorage.getItem('username'), queryObj, config)
                .then(function (res) {
                    if (res.data && res.data.ret == 1 && res.data.datas.length > 0) {
                        //锥形/扇形图信息
                        localStorage.setItem("consAngel", JSON.stringify(res.data.datas[0]));
                        let newDate = moment(dateTime).format('YYYYMMDD');
                        if (webDeviceInfo.scan_type == 2) {
                            console.log('锥形图');
                            //旋转角度
                            let deg = 'deg_' + nextProps.conMapRotateY;
                            let canvasUrl = config.zxtImgServer + webDeviceInfo.site + '/' + newDate + '/' + JSON.parse(localStorage.getItem("consAngel"))[deg];
                            //隐藏图片图层
                            //添加自定义图层 也就是立体锥形图
                            canvas = document.createElement('canvas');
                            canvas.width = map.getSize().width;
                            canvas.height = map.getSize().height;
                            canvas.id = "coneImg";
                            _self.cus = new window.AMap.CustomLayer(canvas, {
                                zooms: [3, 20],
                                zIndex: 1999,
                                opacity: 1
                            });
                            // nextProps.setConeMap()(_self.cus);
                            _self.cus.setMap(map);
                            _self.cus.render = _self.onRender(lonlat, canvasUrl,'cone');
                            map.setCenter([parseFloat(lonlat.lon), parseFloat(lonlat.lat)]);
                        } else {
                            // console.log('扇形图');
                            // debugger;
                            //扇形图信息
                            let imgUrl = config.zxtImgServer + webDeviceInfo.site + '/' + newDate + '/' + JSON.parse(localStorage.getItem("consAngel"))['deg_0'];
                            _self.imgLayer = new window.AMap.ImageLayer({
                                url: imgUrl,
                                bounds: new window.AMap.Bounds(
                                    [lonlat.lon - 0.1, lonlat.lat - 0.1],
                                    [parseFloat(lonlat.lon) + 0.1, parseFloat(lonlat.lat) + 0.1]
                                ),
                                zooms: [3, 20],
                                opacity: 1,
                                zIndex: 9999,
                            });

                            map.setCenter([parseFloat(lonlat.lon), parseFloat(lonlat.lat)]);
                            _self.imgLayer.setMap(map);
                        }
                    } else {
                        message.error('数据查询失败');
                    }
                })
                .catch(function (err) {
                    message.error('数据查询失败' + err);
                })

        } else {
            console.log('微彩图');
            //添加自定义图层 也就是立体锥形图
            canvas = document.createElement('canvas');
            canvas.width = map.getSize().width;
            canvas.height = map.getSize().height;
            canvas.id = "pcolorImg";
            _self.pColor = new window.AMap.CustomLayer(canvas, {
                zooms: [3, 20],
                zIndex: 1999,
                opacity: 1
            });
            let monitorCode = webDeviceInfo.site_info.code;
            // let time = new Date();
            let time1 = moment(dateTime).format("YYYYMMDD"),
                time2 = moment(dateTime).format("HHmm");
            let name = parseInt(time2 / 5) * 5;
            let canvasUrl = config.wctImgServer + "monitor/" + monitorCode + "/" + time1 + '/' + name + ".png"
            _self.pColor.setMap(map);
            _self.pColor.render = _self.onRender(lonlat, canvasUrl,'pColor');
            map.setCenter([parseFloat(lonlat.lon), parseFloat(lonlat.lat)]);
            
        }
    }

    onRender = (lonlat, imgUrl,layerType) => {
        //当前放缩值
        let zoomLevel = map.getZoom();
        let coneElement = document.getElementById('coneImg');
        if (coneElement) {
            let coneImg = coneElement.getContext('2d');
            coneImg.clearRect(lonlat.lon, lonlat.lat, map.getSize().width, map.getSize().height);
        }
        let pcolorImgElement = document.getElementById('pcolorImg');
        if (pcolorImgElement) {
            let pcolorImg = pcolorImgElement.getContext('2d');
            pcolorImg.clearRect(lonlat.lon, lonlat.lat, map.getSize().width, map.getSize().height);
        }
        //移除先前的锥形图
        let oldImg = document.getElementById('myimg');
        oldImg ? document.body.removeChild(oldImg) : null;
        //创建锥形图
        let img = document.createElement('img');
        img.src = imgUrl;
        img.id = 'myimg';
        img.width = 300;
        img.height = 200;
        document.body.appendChild(img);
        img.onload = function () {
            let img_ = document.getElementById("myimg");
            let containerPos = map.lngLatToContainer(new window.AMap.LngLat(lonlat.lon, lonlat.lat));
            let context = canvas.getContext('2d');
            let imgWidth = layerType == 'pColor'?440:(zoomLevel / 2) * 80;
            let imgHeight = layerType == 'pColor'?300:(zoomLevel / 2) * 80
            context.drawImage(img_,
                containerPos.x / 2,
                containerPos.y / 2,
                imgWidth,
                imgHeight);
        }
    }

    render() {
        return (
            <div className={styles.right} id="container" >

            </div>
        )
    }

    //定位到地图的中心点
    setCenter = (nextProps) => {
        let lnglat = ['', ''];
        if (nextProps.webDeviceInfo) {
            lnglat = [nextProps.webDeviceInfo.longitude, nextProps.webDeviceInfo.latitude];
        } else if (nextProps.nationalCtlPointInfo) {
            lnglat = [nextProps.nationalCtlPointInfo.longitude, nextProps.nationalCtlPointInfo.latitude];
        }
        if (lnglat[0] && lnglat[1]) {
            nextProps.map ? nextProps.map.setCenter(lnglat) : null;
        }
    }

    addPoint = (nextProps) => {
        //添加点的
        let nationalCtlPointInfos = nextProps.nationalCtlPointInfos || [],
            webDeviceInfos = nextProps.webDeviceInfos || [];
        let clickWebDevice = nextProps.clickWebDevice,
            clickNationalCtlPoint = nextProps.clickNationalCtlPoint;
        nationalCtlPointInfos.map(function (item, index) {
            if (item.longitude && item.latitude) {
                let content = `<div class=${styles.sitBox}>
                <div class="${styles.panelTitle}">${item.name}</div>
                <div class="${styles.panelContent}">${item.rate}</div>
                </div>
                <img src=${item.state ? nationalCtlPointIcon : nonationalCtlPointIcon}>`;
                new window.AMap.Marker({
                    map: map,
                    index: index,
                    content: content,
                    position: [item.longitude, item.latitude],
                    icon: new window.AMap.Icon({
                        size: new window.AMap.Size(40, 50),  //图标大小
                        image: item.state ? nationalCtlPointIcon : nonationalCtlPointIcon
                    })
                }).on("click", (e) => {
                    clickNationalCtlPoint(e)(e.target.F.index);
                })
            }
        });
        webDeviceInfos.map(function (item, index) {
            if (item.longitude && item.latitude) {
                let content = `<img src=${item.state ? webDeviceIcon : nowebDeviceIcon}>
                <div class =${styles.nationalSiteStyle}>${item.name}</div>`;
                new window.AMap.Marker({
                    map: map,
                    index: index,
                    content: content,
                    position: [item.longitude, item.latitude],
                    icon: new window.AMap.Icon({
                        size: new window.AMap.Size(40, 50),  //图标大小
                        image: item.state ? webDeviceIcon : nowebDeviceIcon
                    })
                }).on("click", (e) => {
                    clickWebDevice(e)(e.target.F.index);
                })
            }
        })
    }

}







export default HomeMap;
