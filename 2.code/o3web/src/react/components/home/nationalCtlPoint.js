/**
 * Created by zdjie on 2017/10/16.
 */
import React from 'react';
import styles from './nationalList.css';
import  lianwang from '../../../public/images/lianwang.png'
import  nolianwang from '../../../public/images/no_lianwang.png'
import  tongjiR from '../../../public/images/tongji1.png';

class NationalCtlPoint extends React.Component{
    constructor(props) {
        super(props);

    }



    render(){
        //联网设备数组
        let nationalCtlPointInfo=[];
        let arr=[]; //拼接成li的形式

        if(this.props.nationalCtlPointInfo){
            nationalCtlPointInfo=this.props.nationalCtlPointInfo
        }
        // debugger;
        nationalCtlPointInfo.map(function (item,index) {
            arr.push(  <li key={item.name+"."+index } onClick={(e)=>{this.props.clickNationalCtlPointLi(e)(index)}}>
                <span>{item.name}</span>
                <span>{item.upTime}</span>
                <span><img onClick={(e)=>{this.props.clickNationalDeviceInfo(e)(index)}}  />{item.rate}</span>
                <span><img src={tongjiR} onClick={(e)=>{this.props.clickNationalCtlPoint(e)(index)}} /></span>
            </li>)
        }.bind(this))


        return (
            <div  className={styles.nationalList}>
                <header>国控点</header>
                <nav>
                    <span>站点</span>
                    <span>通信时间</span>
                    <span>数据获取率</span>
                    <span>最新数据</span>
                </nav>
                <ul>
                    {arr}
                </ul>
            </div>
        )
    }


}

export default NationalCtlPoint;
