/** */
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Popconfirm, Table, message } from 'antd';
import moment from 'moment';

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
            title: '设备状态',
            dataIndex: 'state',
            render: (text) => text == '0' ? '离线' : text == '1' ? '在线' : '未知'
        }, {
            title: '故障类型',
            dataIndex: 'gtype',
            render: (text) => {
                let defaultType = _self.props.defaultTypeList ? _self.props.defaultTypeList.find(type => text == type.name) : null;
                return defaultType ? defaultType.value : text;
            }
        }, {
            title: '开始时间',
            dataIndex: 'time_ks',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
        }, {
            title: '结束时间',
            dataIndex: 'time_js',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
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
        let queryData = {
            code: values.code,
            state: values.state,
            gtype: values.gtype,
            pageIndex: page.current,
            pageSize: page.pageSize
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

        let columns = this.state.tableConfig;
        let list = this.props.historyStatus ? this.props.historyStatus.list : [];

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