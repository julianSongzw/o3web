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
            title: '日志类型',
            dataIndex: 'level',
            // render: (text, record, index) => this.bayonetTypeTransfer(text, record, index)
        }, {
            title: '内容',
            dataIndex: 'message',
        }, {
            title: '时间',
            dataIndex: 'timestamp',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
            // render: (text) => {
            //     let time;
            //     if (text) {
            //         let timeStr = text.substr(0, text.length - 5);
            //         time = moment(timeStr).format('YYYY-MM-DD HH:mm:ss');
            //     }
            //     return time || text;
            // }
        }, {
            title: '客户端ip',
            dataIndex: 'meta.ip',
        }, , {
            title: '操作人',
            dataIndex: 'meta.user',
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
        let logTime_Start;
        let logTime_End;
        if (Object.prototype.toString.call(values.timestamp) == '[object Array]') {
            values.logTime_Start = values.timestamp[0].format('X') * 1000;
            values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
        }
        let queryData = {
            type: values.type,
            logTime_Start: values.logTime_Start,
            logTime_End: values.logTime_End,
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
        let list = this.props.sysLog ? this.props.sysLog.list : [];

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
                    <Button type='primary' size="small" className={styles.deletePart} onClick={this.deleteBatch} >批量删除</Button>
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