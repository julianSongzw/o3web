/**

 * @Title: heightInputNumber.js
 * @Description: 高度输入框插件 根据传入的步进设置
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
import { InputNumber } from 'antd';
import {config} from "../../../../utils/config"



class HeightInputNumber extends  React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){

        return (
            <InputNumber
                min={config.minHeight}
                max={config.maxHeight}
                step={this.props.heightInterval}
                value={this.props.value}
                onChange={this.onchange}
                onBlur={this.onblured}
            />
        )

    }

    onblured=(value)=>{
        value=parseInt(value.target.value);
        value=parseInt(value/config.heightStep)*config.heightStep;
        this.props.getNumber(value);
    }
    onchange=(value)=>{
        this.props.getNumber(value);
    }

}


export  default HeightInputNumber