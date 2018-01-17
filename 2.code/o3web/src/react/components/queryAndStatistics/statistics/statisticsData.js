/**

 * @Title:StatisticsData.js
 * @Description:统计查询列表
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
import { Table } from 'antd';
const {Column}=Table;

class StatisticsData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newData:this.props.objData.resultData,
        };
    }

    componentWillReceiveProps(nextProps) {
        debugger
        if (nextProps.objData !== this.props.objData) {
            let objData = nextProps.objData.resultData //外部传入的data数据
            this.setState({
                newData:objData,
            })
        }
    }

    render() {
        debugger
        let data = this.props.objData.resultData;//外部传入的data数据
        //确定监测因子,生成因子下的表格
        let factors = [];
        let factorArr;
        let factorNameArr = [];
        if(data.length>0){
            factorArr = data[0].factor
            let selectFactorCode = this.props.objData.queryData.factor;
            factorArr.map((item1,index)=>{
                debugger
                selectFactorCode.map((item,index)=>{
                    if(item1 ===item.key){
                        factorNameArr.push(item.label);
                    }
                })
            })
        }
        if(factorNameArr!==undefined){
            factors= factorNameArr.map((item,index)=>{
                     return  <div >
                                       <span>{item}</span>
                             </div>
            });
            /*for(let i in factorArr ){

                if(i === "0"){
                    factors.push( )
                }else{
                    factors.push( <div>
                        <span>{factorArr[i]}</span>
                    </div>)
                }
            }*/

        }
        //确定所有高度值，生成对应的列，
        let text_all = [];
        let dataObj = data[0];
        if(dataObj!==undefined){
            for(let kk in dataObj ){
                if(kk.startsWith("text")){
                    let textObj;
                    if(kk.substring(5)==="low"){
                        textObj = {
                            title: "近地面",
                            dataIndex: kk,
                            width: "2%",
                            render: (item, record, index)=> {

                                return record[kk].map((item,index)=>{
                                    return <div style={{margin:"0 -8px"}}>
                                        <div key={index}>
                                            <span>{item}</span>
                                        </div>
                                    </div>
                                });


                                /*     return (<div style={{margin:"0 -8px"}}>
                                 <div style={{borderBottom:"1px solid #e9e9e9"}}>
                                 <span>{item[kk][0]}</span>
                                 </div>
                                 <div>
                                 <span>{item[kk][1]}</span>
                                 </div>
                                 </div>)*/
                            }
                        }
                    }else{
                        textObj = {
                            title: kk.substring(5)+"m",
                            dataIndex: kk,
                            width: "2%",
                            render: (item, record, index)=> {

                                return record[kk].map((item,index)=>{
                                    return <div style={{margin:"0 -8px"}}>
                                        <div key={index}>
                                            <span>{item}</span>
                                        </div>
                                    </div>
                                });


                                /*     return (<div style={{margin:"0 -8px"}}>
                                 <div style={{borderBottom:"1px solid #e9e9e9"}}>
                                 <span>{item[kk][0]}</span>
                                 </div>
                                 <div>
                                 <span>{item[kk][1]}</span>
                                 </div>
                                 </div>)*/
                            }
                        }
                    }
                    text_all.push(
                        textObj
                    )
                }}
        }
        this.tableDataConfig = {
            // 表头配置列表
            columns: [
                //{
                //    title: '国控点',
                //    dataIndex: 'type',
                //    width: '2%',
                //    render: (text, record, index)=> {
                //        if(text.type === "gk"){
                //            return "是"
                //        }else{
                //            return "否"
                //        }
                //    }
                //},
                {
                    title: '监测点',
                    dataIndex: 'site',
                    width: "2%",
                    render: (text, record, index)=> {
                        return text.site
                    }
                },
                {
                    title: '因子类型',
                    dataIndex: 'factor',
                    width: "2%",
                    render: (item, record, index)=> {

                        return (
                            <div style={{margin:"0 -8px"}}>
                                        {factors}
                            </div>)
                    }

                }
            ]
        }
        //获取数据factor参数
        let columns = this.tableDataConfig.columns.concat(text_all);
        return (
            <div id="data" className={styles.data}>
                <Table
                    key="统计查询"
                    bordered
                    dataSource={this.state.newData}
                    rowKey={(record)=>{return record.id }}
                >
                    {
                        columns.map(function (column, index) {
                            return <Column
                                title={column.title}
                                key={index}
                                render={(text,record,index)=>{
                                                  var dataIndex = column.dataIndex;
                                                        if(column.render){
                                                            if(column.operatorList){
                                                                return column.render(text,record,index)
                                                            }
                                                            return column.render(text,record,index)
                                                        }
                                                      return (<div>{record[dataIndex]}</div>)
                                              }
                                              }
                            />
                        })
                    }

                </Table>
            </div>
        );
    }

}
export  default StatisticsData;

