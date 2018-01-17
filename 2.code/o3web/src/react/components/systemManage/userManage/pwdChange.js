import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Radio, Upload, Cascader ,message} from 'antd';
import axios from 'axios';
import {config} from '../../../../utils/config';
import styles from './searchForm.css';

class PwdChange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const RadioGroup = Radio.Group;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            }
        };
        const psLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
        };
        return (
            <div>
                <Form
                    onSubmit={this.handleAddSbumit}
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='旧密码:'>
                                {getFieldDecorator('oldPassword', {
                                    initialValue: this.props.record === undefined ? '' : this.props.record.oldPassword,
                                    rules: [{
                                        required: true, message: '请输入原密码!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='新密码:'>
                                {getFieldDecorator('newPassword', {
                                    initialValue: this.props.record === undefined ? '' : this.props.record.newPassword,
                                    rules: [{
                                        required: true, message: '请输入新密码！',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' type="password" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div >
        )
    }
}

const PwdChangeForm = Form.create()(PwdChange);

class PwdChangeFormM extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentWillMount() {
        if (this.props.changeModalVisible) {
            this.setState({
                visible: this.props.changeModalVisible
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.changeModalVisible !== this.state.visiblle) {
            this.setState({
                visible: nextProps.changeModalVisible
            });
        }
    }

    handleOk = (e) => {
        this.refs.pwdData.validateFields((err, values) => {
            if (!err) {
                let _self = this;
                //角色列表
                let pwdObj = {
                    id:this.props.userId,
                    oldPassword:values.oldPassword,
                    newPassword:values.newPassword
                }
                let access_token = localStorage.getItem('access_token');
                let username = localStorage.getItem('username');
                axios.post('/api/sys_users/changePassword' + '?access_token=' + access_token + '&username=' + username,pwdObj,config)
                    .then(function (res) {
                        if (res.data && res.data.ret) {
                            message.success('修改成功');
                            _self.props.changeModalState();
                        } else {
                            message.error('修改失败');
                        }
                    })
                    .catch(function (err) {
                        message.error('修改失败' + err);
                    })
            }
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false
        });
        this.props.changeModalState();
    }

    render() {
        return (
            <div>
                <Modal
                    title='修改密码'
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={350}
                >
                    <PwdChangeForm {...this.props} ref="pwdData" />
                </Modal>
            </div>
        )
    }
}

PwdChangeFormM.propTypes = {
    // queryOpt: React.PropTypes.func.isRequired,
    // addOpt: React.PropTypes.func.isRequired
}

export default PwdChangeFormM;