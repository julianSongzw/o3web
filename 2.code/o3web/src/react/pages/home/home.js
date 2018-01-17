/**
 * Created by zdjie on 2017/10/16.
 * last modify by weijq om 17/12/27
 */
import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, message } from 'antd';
import axios from "axios";
import { config } from "../../../utils/config";
import * as act from '../../../redux/actions/home'
import * as shareAct from '../../../redux/actions/share'

import WebDevice from '../../components/home/webDevice'
import NationalCtlPoint from '../../components/home/nationalCtlPoint'
import HomeMap from '../../components/home/homeMap'
import ScanMap from '../../components/home/scanMap'
import HeatMap from '../../components/home/heatMap'
import TabPane1 from '../../components/home/TabPane1'
import TabPane2 from '../../components/home/TabPane2'
import TabPane3 from '../../components/home/TabPane3'
import TimeBar from "../../components/home/timeBar";

import videoIcon from '../../../public/images/videoIcon.png'

import styles from './home.css';

const TabPane = Tabs.TabPane;

class Home extends React.Component {

    constructor(props) {
        console.log("constructor");
        super(props);
        // //10min前
        let timestamp = Date.parse(new Date()) - 600000;
        //5min数据
        let currentDate = parseInt(timestamp / 300000) * 300000;
        this.state = {
            webDeviceWindowFlag: false, //是否开启联网设备弹出框
            selectWebDeviceInfo: "", //联网设备实时数据 index
            nationalCtlPointFlag: false,//是否开启国控点设备弹出框
            selectNationalCtlPointInfo: "", // 国控点最新数据index
            map: "", //地图对象
            satellite: "",//卫星图
            heatmap: '',//热力图
            scanmap: '',// 这是扫描图
            planemap: '',//第一个平面图
            coneMap: '',//立体锥形图
            sectorMap: '',//扇形图,
            chartType: "heatMap", //图类型 scanMap:扫描图   heatMap:热力图
            conMapRotateX: -100, //立体锥形图角度
            conMapRotateY: 0,
            conMapMoveType: '',//移动x轴还是y轴
            conMapSetInterval: '', //立体锥形图循环
            deviceInfoFlag: false, //设备详情
            deviceInfo: '',//当前点击的设备详情，
            timeBaseCurrentDate:currentDate,//查询风场图、锥形图、扇形图等初始时间
        }
        //this.props.getCascaderObj(this.props.cityArea,this.props.monitorSiteGroup,this.props.factorGroup);
    }

    componentWillMount() {
        // const ws = webs
    }


    /*
     点击联网设备实时数据按钮
     * */
    clickWebDevice = (index) => {
        this.setState({
            webDeviceWindowFlag: true,
            selectWebDeviceInfo: this.props.webDeviceInfos[index],
            selectNationalCtlPointInfo: ''
        })
    }
    /*
     * 关闭联网设备弹窗框
     * */
    closeWebDeviceWindow = () => {
        this.setState({
            webDeviceWindowFlag: false,
        })
    }

    /*
     点击li 定位到地图中的点
     * */
    clickWebDeviceLi = (index) => {
        this.setState({
            selectWebDeviceInfo: this.props.webDeviceInfos[index],
            selectNationalCtlPointInfo: ""
        })
    }

    /*
     点击国控点最新数据按钮
     * */
    clickNationalCtlPoint = (index) => {
        let _self = this;
        let scode = this.props.nationalCtlPointInfos[index] ? this.props.nationalCtlPointInfos[index].code : '';
        axios.post('/api/d_airs/list?access_token=' + localStorage.getItem('access_token') + '&username=' + localStorage.getItem('username'), { scode: scode }, config)
            .then(function (res) {
                if (res.data && res.data.ret == 1) {
                    let pollutonInfo = res.data.datas.length > 0 ? res.data.datas[0] : {};
                    pollutonInfo = Object.assign(pollutonInfo, _self.props.nationalCtlPointInfos[index]);
                    _self.setState({
                        nationalCtlPointFlag: true,
                        selectNationalCtlPointInfo: pollutonInfo,
                        selectWebDeviceInfo: ''
                    })
                } else {
                    message.error('数据请求失败');
                }
            })
            .catch(function (err) {
                message.error('数据请求失败' + err);
            })

    }
    /*
     * 关闭联网设备弹窗框
     * */
    closeNationalCtlPointWindow = () => {
        this.setState({
            nationalCtlPointFlag: false,
        })
    }
    /*
     点击li 定位到地图中的点
     * */
    clickNationalCtlPointLi = (index) => {
        this.setState({
            selectNationalCtlPointInfo: this.props.nationalCtlPointInfos[index],
            selectWebDeviceInfo: ''
        })
    }

