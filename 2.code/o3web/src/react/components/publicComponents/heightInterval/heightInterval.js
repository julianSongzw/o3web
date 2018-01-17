/**

* @Title: heightInterval.js
* @Description: 高度间隔插件
* @author jiezd@ahtsoft.com （揭志东）
* @date 2017年12月12日
* @version V1.0
* @Revision : $Rev$
* @Id: $Id$
*
* Company: 合肥安慧软件有限公司
* Copyright: Copyright (c) 2017
*/
import React from 'react'
import { Select } from 'antd';
import {config} from "../../../../utils/config"
const Option = Select.Option;


class HeightInterval extends  React.Component{

    constructor(props){
        super(props);
        this.state={
            heightStep:config.heightStep.toString(),
            value:config.heightStep*config.heightIntervalLength
        }
    }

    componentDidMount(){
        this.props.getHeightInterval(this.state.value);
    }

    render(){
        debugger;
        let heightStep=config.heightStep,
            length=config.heightIntervalLength;
        let arr=[];
        for(let i=0;i<length;i++){
            let value=""+((i+1)*heightStep)+"";
            arr.push(<Option value={value} key={(i+1)}>{(i+1)*heightStep}</Option>)
        }
        return (
            <div style={{display:"inline-block",width:"100%"}}>
                <Select style={{display:"inline-block",width:"100%"}} value={this.state.value.toString()} onChange={this.onChange}>
                    {arr}
                </Select>
            </div>
        )

    }


    onChange=(value)=>{
        this.setState({
            value:value
        })
        this.props.getHeightInterval(value);
    }

}


export  default HeightInterval