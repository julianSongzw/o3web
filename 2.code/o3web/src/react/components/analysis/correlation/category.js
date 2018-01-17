/**

 * @Title: category.js
 * @Description:  因子相关性
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

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            text:'正在查询中...'
        }
    }

    componentWillReceiveProps(nextprops){
        if(nextprops.flag == this.props.flag){return }
        let myChart = echarts.getInstanceByDom(document.getElementById('category'));
        if(myChart){
            myChart.dispose();
            myChart = echarts.init(document.getElementById('category'));
        }else{
            myChart = echarts.init(document.getElementById('category'));
        }
        if(nextprops.isLoading){
            myChart.showLoading({
                text : '数据获取中',
                effect: 'whirling'
            });
            return ;
        }else{
            myChart.hideLoading();
        }
        let categoryDate  = nextprops.categoryDate;
        let categoryMould = nextprops.categoryMould;
        let factorName =nextprops.factorName;
        let factorCode =nextprops.factorCode;
        let gkObj = nextprops.gkObj; //国控点对象
        let series=[];
        if(categoryDate.ret == 1){ //请求成功
            for(let key in categoryDate){
                if(key !="msg" && key != "ret"){
                    //国控点
                    if(key  == "gk"){
                        for(let gkKey in categoryDate[key]){
                            let gkName =gkObj[gkKey];
                            let gkDate =categoryDate[key][gkKey];
                            if(gkDate[factorCode] && gkDate[factorCode].length>0){
                                series.push({
                                    name:factorName+"浓度("+gkName+")",
                                    type:'line',
                                    stack: '总量',
                                    smooth:true,
                                    showAllSymbol :true,
                                    data:gkDate[factorCode]
                                })
                            }
                            if(gkDate["weather"]){
                                let humArr=[],tmpArr=[];
                                for(let i=0,le=gkDate["weather"].length;i<le;i++){
                                    if(gkDate["weather"][i].hum){
                                        humArr.push(gkDate["weather"][i].hum);
                                    }
                                    if(gkDate["weather"][i].tmp){
                                        tmpArr.push(gkDate["weather"][i].tmp);
                                    }
                                }
                                if(humArr.length>0){
                                    series.push({
                                        name:"湿度("+gkName+")",
                                        type:'line',
                                        stack: '总量',
                                        smooth:true,
                                        showAllSymbol :true,
                                        data:humArr
                                    })
                                }
                                if(tmpArr.length>0){
                                    series.push({
                                        name:"温度("+gkName+")",
                                        type:'line',
                                        stack: '总量',
                                        smooth:true,
                                        showAllSymbol :true,
                                        data:tmpArr
                                    })
                                }
                            }
                        }
                    }else{
                        for(let factorKey in categoryDate[key]){
                            for(let heightKey in categoryDate[key][factorKey]) {
                                series.push({
                                    name:factorName+"浓度("+heightKey+"m)",
                                    type:'line',
                                    stack: '总量',
                                    smooth:true,
                                    showAllSymbol :true,
                                    data:categoryDate[key][factorKey][heightKey]
                                })
                            }
                        }
                    }
                }
            }
            categoryMould.series=series;
                categoryMould.xAxis.data = nextprops.xAxisData;
            myChart.setOption(categoryMould);
        }else if(categoryDate.ret == 0){
            this.setState({
                text:categoryDate.msg
            })
        }
    }

    render(){
        return (
            <div id="category" style={{height:"500px",width:"90%",marginLeft:"5%"}}>{this.state.text}</div>
        );
    }
}

export default  Category;