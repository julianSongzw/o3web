/*
 * @Title:统计查询
 * @Description:统计查询
 * @Author: chengf@cychina.cn
 * @Date: 2017-11-27 09:19:20
 * @Version:V1.0
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017'
 */
import React from "react";
import styles from "./../singleQpag.css";
import { Button ,message, Radio} from 'antd';
import { connect } from 'react-redux';
import  StatisticsTopForm from "../../../components/queryAndStatistics/statistics/statisticsTop";
import StatisticsData from "../../../components/queryAndStatistics/statistics/statisticsData";
import StatisticsPic from "../../../components/queryAndStatistics/statistics/statisticsPic";
import {config} from "../../../../utils/config";
import {pubFunc} from "../../../../utils/pubFnc"
import axios from "axios";
const access_token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');
const data = [{
    id:1,
    type: 'gk',
    site: '董铺水库',
    factor:["03浓度","消光系数"],
    text_low:[88,99],
    text_100:[199,100],
    text_200:[299,200],
    text_300:[399,300],
},{
    id:2,
    type: 'gk',
    site: '明珠广场',
    factor:["03浓度","消光系数"],
    text_low:[44,55],
    text_100:[144,155],
    text_200:[244,255],
    text_300:[344,355],
},{
    id:3,
    type: 'gk',
    site: '大学城',
    factor:["03浓度","消光系数"],
    text_low:[22,11],
    text_100:[122,111],
    text_200:[233,211],
    text_300:[333,311],
},{
    id:4,
    type: 'gk',
    site: '测试1',
    factor:["03浓度","消光系数"],
    text_low:[111,222],
    text_100:[222,222],
    text_200:[333,333],
    text_300:[444,444],
},{
    id:5,
    type: 'wg',
    site: '董铺水库-东',
    factor:["03浓度","消光系数"],
    text_low:[44,88],
    text_100:[23,32],
    text_200:[56,89],
    text_300:[86,36],
},
]

const data1 = [{
    id:1,
    type: 'gk',
    site: '董铺水库',
    factor:["03浓度"],
    text_low:[88],
    text_100:[199],
    text_200:[299],
    text_300:[399],
},{
    id:2,
    type: 'gk',
    site: '明珠广场',
    factor:["03浓度"],
    text_low:[44],
    text_100:[144],
    text_200:[244],
    text_300:[344],
},{
    id:3,
    type: 'gk',
    site: '大学城',
    factor:["03浓度"],
    text_low:[22],
    text_100:[122],
    text_200:[233],
    text_300:[333],
},{
    id:4,
    type: 'gk',
    site: '测试1',
    factor:["03浓度"],
    text_low:[111],
    text_100:[222],
    text_200:[333],
    text_300:[444],
},{
    id:5,
    type: 'wg',
    site: '董铺水库-东',
    factor:["03浓度"],
    text_low:[44],
    text_100:[23],
    text_200:[56],
    text_300:[86],
},
]
class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkResult:true,
            queryData:"",//查询条件需要带回到子组件
            resultData:[],//数据库返回数据
            isLoading:false ,//伪彩图是不是在加载中
        };
    }

    render(){
        return (
            <div>
                <StatisticsTopForm
                    { ...this.props}
                    d_colorsAction ={this.d_colorsAction}
                    isLoading={this.state.isLoading}
                />
                <hr style={{margin:"10px 10px 0 10px", borderTop:"1px solid gray",display:"block"}}/>
                <div className = {styles.singleQpagbtn}>
                    <Radio.Group  onChange={this.handleFormLayoutChange}>
                        <Radio.Button value="btn1" >列表</Radio.Button>
                        <Radio.Button value="btn2" >图表</Radio.Button>
                    </Radio.Group>
                </div>
                {
                    this.state.checkResult?<StatisticsData {...this.props} objData={this.state}/>
                        :<StatisticsPic {...this.props} objData={this.state}/>
                }
            </div>
        );
    }
    /**
     * 下面2个函数是做图表和列表显示切换
     * @param btn
     */
    handleFormLayoutChange = (btn)=>{
        //console.log(btn.target.value);
        if(btn.target.value=='btn1'){
            this.setState({
                checkResult:true
            })
        }else{
            this.setState({
                checkResult:false
            })
        }
    }


    //查询接口
    d_colorsAction = (queryData)=> {
        let h_start = queryData.h_start;
        let h_end = queryData.h_end;
        let h_index = queryData.h_index;
        if(queryData.scode === undefined || queryData.scode.length===0){
            message.warn("请选择监测点!")
            return
        }
        if(queryData.factor === undefined  || queryData.factor.length===0){
            message.warn("请选择因子!")
            return
        }
        if(parseInt((h_end-h_start)/h_index) >10){//包含0，所以一共是11个条线
            message.warn("请增加高度间隔!")
            return
        }
        let url = 'api/statistics/list'+"?access_token="+access_token+"&username="+username;
        var that = this;
        let kk= pubFunc.objectClone(queryData);
        let scode = [];
        let factor = [];
        for(let i = 0;i<queryData.scode.length;i++){
            scode.push(queryData.scode[i].key);
        }
        for(let i = 0;i<queryData.factor.length;i++){
            factor.push(queryData.factor[i].key);
        }
        kk.scode = scode;
        kk.factor = factor;
        that.setState({
            isLoading:true
        })
        axios.post(url,kk,config)
            .then(function (res) {
                if(res.data.ret==1){
                    debugger
                    let resultData = res.data.datas;
                        that.setState({
                            queryData:queryData,
                            resultData:resultData,
                            isLoading:false,
                        })
                }else{
                    message.error(res.data.msg);
                }
            })
            .catch(function(err){
                message.error("报错了，刷新试试");
                that.setState({
                    isLoading:false,
                })
            })
    }
}

function mapStateToProps(state) {
    return {
        //城市点位插件需要的参数
        cityArea:state.Share.cityArea,
        monitorSiteGroup:state.Share.monitorSiteGroup,
        factor:state.Share.factor,
    }
}

export default connect(mapStateToProps)(Statistics);