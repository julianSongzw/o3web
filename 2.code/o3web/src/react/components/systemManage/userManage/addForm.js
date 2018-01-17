import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Radio, Upload, Cascader } from 'antd';

import styles from './searchForm.css';

class AddData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const RadioGroup = Radio.Group;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 10 },
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
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='姓名:'>
                                {getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: '姓名!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="性别:">
                                {getFieldDecorator('sex', {
                                    initialValue: '0',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <RadioGroup style={{ display: 'inline-block', width: 130 }}>
                                        <Radio value={'0'}>男</Radio>
                                        <Radio value={'1'}>女</Radio>
                                    </RadioGroup>

                                    )}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem {...formItemLayout} label='职称:'>
                                {getFieldDecorator('duties', {
                                    initialValue: '',                                    
                                    rules: [{
                                        required: true, message: '必填'
                                    }],
                                })(
                                    <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                        {this.props.durList.length ? this.props.durList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='所属区划:'>
                                {getFieldDecorator('city', {
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Cascader size="small" options={this.props.areaOptions} placeholder='' changeOnSelect style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='用户名:'>
                                {getFieldDecorator('username', {
                                    initialValue: '',                                    
                                    rules: [{
                                        required: false, message: '用户名!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='角色:'>
                                {getFieldDecorator('role', {
                                    initialValue: '',                                    
                                    rules: [{
                                        required: false, message: '角色!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {this.props.roleList.length > 0 ? this.props.roleList.map(function (item, index) {
                                            return <Option value={item.roleCode} key={index}>{item.roleName}</Option>
                                        }) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="登陆权限:">
                                {getFieldDecorator('flag', {
                                    initialValue: '0',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <RadioGroup style={{ display: 'inline-block', width: 130 }}>
                                        <Radio value={'0'}>无</Radio>
                                        <Radio value={'1'}>有</Radio>
                                    </RadioGroup>

                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='手机号:'>
                                {getFieldDecorator('tel', {
                                    rules: [{
                                        required: false, message: '手机号!',
                                    }, {
                                        pattern: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/,
                                        message: '格式不正确'
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...psLayout} label='住址:'>
                                {getFieldDecorator('addr', {
                                    initialValue: '',                                    
                                    rules: [{
                                        required: false, message: '简介!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const AddDataForm = Form.create()(AddData);

class AddDataFormM extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentWillMount() {
        if (this.props.addModalVisible) {
            this.setState({
                visible: this.props.addModalVisible
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addModalVisible !== this.state.visiblle) {
            this.setState({
                visible: nextProps.addModalVisible
            });
        }
    }

    handleOk = (e) => {
        this.refs.addData.validateFields((err, values) => {
            if (!err) {
                if (values.city) {
                    if (values.city.length == 2) {
                        values.area = values.city[1];
                        values.city = values.city[0];
                    } else {
                        values.area = '';
                        values.city = values.city[0];
                    }
                }
                this.props.addOpt(values);
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
                    title='添加用户信息'
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={760}
                >
                    <AddDataForm {...this.props} ref="addData" />
                </Modal>
            </div>
        )
    }
}

AddDataFormM.propTypes = {
    queryOpt: React.PropTypes.func.isRequired,
    addOpt: React.PropTypes.func.isRequired
}

export default AddDataFormM;