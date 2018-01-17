/**
 * Created by zdjie on 2017/10/11.
 */
import React from 'react';
import styles from './webDevice.css';

import lianwang from '../../../public/images/lianwang.png'
import nolianwang from '../../../public/images/no_lianwang.png'
import tongjiY from '../../../public/images/tongji2.png'

class WebDevice extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }


    render() {
        //联网设备数组
        let webDeviceInfo = [];
        let arr = []; //拼接成li的形式
        if (this.props.webDeviceInfo) {
            webDeviceInfo = this.props.webDeviceInfo
        }

        webDeviceInfo.map(function (item, index) {
            arr.push(<li key={item.name + "." + index} onClick={(e) => { this.props.clickWebDeviceLi(e)(index) }} >
                <span>{item.site_info.name}</span>
                <span>{item.name}</span>
                <span>{item.scan_type == 0 ? '未扫描' : item.scan_type == 1 ? '水平' : '立体'}</span>
                <span><img onClick={(e) => { this.props.clickWebDeviceInfo(e)(index) }} src={item.state ? lianwang : nolianwang} /> </span>
                <span><img src={tongjiY} onClick={(e) => { this.props.clickWebDevice(e)(index) }} /></span>
            </li>)
        }.bind(this))
        return (
            <div className={styles.body}>
                <header>联网设备</header>
                    <nav>
                        <span>站点</span>
                        <span>设备</span>
                        <span>扫描类型</span>
                        <span>联网</span>
                        <span>实时数据</span>
                    </nav>
                    <ul>
                        {arr}
                    </ul>
                </div>
        )
    }


}

export default WebDevice;