    /*
    *   点击设备详情 就是那个小圆圈  联网设备
    * */
    clickWebDeviceInfo = (index) => {
        this.setState({
            deviceInfoFlag_web: true
        })
    }
    /*
     *   点击设备详情 就是那个小圆圈  国控点
     * */
    clickNationalDeviceInfo = (index) => {
        this.setState({
            deviceInfoFlag_national: true
        })
    }
    /*
    关闭设备详情
    * */
    closeDeviceInfoWindow = () => {
        this.setState({
            deviceInfoFlag_web: false,
            deviceInfoFlag_national: false
        })
    }

    /*
    * 创建地图后的回调 这是热力图
    * */
    HeatMapDidMount = (map, satellite, heatmap) => {
        this.state.planemap = map;
        this.state.satellite = satellite;
        this.state.heatmap = heatmap;
        this.props.getDeviceListSubmit({ pageSize: 10000, pageIndex: 1 });
        this.props.getNationalCtlPointSubmit({ type: 1 }); //查询国控点
    }

    /*
     * 创建地图后的回调  这是扫描图
     * */
    ScanMapDidMount = (map, satellite, heatmap) => {
        this.state.scanmap = map;
        this.state.satellite = satellite;
        //this.props.getDeviceListSubmit({ pageSize: 10000, pageIndex: 1 });
        //this.props.getNationalCtlPointSubmit({ type: 1 }); //查询国控点
        let right = document.getElementsByClassName("amap-rotateRight")[0],
            left = document.getElementsByClassName("amap-rotateLeft")[0];
        if (right) {
            right.addEventListener('mousedown', function () {
                this.rotateRight();
            }.bind(this))
            right.addEventListener('mouseup', function () {
                this.clearSetInterval();
            }.bind(this))
            right.addEventListener('mouseout', function () {
                this.clearSetInterval();
            }.bind(this))
        }
        if (left) {
            left.addEventListener('mousedown', function () {
                this.rotateLeft();
            }.bind(this))
            left.addEventListener('mouseup', function () {
                this.clearSetInterval();
            }.bind(this))
            left.addEventListener('mouseout', function () {
                this.clearSetInterval();
            }.bind(this))
        }
    }

    //绘制立体锥形图后的回调
    setConeMap = (cus) => {
        this.state.coneMap = cus;
    }

    //绘制扇形图回调
    setSectorMap = (sector) => {
        this.state.sectorMap = sector;
    }

    //绘制伪彩图回调
    setPcolorMap = (pcolor) => {
        this.state.pcolorMap = pcolor;
    }

    //时间轴时间更新
    timeBaseUpdate = (newTime)=>{
        if(newTime){
            this.setState({timeBaseCurrentDate:newTime});
        }
    }

    componentWillReceiveProps(nextProps) {

    }



