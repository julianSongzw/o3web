import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal } from 'antd';

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
                            <FormItem {...formItemLayout} label='字典名称:'>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true, message: '字典名称!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="字典类型:">
                                {getFieldDecorator('dtype', {
                                    rules: [{
                                        required: true, message: '字典类型!'
                                    }]
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {this.props.dicTypeList.length ? this.props.dicTypeList.map(function(item, index){return  <Option value={item.type_code} key={index}>{item.type_name}</Option>}
                                    ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem {...formItemLayout} label='字典值:'>
                                {getFieldDecorator('value', {

                                    rules: [{
                                        required: true, message: '必填'
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...psLayout} label='备注:'>
                                {getFieldDecorator('ps', {
                                    rules: [{
                                        required: false, message: '备注!',
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
                    title='添加字典'
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