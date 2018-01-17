/* 
 * @Title: $undefined 
 * @Description: Todo 
 * @Author: weijq@cychina.cn (韦继强) 
 * @Date: 2017-12-18 11:36:39 
 * @Last Modified by: weijq@cychina.cn (韦继强)
 * @Last Modified time: 2017-12-19 15:56:24
 * @Version:V1.0 
 * Company: 合肥安慧软件有限公司 
 * Copyright: Copyright (c) 2017' 
 */

import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Popconfirm, Table, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { config } from '../../../../utils/config';
import XLSX from 'xlsx';

import styles from './table.css';
import EditDataFormM from './editForm';

class Tables extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            tableConfig: [],
            addModalVisible: false,
            editModalVisible: false,
            evFlag: false,//修改查看标志,
            exportData: [] //准备导出的数据
        }
    }

    componentWillMount() {
        let _self = this;
        const tableConfig = [{
            title: '设备编号',
            dataIndex: 'code',
            // render: (text, record, index) => this.bayonetTypeTransfer(text, record, index)
        }, {
            title: '监测因子',
            dataIndex: 'factor',
            render: (text) => this.factorType(text)
        },
        {
            title: '因子数值',
            dataIndex: 'fvlaue',
        }, {
            title: '报警类型',
            dataIndex: 'atype',
            render: (text) => this.alramType(text)
        }, {
            title: '报警时间',
            dataIndex: 'atime',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
        }, {
            title: '备注',
            dataIndex: 'remark',
            // render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text            
        }, {
            title: '操作',
            dataIndex: 'oprator',
            render: (text, record, index) => (
                <span>
                    <Popconfirm title="确定删除 ?" onConfirm={(e) => _self.deleteData(record.id, e)}>
                        <a title="删除"><Icon type="delete" /></a>
                    </Popconfirm>
                </span>)
        }];

        this.setState({
            tableConfig: tableConfig,
        });
    }

    alramType(text) {
        let aType = this.props.aTypeList ? this.props.aTypeList.find(type => text == type.name) : null;
        return aType ? aType.value : text;
    }

    factorType(text) {
        let str = [];
        let strTemp = {};
        if (this.props.factor && text) {
            let strLen = text.match(/,/);
            if (!(Object.prototype.toString.call(strLen) == '[object Array]')) {
                strTemp = this.props.factor.find(factor => text == factor.fcode);
                strTemp ? str.push(strTemp.fname) : null;
            } else {
                let fArr = text.split(',');
                let fArrLen = fArr.length;
                for (let i = fArr.length - 1; i >= 0; i--) {
                    strTemp = this.props.factor.find(factor => fArr[i] == factor.fcode);
                    strTemp ? str.push(strTemp.fname) : null;
                }
            }
        }
        str = str.join(',');
        return str || '';
    }

    //勾选行变化
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let ids = [];
        for (let i = 0, len = selectedRows.length; i < len; i++) {
            ids.push(selectedRows[i].id);
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            ids: ids.join(','),
            exportData: selectedRows.clone()
        });
    }

    //切换页码查询
    handleTableChange = (page, pageSize) => {
        // //;
        this.setState({
            current: page.current,
            pageSize: page.pageSize
        });
        let values = this.props.searchForm.getFieldsValue();
        let logTime_Start;
        let logTime_End;
        if (Object.prototype.toString.call(values.timestamp) == '[object Array]') {
            values.logTime_Start = values.timestamp[0] ? values.timestamp[0].format('X') * 1000 : null;
            values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
        }
        let queryData = {
            code: values.code,
            factor: values.factor,
            atype: values.atype,
            atime_start: values.logTime_Start,
            atime_end: values.logTime_End,
            pageIndex: this.state.pageIndex,
            pageSize: this.state.pageSize
        }
        this.props.queryOpt(queryData);
    }

    changeModalState = () => {
        this.setState({
            addModalVisible: false,
            editModalVisible: false,
            evFlag: false
        });
    }

    deleteData = (id, e) => {
        let idObj = {
            id: id
        }
        this.props.deleteOpt(idObj);
    }

    export = () => {
        if (this.state.exportData.length > 0) {
            let jsonTemp = new Array();
            for (let i = 0, len = this.state.exportData.length; i < len; i++) {
                let temp = this.state.exportData[i];
                jsonTemp.push({
                    '设备名称': temp.code,
                    '监测因子': this.factorType(temp.factor),
                    '因子数值': temp.fvlaue,
                    '报警类型': this.alramType(temp.atype),
                    '报警时间': temp.atime ? moment(temp.atime).format('YYYY-MM-DD HH:mm:ss') : '',
                    '备注': temp.remark,
                });
            }

            this.downloadExl(jsonTemp);
        } else {
            message.warning('请先选择报警记录！');
        }
    }

    exportAll = () => {
        //带条件查询所有数据
        let values = this.props.searchForm.getFieldsValue();
        let logTime_Start;
        let logTime_End;
        if (Object.prototype.toString.call(values.timestamp) == '[object Array]') {
            values.logTime_Start = values.timestamp[0] ? values.timestamp[0].format('X') * 1000 : null;
            values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
        }
        let queryData = {
            code: values.code,
            factor: values.factor,
            atype: values.atype,
            atime_start: values.logTime_Start,
            atime_end: values.logTime_End,
        }
        let _self = this;
        //角色列表
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        axios.post('/api/o_alarms/list' + '?access_token=' + access_token + '&username=' + username,queryData,config)
            .then(function (res) {
                if (res.data && res.data.ret) {
                    let resTemp = res.data.datas.clone();
                    let jsonTemp = new Array();
                    for (let i = 0, len = resTemp.length; i < len; i++) {
                        let temp = resTemp[i];
                        jsonTemp.push({
                            '设备名称': temp.code,
                            '监测因子': _self.factorType(temp.factor),
                            '因子数值': temp.fvlaue,
                            '报警类型': _self.alramType(temp.atype),
                            '报警时间': temp.atime ? moment(temp.atime).format('YYYY-MM-DD HH:mm:ss') : '',
                            '备注': temp.remark,
                        });
                    }
        
                    _self.downloadExl(jsonTemp);
                } else {
                    message.error('数据查询请求失败');
                }
            })
            .catch(function (err) {
                message.error('数据查询请求失败' + err);
            })
    }

    //json数据导出excel
    downloadExl(json, type) {
        var tmpDown; //导出的二进制对象
        var tmpdata = json[0];
        json.unshift({});
        var keyMap = []; //获取keys
        for (var k in tmpdata) {
            keyMap.push(k);
            json[0][k] = k;
        }
        var tmpdata = [];//用来保存转换好的json 
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
            SheetNames: ['mySheet'], //保存的表标题
            Sheets: {
                'mySheet': Object.assign({},
                    tmpdata, //内容
                    {
                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                    })
            }
        };
        tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
            { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
        ))], {
                type: ""
            }); //创建二进制对象写入转换好的字节流
        var href = URL.createObjectURL(tmpDown); //创建对象超链接
        document.getElementById("hf").href = href; //绑定a标签
        document.getElementById("hf").click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
            URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    }

    s2ab(s) { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
    getCharCol(n) {
        let temCol = '',
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    }


    render() {

        let columns = this.state.tableConfig;
        let list = this.props.deviceAlarm ? this.props.deviceAlarm.list : [];

        let pagination = {
            total: list.count,
            showSizeChanger: true,
            showTotal: (count) => `共 ${count} 条`,
        };

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange
        };

        return (
            <div>
                <div className={styles.rightButton}>
                    <Button type='primary' size="small" className={styles.export} style={{marginRight:10}} onClick={this.export} >导出</Button>
                    <Button type='primary' size="small" className={styles.export} onClick={this.exportAll} >全部导出</Button>
                    <a href="" download={`设备报警日志_${moment().format('YYYYMMDDHHmmss')}.xlsx`} id="hf" style={{ display: 'none' }}></a>
                </div>
                <Table
                    {...this.props}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={list.datas}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                    rowSelection={rowSelection}
                />
                {this.state.editModalVisible ?
                    <EditDataFormM
                        {...this.props}
                        ref="editDataFormM"
                        editObj={this.state}
                        changeModalState={this.changeModalState.bind(this)}
                    /> : null}
            </div>
        )
    }

}

Table.propTypes = {
    queryOpt: React.PropTypes.func.isRequired
}

export default Tables;