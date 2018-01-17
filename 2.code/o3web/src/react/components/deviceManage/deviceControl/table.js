/** */
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Popconfirm, Table, message } from 'antd';
import moment from 'moment';

import styles from './table.css';
import AddDataFormM from './addForm';
import EditDataFormM from './editForm';

class Tables extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            tableConfig: [],
            addModalVisible: false,
            editModalVisible: false,
            evFlag: false //修改查看标志
        }
    }

    componentWillMount() {
        let _self = this;
        const tableConfig = [{
            title: '设备编码',
            dataIndex: 'code',
            // render: (text, record, index) => this.bayonetTypeTransfer(text, record, index)
        }, {
            title: '设备名称',
            dataIndex: 'name',
            render: (text, record) => {
                let type = _self.props.deviceList ? _self.props.deviceList.find(type => record.code == type.code) : null;
                return type ? type.name : text;
            }
        }, {
            title: '质控类型',
            dataIndex: 'ctype',
            render: (text) => {
                let type = _self.props.cTypeList ? _self.props.cTypeList.find(type => text == type.name) : null;
                return type ? type.value : text;
            }
        }, {
            title: '质控时间',
            dataIndex: 'ctime',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
        }, {
            title: '质控评价',
            dataIndex: 'result',
            render: (text) => text == '0' ? '失败' : (text == '1' ? '质控中' : (text == '2' ? '成功' : '--'))
        }, {
            title: '质控人',
            dataIndex: 'user',
        }, {
            title: '操作',
            dataIndex: 'oprator',
            render: (text, record, index) => (
                <span>
                    <a title="查看" onClick={(e) => _self.viewDetail(record, e)}><Icon type="eye-o" /></a>
                </span>)
        }];

        this.setState({
            tableConfig: tableConfig,
        });
    }

    componentWillReceiveProps(nextProps) {
        //操作状态判断
        if (nextProps.deviceControl) {
            if (!nextProps.deviceControl.isAdding && this.props.deviceControl.isAdding) {
                message.success('质控成功！');
                this.changeModalState();
            } else if (!nextProps.deviceControl.isEditing && this.props.deviceControl.isEditing) {
                message.success('修改成功！');
                this.changeModalState();
            } else if (!nextProps.deviceControl.isDeling && this.props.deviceControl.isDeling) {
                message.success('删除成功！');
            } else if (!nextProps.deviceControl.isLoading && this.props.deviceControl.isLoading) {
                message.success('查询成功！');
            }
        }
    }

    //勾选行变化
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let ids = [];
        for (let i = 0, len = selectedRows.length; i < len; i++) {
            ids.push(selectedRows[i].id);
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            ids: ids.join(',')
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
            ctype: values.ctype,
            result: values.result,
            ctime_start: values.logTime_Start,
            ctime_end: values.logTime_End,
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

    addData = () => {
        this.setState({
            addModalVisible: true,
            editModalVisible: false,
        });
    }

    editData = (record, e) => {
        this.setState({
            editModalVisible: true,
            addModalVisible: false,
            editRecord: record,
            evFlag: false
        });
    }

    viewDetail = (record, e) => {
        this.setState({
            editModalVisible: true,
            addModalVisible: false,
            editRecord: record,
            evFlag: true
        });
    }

    deleteData = (id, e) => {
        let idObj = {
            id: id
        }
        // this.props.deleteBroadcast(idObj);
    }

    deleteBatch = () => {
        if (this.state.ids) {
            // this.props.deleteBroadcast({ id: this.state.ids });
        } else {
            message.warning('请先选择设备！');
        }
    }


    render() {
        debugger;
        let columns = this.state.tableConfig;
        let list = this.props.devControl ? this.props.devControl.list : [];

        let pagination = {
            total: list ? list.count : 0,
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
                    <Button type='primary' size="small" className={styles.addButton} onClick={this.addData} >发起质控</Button>
                </div>
                <Table
                    {...this.props}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={list ? list.datas : []}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                    rowSelection={rowSelection}
                />
                {this.state.addModalVisible ?
                    <AddDataFormM
                        {...this.props}
                        ref="addDataFormM"
                        addModalVisible={this.state.addModalVisible}
                        changeModalState={this.changeModalState.bind(this)}
                    /> : null}
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