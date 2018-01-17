/** */
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Popconfirm, Table, message } from 'antd';
import styles from './table.css';
import axios from 'axios';
import { config } from '../../../../utils/config';
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
            title: '姓名',
            dataIndex: 'name',
        }, {
            title: '性别',
            dataIndex: 'sex',
            render: (text) => text === '0' ? '男' : '女'
        }, {
            title: '职称',
            dataIndex: 'duties',
            render: (text) => {
                let str = text;
                if (this.props.durList.length > 0) {
                    let dur = this.props.durList.find(dur => dur.name == text)
                    str = dur.value;
                }
                return str;
            }
        }, {
            title: '用户名',
            dataIndex: 'username',
        }, {
            title: '手机号码',
            dataIndex: 'tel',
        }, {
            title: '城市区域',
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
            title: '操作',
            dataIndex: 'oprator',
            render: (text, record, index) => (
                <span>
                    <a title="编辑" onClick={(e) => _self.editData(record, e)}><Icon type="edit" /></a>
                    <span className="ant-divider" />
                    <a title="重置密码" onClick={(e) => _self.resetPwd(record.id, e)}><Icon type="reload" /></a>
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
        if (nextProps.sysUser) {
            if (!nextProps.sysUser.isAdding && this.props.sysUser.isAdding) {
                message.success('添加成功！');
                this.changeModalState();
            } else if (!nextProps.sysUser.isEditing && this.props.sysUser.isEditing) {
                message.success('修改成功！');
                this.changeModalState();
            } else if (!nextProps.sysUser.isDeling && this.props.sysUser.isDeling) {
                message.success('删除成功！');
            } else if (!nextProps.sysUser.isLoading && this.props.sysUser.isLoading) {
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
            username: values.username,
            flag: values.flag,
            duties: values.duties,
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
            message.warning('请先选择用户信息！');
        }
    }

    resetPwd = (id) =>{
        let _self = this;
        //角色列表
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        let resetData = {id:id,username:username };
        axios.post('/api/sys_users/resetPassword' + '?access_token=' + access_token + '&username=' + username,resetData,config)
            .then(function (res) {
                if (res.data && res.data.ret) {
                    message.success('密码重置成功');
                } else {
                    message.error('密码重置失败');
                }
            })
            .catch(function (err) {
                message.error('密码重置失败' + err);
            })
    }


    render() {
        let columns = this.state.tableConfig;
        let list = this.props.sysUser ? this.props.sysUser.list : [];

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