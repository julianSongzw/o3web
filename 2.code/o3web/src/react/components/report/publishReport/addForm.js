import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Cascader } from 'antd';

import styles from './searchForm.css';

class AddData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
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

        return (
            <div>
                <Form
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
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
                            <FormItem {...formItemLayout} label='最小值:'>
                                {getFieldDecorator('minv', {
                                    rules: [{
                                        required: true, message: '最小值!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="最大值 :">
                                {getFieldDecorator('maxv', {
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='季度:'>
                                {getFieldDecorator('season', {
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        <Option key={'0'} value='0'>第一季度</Option>
                                        <Option key={'1'} value='1'>第二季度</Option>
                                        <Option key={'2'} value='3'>第三季度</Option>
                                        <Option key={'3'} value='4'>第四季度</Option>
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
                            <FormItem {...formItemLayout} label='持续时间:'>
                                {getFieldDecorator('dur', {
                                    rules: [{
                                        required: false, message: '持续时间!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130, position: 'relative', top: 5 }} addonAfter='s' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label='平均值:'>
                                {getFieldDecorator('avg', {
                                    rules: [{
                                        required: false, message: '平均值!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label='百分点限值:'>
                                {getFieldDecorator('Per100', {
                                    rules: [{
                                        required: false, message: '百分点限值!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130, position: 'relative', top: 5 }} addonAfter='%' />
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
                    title='添加报警配置'
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