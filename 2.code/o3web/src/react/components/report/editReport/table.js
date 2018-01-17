/** */
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Popconfirm, Table, message } from 'antd';
import moment from 'moment';

import styles from './table.css';
import AddDataFormM from './addForm';
import EditDataFormM from './editForm';

import {config} from './../../../../utils/config';

class Tables extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            tableConfig: [],
            addModalVisible: false,
            editModalVisible: false,
            evFlag: false
        }
    }

    componentWillMount() {
        let _self = this;
        const tableConfig = [{
            title: '报告编号',
            dataIndex: 'code',
        }, {
            title: '报告名称',
            dataIndex: 'name',
            // render: (text, record, index) => this.bayonetTypeTransfer(text, record, index)
        }, {
            title: '报告类型',
            dataIndex: 'rtype',
            render: (text) => {
                let result = text;
                switch (result) {
                    case '0':
                        result = '日报'
                        break;
                    case '1':
                        result = '月报'
                        break;
                    case '2':
                        result = '季报'
                        break;
                    case '3':
                        result = '年报'
                        break;
                    default:
                        break;
                }
                return result;
            }
        }, {
            title: '城市/区域',
            dataIndex: 'city',
            render: (text, record) => {
                let str = text;
                let city = '';
                let area = '';
                if (_self.props.area && text) {
                    for (let i = 0, len = _self.props.area.length; i < len; i++) {
                        if (record.city && record.city == _self.props.area[i].area_code) {
                            city = _self.props.area[i].area_name;
                        }
                        if (record.area && record.area == _self.props.area[i].area_code) {
                            area = _self.props.area[i].area_name;
                        }
                    }
                    str = city + (area ? '/' : '') + area;
                }
                return str || '';
            }
        }, {
            title: '上传时间',
            dataIndex: 'rtime',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
        }, {
            title: '上传人',
            dataIndex: 'user',
        }, {
            title: '操作',
            dataIndex: 'oprator',
            render: (text, record, index) => (
                <span>
                    <a title="下载"  href={`http://${record.file_url}`} target="_blank"><Icon type="download" /></a>
                    <span className="ant-divider" />
                    <Popconfirm title="确定删除 ?" onConfirm={(e) => _self.deleteData(record.id, e)}>
                        <a title="删除"><Icon type="delete" /></a>
                    </Popconfirm>
                    <span className="ant-divider" />
                    <a title="查看" onClick={(e) => _self.viewDetail(record, e)}><Icon type="eye-o" /></a>
                </span>)
        }];

        this.setState({
            tableConfig: tableConfig,
        });
    }

    componentWillReceiveProps(nextProps) {
        //操作状态判断
        if (nextProps.editReport) {
            if (!nextProps.editReport.isAdding && this.props.editReport.isAdding) {
                message.success('添加成功！');
                this.changeModalState();
            } else if (!nextProps.editReport.isEditing && this.props.editReport.isEditing) {
                message.success('修改成功！');
                this.changeModalState();
            } else if (!nextProps.editReport.isDeling && this.props.editReport.isDeling) {
                message.success('删除成功！');
            } else if (!nextProps.editReport.isLoading && this.props.editReport.isLoading) {
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
        if (values.city) {
            if (values.city.length == 2) {
                values.area = values.city[1];
                values.city = values.city[0];
            } else {
                values.area = 'undefined';
                values.city = values.city[0];
            }
        }
        let queryData = {
            city: values.city,
            area: values.area,
            code: values.code,
            name: values.name,
            rtype: values.rtype,
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
        this.props.deleteOpt(idObj);
    }

    deleteBatch = () => {
        if (this.state.ids) {
            this.props.deleteOpt({ id: this.state.ids });
        } else {
            message.warning('请先选择报警数据！');
        }
    }

    downloadData = (id, e) => {
        let idObj = {
            id: id
        }
        this.props.downloadOpt(idObj);
    }

    downloadBatch = () => {
        if (this.state.ids) {
            this.props.downloadOpt({ id: this.state.ids });
        } else {
            message.warning('请先选择报警数据！');
        }
    }

    exportData(event) {
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {

        } else {
            event.preventDefault();
            return false;
        }
    }


    render() {

        let columns = this.state.tableConfig;
        let list = this.props.editReport ? this.props.editReport.list : [];

        let pagination = {
            total: list ? list.count : 0,
            showSizeChanger: true,
            showTotal: (count) => `共 ${count} 条`,
        };

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange
        };

        const downloadBtn = (
            <div style={{ textAlign: "right" }}>
                <form action={`${config.baseURL}/api/d_reports/choicesDownload?access_token=${localStorage.getItem('access_token')}&username=${localStorage.getItem('username')}`} method="post" target="_blank" onSubmit={this.exportData.bind(this)}>
                    <Button htmlType="submit" type="primary" size="small" style={{ marginRight: 20 }}>批量下载</Button>
                    <input type="text" hidden="hidden" value={this.state.selectedRowKeys.join(",")} name="id" />
                </form>

            </div>
        );

        return (
            <div>
                <div className={styles.rightButton}>
                    <Button type='primary' size="small" className={styles.addButton} onClick={this.addData} >添加</Button>
                    {downloadBtn}
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