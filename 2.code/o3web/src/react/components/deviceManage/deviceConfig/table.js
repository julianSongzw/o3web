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
            evFlag: false
        }
    }

    componentWillMount() {
        let _self = this;
        const tableConfig = [{
            title: '设备编码',
            dataIndex: 'code',
        }, {
            title: '设备名称',
            dataIndex: 'name',
            // render: (text, record, index) => this.bayonetTypeTransfer(text, record, index)
        }, {
            title: '设备类别',
            dataIndex: 'otype',
            render: (text) => {
                let devType = _self.props.devTypeList ? _self.props.devTypeList.find(type => text == type.name) : null;
                return devType ? devType.value : text;
            }
        }, {
            title: '规格型号',
            dataIndex: 'spec',
        }, {
            title: '安装点位',
            dataIndex: 'site',
        }, {
            title: '安装时间',
            dataIndex: 'time_az',
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text
        }, {
            title: '联网状态',
            dataIndex: 'state',
            render: (text) => { return text === '0' ? '离线' : text === '1' ? '在线' : '未知' }
        }, {
            title: '操作',
            dataIndex: 'oprator',
            render: (text, record, index) => (
                <span>
                    <a title="编辑" onClick={(e) => _self.editData(record, e)}><Icon type="edit" /></a>
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
        if (nextProps.devConfig) {
            if (!nextProps.devConfig.isAdding && this.props.devConfig.isAdding) {
                message.success('添加成功！');
                this.changeModalState();
            } else if (!nextProps.devConfig.isEditing && this.props.devConfig.isEditing) {
                message.success('修改成功！');
                this.changeModalState();
            } else if (!nextProps.devConfig.isDeling && this.props.devConfig.isDeling) {
                message.success('删除成功！');
            } else if (!nextProps.devConfig.isLoading && this.props.devConfig.isLoading) {
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
        let queryData = {
            name: values.name,
            code: values.code,
            site: values.site,
            otype: values.otype,
            factor: values.factor,
            union_gk: values.union_gk,
            union_sk: values.union_sk,
            union_cg: values.union_cg,
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
            message.warning('请先选择设备！');
        }
    }


    render() {

        let columns = this.state.tableConfig;
        let list = this.props.devConfig ? this.props.devConfig.list : [];

        let pagination = {
            total:list.count,
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
                    <Button type='primary' size="small" className={styles.addButton} onClick={this.addData} >添加</Button>
                    <Button type='primary' size="small" className={styles.deletePart} onClick={this.deleteBatch} >批量删除</Button>
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