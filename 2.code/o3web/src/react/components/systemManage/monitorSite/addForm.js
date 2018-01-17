import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Cascader } from 'antd';

import styles from './searchForm.css';

const FormItem = Form.Item;
const Option = Select.Option;

class AddData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const { getFieldDecorator } = this.props.form;

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

        let siteType = this.props.siteType;
        // debugger;
        return (
            <div>
                <Form
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='站点编码:'>
                                {getFieldDecorator('code', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: '站点编码!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="站点名称:">
                                {getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='站点类型:'>
                                {getFieldDecorator('type', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: '必填'
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {siteType.length > 0 ? siteType.map(function (item, index) {
                                            return <Option key={index} value={item.name}>{item.value}</Option>
                                        }) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='城市/区域:'>
                                {getFieldDecorator('city', {
                                    initialValue: [],
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Cascader size="small" options={this.props.areaOptions} placeholder='' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='经度:'>
                                {getFieldDecorator('longitude', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: '请输入合法经度!',
                                    }, {
                                        pattern: /^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,4})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,4}|180)$/,
                                        message: '请输入合法经度'
                                    }],
                                })(
                                    <Input placeholder="0~180" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='纬度:'>
                                {getFieldDecorator('latitude', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: '请输入合法纬度!',
                                    }, {
                                        pattern: /^([0-8]?\d{1}\.\d{0,4}|90\.0{0,4}|[0-8]?\d{1}|90)$/,
                                        message: '请输入合法纬度'
                                    }],
                                })(
                                    <Input placeholder="0~90" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='监测因子:'>
                                {getFieldDecorator('factor', {
                                    initialValue: [],
                                    rules: [{
                                        required: false, message: '监测因子!',
                                    }],
                                })(
                                    <Select mode="multiple" size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {
                                            this.props.factor ? this.props.factor.map(function (item, index) {
                                                return <Option key={index} value={item.fcode}>{item.fname}</Option>
                                            }) : null
                                        }
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='负责人:'>
                                {getFieldDecorator('user', {
                                    initialValue: '',
                                    rules: [{
                                        required: false, message: '负责人!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {this.props.userlist.length > 0 ? this.props.userlist.map(function (user, index) {
                                            return <Option key={index} value={user.id}>{user.name}</Option>
                                        }) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...psLayout} label='简介:'>
                                {getFieldDecorator('remark', {
                                    initialValue: '',
                                    rules: [{
                                        required: false, message: '简介!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' type="textarea" />
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
        let _self = this;
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
                if (values.factor) {
                    values.factor = values.factor.join(',');
                }
                _self.props.addOpt(values);
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
                    title='添加监测站点'
                    visible={this.state.visible}
                    onOk={this.handleOk}
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