/**

 * @Title:YmContrastTop.js
 * @Description:同比环比
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
import { Button ,message, Radio} from 'antd';
import { connect } from 'react-redux';
import  YmContrastTop from "../../../components/queryAndStatistics/ymconstrast/ymContrastTop";
import  YmContrastPic from "../../../components/queryAndStatistics/ymconstrast/ymContrastPic";
import {config} from "../../../../utils/config"
import axios from "axios";
const access_token = localStorage.getItem('access_token');
const username = localStorage.getItem('username');

class YmContrast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryData:"",//查询条件需要带回到子组件
            resultData:[],//数据库返回数据
            isLoading:false ,//伪彩图是不是在加载中
        };
    }

    render() {
        return (
            <div>
                <YmContrastTop
                    { ...this.props}
                    d_colorsAction ={this.d_colorsAction}
                    isLoading={this.state.isLoading}
                />
                <hr style={{margin:"10px 10px 0 10px", borderTop:"1px solid gray",display:"block"}}/>
                <YmContrastPic {...this.props}  objData={this.state} />
            </div>
        );
    }

    //查询接口
    d_colorsAction = (queryData)=> {
        debugger
        let url = 'api/tong_huans/list'+"?access_token="+access_token+"&username="+username;
        var that = this;
        let resultData = [];
        that.setState({
            isLoading:true
        })
        axios.post(url,queryData,config)
            .then(function (res) {
                if(res.data.ret==1){
                    resultData = res.data[queryData.factor];
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
                console.log(err);
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
export default connect(mapStateToProps)(YmContrast);