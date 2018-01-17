/** */
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Popconfirm, Table, message } from 'antd';
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
            title: '字典名称',
            dataIndex: 'name',
            // render: (text, record, index) => this.bayonetTypeTransfer(text, record, index)
        }, {
            title: '字典类型',
            dataIndex: 'dtype',
        }, {
            title: '字典值',
            dataIndex: 'value',
        }, {
            title: '序号',
            dataIndex: 'order',
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

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {
        //操作状态判断
        if (nextProps.sysDic) {
            if (!nextProps.sysDic.isAdding && this.props.sysDic.isAdding) {
                message.success('添加成功！');
                this.changeModalState();
            } else if (!nextProps.sysDic.isEditing && this.props.sysDic.isEditing) {
                message.success('修改成功！');
                this.changeModalState();
            } else if (!nextProps.sysDic.isDeling && this.props.sysDic.isDeling) {
                message.success('删除成功！');
            } else if (!nextProps.sysDic.isLoading && this.props.sysDic.isLoading) {
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
            dtype: values.dtype,
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
            message.warning('请先选择字典！');
        }
    }


    render() {

        let columns = this.state.tableConfig;
        let list = this.props.sysDic ? this.props.sysDic.list : [];        

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
                    <Button type='primary' size="small" className={styles.addButton} onClick={this.addData} >添加</Button>
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