    render() {
        //国控点列表展示
        let selectNationalCtlPointInfo = this.state.selectNationalCtlPointInfo;//国控点选择的一行
        let nationalCtlPointArr = [];//国控点弹窗数据列表
        if (selectNationalCtlPointInfo.pollutionArr) {
            selectNationalCtlPointInfo.pollutionArr.map(function (item, index) {
                nationalCtlPointArr.push(<div key={item.name + "." + index}><span>{item.value}</span><span>{item.type}</span></div>)
            })
        }
        // debugger;
        let selectWebDeviceInfo = this.state.selectWebDeviceInfo;//联网设备选择的一行
        return (
            <div className={styles.h100}>
                {/*
                 左侧的两个列表
                 */}
                <article className={styles.left}>
                    <WebDevice  {...this.props}
                        webDeviceInfo={this.props.webDeviceInfos}
                        clickWebDevice={(e) => this.clickWebDevice.bind(this)}
                        clickWebDeviceLi={(e) => this.clickWebDeviceLi.bind(this)}
                        clickWebDeviceInfo={(e) => this.clickWebDeviceInfo.bind(this)}
                    />
                    <NationalCtlPoint  {...this.props}
                        nationalCtlPointInfo={this.props.nationalCtlPointInfos}
                        clickNationalCtlPoint={(e) => this.clickNationalCtlPoint.bind(this)}
                        clickNationalCtlPointLi={(e) => this.clickNationalCtlPointLi.bind(this)}
                        clickNationalDeviceInfo={(e) => this.clickNationalDeviceInfo.bind(this)}
                    ></NationalCtlPoint>
                </article>

                {/*
                 右侧的地图dd
                 */}
                {this.state.chartType == 'scanMap' ?
                    <ScanMap {...this.props}
                        webDeviceInfos={this.props.webDeviceInfos}
                        nationalCtlPointInfos={this.props.nationalCtlPointInfos}
                        clickWebDevice={(e) => this.clickWebDevice.bind(this)}
                        clickNationalCtlPoint={(e) => this.clickNationalCtlPoint.bind(this)}
                        MapDidMount={(e) => this.ScanMapDidMount.bind(this)}
                        map={this.state.scanmap}
                        heatmap={this.state.heatmap}
                        conMapRotateX={this.state.conMapRotateX}
                        conMapRotateY={this.state.conMapRotateY}
                        setConeMap={(e) => this.setConeMap.bind(this)}
                        setSectorMap={(e) => this.setSectorMap.bind(this)}
                        setPcolorMap={(e) => this.setPcolorMap.bind(this)}
                        coneMap={this.state.coneMap}
                        sectorMap={this.state.sectorMap}
                        pcolorMap={this.state.pcolorMap}
                        satellite={this.state.satellite}
                        nationalCtlPointInfo={this.state.selectNationalCtlPointInfo}
                        webDeviceInfo={this.state.selectWebDeviceInfo}
                        chartType={this.state.chartType}
                        timeBaseCurrentDate={this.state.timeBaseCurrentDate}

                    /> : <HeatMap {...this.props}
                        webDeviceInfos={this.props.webDeviceInfos}
                        nationalCtlPointInfos={this.props.nationalCtlPointInfos}
                        clickWebDevice={(e) => this.clickWebDevice.bind(this)}
                        clickNationalCtlPoint={(e) => this.clickNationalCtlPoint.bind(this)}
                        MapDidMount={(e) => this.HeatMapDidMount.bind(this)}

                        map={this.state.planemap}
                        heatmap={this.state.heatmap}
                        conMapRotateX={this.state.conMapRotateX}
                        conMapRotateY={this.state.conMapRotateY}
                        coneMap={this.state.coneMap}
                        satellite={this.state.satellite}
                        nationalCtlPointInfo={this.state.selectNationalCtlPointInfo}
                        webDeviceInfo={this.state.selectWebDeviceInfo}
                        chartType={this.state.chartType}
                        time_cj = {this.state.timeBaseCurrentDate}
                    />

                }



                {/*
                 弹出框
                 */}
                {/*
                 弹出框 ---- 三个伪彩图
                 */}
                {this.state.webDeviceWindowFlag ?
                    <Modal
                        title={"实时信息(" + (this.state.selectWebDeviceInfo ? this.state.selectWebDeviceInfo.name : "") + ")"}
                        visible={this.state.webDeviceWindowFlag}
                        onCancel={() => this.closeWebDeviceWindow()}
                        footer={null}
                        width={960}
                    >
                        <div className="card-container">
                            <Tabs type="card">
                                <TabPane tab="O3浓度" key="1">
                                    <TabPane1  {...this.props} selectWebDeviceInfo={this.state.selectWebDeviceInfo} modalVisiableFlag={this.state.webDeviceWindowFlag} />
                                </TabPane>
                                <TabPane tab="532消光" key="2">
                                    <TabPane2  {...this.props} option={this.state.selectWebDeviceInfo.xiaoguang532} />
                                </TabPane>
                                <TabPane tab="532退偏" key="3">
                                    <TabPane3  {...this.props} option={this.state.selectWebDeviceInfo.tuipian532} />
                                </TabPane>
                            </Tabs>
                        </div>

                    </Modal>
                    : null}
                {/*
                 弹出框 ---- 国控点最新数据
                 */}
                <Modal
                    title={selectNationalCtlPointInfo ? selectNationalCtlPointInfo.name : ""}
                    visible={this.state.nationalCtlPointFlag}
                    onCancel={() => this.closeNationalCtlPointWindow()}
                    footer={null}
                >
                    <div className={styles.tanchuang_device}>
                        <article>
                            <header className={styles.header}>
                                <div><label> 站点名称 </label><span>{selectNationalCtlPointInfo.name || '--'}</span></div>
                                <div><label htmlFor="">空气质量</label><span>{selectNationalCtlPointInfo.quality
                                    || '--'}</span></div>
                                <div><label>O3(μg/m³)</label><span>{selectNationalCtlPointInfo.o3 || '--'}</span></div>
                                <div><label htmlFor="">PM2.5(μg/m³)</label><span>{selectNationalCtlPointInfo.pm2_5 || '--'}</span></div>
                                <div><label htmlFor="">SO2(μg/m³)</label><span>{selectNationalCtlPointInfo.so2 || '--'}</span></div>
                            </header>
                            <section>
                                {nationalCtlPointArr}
                            </section>
                            <footer>
                                <span className={styles.time}>数据获取率：{selectNationalCtlPointInfo.rate || '--'}</span>
                                <span className={styles.time}>更新时间：{selectNationalCtlPointInfo.upTime || '--'}</span>
                            </footer>
                        </article>
                    </div>
                </Modal>
                {/*
                 弹出框 ---- 设备详情
                 */}
                <Modal
                    title={selectWebDeviceInfo ? selectWebDeviceInfo.name : ""}
                    visible={this.state.deviceInfoFlag_web}
                    onCancel={() => this.closeDeviceInfoWindow()}
                    footer={null}
                /* width={360} */
                >
                    <div className={styles.tanchuang_device}>
                        <article>
                            <header className={styles.header}>
                                <div>
                                    <label htmlFor="">站点名称</label><span>{selectWebDeviceInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">站点地址</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">安装日期</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">开关机状态</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">工作状态</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">激光器状态</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">UPS电源状态</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">天窗雨刷状态</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">天窗加热状态</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">室外温度</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                                <div>
                                    <label htmlFor="">室外湿度</label><span>{selectNationalCtlPointInfo.name || '--'}</span>
                                </div>
                            </header>
                        </article>
                        <section>
                            {nationalCtlPointArr}
                        </section>
                        <footer style={{ marginTop: 10, marginLeft: '1%' }}>
                            <span className={styles.time}>联网状态:{selectWebDeviceInfo.state ? '在线' : '离线'}</span>
                        </footer>
                    </div>
                </Modal>
                <Modal
                    title={selectNationalCtlPointInfo ? selectNationalCtlPointInfo.name : ""}
                    visible={this.state.deviceInfoFlag_national}
                    onCancel={() => this.closeDeviceInfoWindow()}
                    footer={null}
                    width={360}
                >
                    <div className={styles.tanchuang_device}>
                        <div className={styles.infoLi}>
                            <div>
                                站点编号:{selectNationalCtlPointInfo.code}
                            </div>
                            <div>
                                站点地址:{selectNationalCtlPointInfo.address}
                            </div>
                        </div>
                    </div>
                </Modal>
                {/*
                * 选择图标类型按钮
                * */}
                <aside className={styles.aside}>
                    <button className={this.state.chartType === "heatMap" ? styles.selected : null}
                        onClick={(e) => { this.changeChartType("heatMap") }}
                    >热力图</button>
                    <button className={this.state.chartType === "scanMap" ? styles.selected : null}
                        onClick={(e) => { this.changeChartType("scanMap") }}
                    >扫描图</button>
                </aside>
                {/*
                 * 控制锥形图旋转的按钮
                 * */}
                {/*
                <aside className={styles.satelliteCtl}>
                    <div className={styles.amappancontrol} >

                        <div className={styles.amappanleft} onMouseDown={this.rotateLeft} onMouseUp={this.clearSetInterval} onMouseOut={this.clearSetInterval}></div>


                        <div className={styles.amappantop} onMouseDown={this.rotateTop} onMouseUp ={this.clearSetInterval}  onMouseOut ={this.clearSetInterval}></div>

                        <div className={styles.amappanright} onMouseDown={this.rotateRight} onMouseUp={this.clearSetInterval} onMouseOut={this.clearSetInterval}></div>

                        <div className={styles.amappanbottom} onMouseDown={this.rotateBottom} onMouseUp ={this.clearSetInterval}  onMouseOut ={this.clearSetInterval}></div>

                    </div>
                </aside>*/}
                <div className={styles.timeBarBox}>
                     <TimeBar timeBaseUpdate={this.timeBaseUpdate}/>
                    </div>
                <div className={styles.colorLegend}>
                    <ul>
                        <li><span className={styles.listBggray}></span>离线</li>
                        <li><span className={styles.listBgRed}></span>优</li>
                        <li><span className={styles.listBgYellow}></span>良</li>
                        <li><span className={styles.listBgQDWR}></span>轻度污染</li>
                        <li><span className={styles.listBgDeepRed}></span>中度污染</li>
                        <li><span className={styles.listBgzhong}></span>重度污染</li>
                        <li><span className={styles.listBgYanzhong}></span>严重污染</li>
                    </ul>
                </div>

            </div >
        )
    }

    //改变图类型
    changeChartType = (type) => {
        this.setState({
            chartType: type
        })
    }

    rotateLeft = () => {
        // this.state.conMapSetInterval = setInterval(function () {

        //     this.setState({
        //         conMapRotateY: this.state.conMapRotateY + 10,
        //         conMapMoveType: "Y"
        //     })
        //     //console.log(this.state.conMapRotateY,"this.state.conMapRotateY");
        // }.bind(this), 10);
    }
    rotateTop = () => {
        this.state.conMapSetInterval = setInterval(function () {
            this.setState({
                conMapRotateX: this.state.conMapRotateX + 1,
                conMapMoveType: "X"
            })
        }.bind(this), 100);
    }
    rotateRight = () => {
        let angal = this.state.scanmap.getRotation();
        // debugger;
        console.log(angal + 6666);
        // this.state.conMapSetInterval = setInterval(function () {
        //     this.setState({
        //         conMapRotateY: this.state.conMapRotateY - 10,
        //         conMapMoveType: "Y"
        //     })
        //     console.log(this.state.conMapRotateY, "this.state.conMapRotateY");
        // }.bind(this), 10);
    }
    rotateBottom = () => {
        this.state.conMapSetInterval = setInterval(function () {
            this.setState({
                conMapRotateX: this.state.conMapRotateX - 1,
                conMapMoveType: "X"
            })
        }.bind(this), 200);
    }
    clearSetInterval = () => {
        clearInterval(this.state.conMapSetInterval);
    }

}


function mapStateToProps(state) {
    //国控点实时状态
    let nationalCtlPointInfos = state.Home.nationalCtlPointInfos ? state.Home.nationalCtlPointInfos.clone() : state.Home.nationalCtlPointInfos;
    if (state.Home && state.Home.nationalCtlPointInfos && state.SocketMiddle && state.SocketMiddle.nationalSiteTimeStaus) {
        let siteStatus = Object.assign({}, state.SocketMiddle.nationalSiteTimeStaus);
        //清空推送数据
        state.SocketMiddle.nationalSiteTimeStaus = {};
        let np = nationalCtlPointInfos;
        if (siteStatus.hasOwnProperty('wtype')) {
            for (let i = 0, len = np.length; i < len; i++) {
                np[i].upTime = siteStatus[np[i].code] ? siteStatus[np[i].code].upTime : np[i].upTime;
                np[i].rate = siteStatus[np[i].code] ? siteStatus[np[i].code].rate : np[i].rate;
            }
        }
    }
    //站点设备实时状态
    let webDeviceInfos = state.Home.webDeviceInfos ? state.Home.webDeviceInfos.clone() : state.Home.webDeviceInfos;
    if (state.Home && state.Home.webDeviceInfos && state.SocketMiddle && state.SocketMiddle.devTimeStatus) {
        let devStatus = Object.assign({}, state.SocketMiddle.devTimeStatus);
        //清空推送数据
        state.SocketMiddle.devTimeStatus = {};
        let ds = webDeviceInfos;
        //判断 是不是推送过来的数据
        if (devStatus.hasOwnProperty('wtype')) {
            for (let i = 0, len = ds.length; i < len; i++) {
                ds[i].state = devStatus[ds[i].code] ? devStatus[ds[i].code].is_online : ds[i].is_online;
            }
        }
    }
    // debugger;

    return {
        webDeviceInfos: webDeviceInfos,// 联网设备
        nationalCtlPointInfos: nationalCtlPointInfos,// 国控点
        heatmapPoints: state.Home.heatmapPoints,//定义热力图数据,
        homeFlag: state.Home.homeFlag,
        cityArea: state.Share.cityArea,//城市/区划数据对象
        monitorSiteGroup: state.Share.monitorSiteGroup, //区划监测点  检测因子
        factorGroup: state.Share.factorGroup,
        factorColorList:state.Share.factorColorList, //各个检测因子浓度对应的值
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getDeviceListSubmit: (param) => {
            dispatch(act.getDeviceListSubmit(param))
        },
        getNationalCtlPointSubmit: (param) => {
            dispatch(act.getNationalCtlPointSubmit(param))
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);