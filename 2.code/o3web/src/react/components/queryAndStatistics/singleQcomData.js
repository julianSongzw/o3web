/**

 * @Title:SingleQcomPicLow.js
 * @Description: 暂时不需要
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
import styles from "./contrast.css";
import { Table } from 'antd';

const columns = [{
    title: '设备编号',
    dataIndex: 'devNo',
    render: text => <a href="#">{text}</a>,
}, {
    title: '监测点',
    className: 'column-money',
    dataIndex: 'add',
}, {
    title: '采集高度(m)',
    dataIndex: 'height',
},{
    title: '采集时间',
    dataIndex: 'time',
},{
    title: 'O3浓度',
    dataIndex: 'O3',
},{
    title: 'AQI',
    dataIndex: 'aqi',
}];

const data = [{
    key: '1',
    devNo: '001',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:99,
    aqi:110
}, {
    key: '2',
    devNo: '002',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:199,
    aqi:110
}, {
    key: '3',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '4',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '5',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '6',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '7',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '8',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '9',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '10',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '11',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}, {
    key: '12',
    devNo: '003',
    add: '明珠广场',
    height: '100',
    time:'2017-08-17',
    O3:299,
    aqi:210
}];

class SingleQcomData extends React.Component {

    componentDidMount() {

    }

    render(){
        return (
            <div id="data" className={styles.data}>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    //title={() => 'Header'}
                    //footer={() => 'Footer'}
                />
            </div>
        );
    }

}
export  default SingleQcomData;

