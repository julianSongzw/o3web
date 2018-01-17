import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Cascader } from 'antd';

import styles from './searchForm.css';

class EidtData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            evFlag: false
        };
    }

    componentWillMount() {
        if (this.props.recordObj && this.props.recordObj.editRecord) {
            this.setState({
                editRecord: this.props.recordObj.editRecord,
                evFlag: this.props.recordObj.evFlag
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.recordObj && (nextProps.recordObj.editRecord !== this.state.editRecord
            || nextProps.recordObj.evFlag !== this.state.evFlag)) {
            this.setState({
                editRecord: nextProps.recordObj.editRecord,
                evFlag: nextProps.recordObj.evFlag
            });
        }
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const formItemLayout = {
            // labelCol: { span: 6 },
            // wrapperCol: { span: 12 },
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
        //城市区域信息
        let initCity = [];
        let cityTemp = Object.assign({}, this.state.editRecord);
        if (cityTemp) {
            if (cityTemp.city)
                initCity.push(cityTemp.city);
            if (cityTemp.area)
                initCity.push(cityTemp.area);
        }
        let factorTemp = Object.assign({}, this.state.editRecord);
        let factorArr = factorTemp.factor ? factorTemp.factor.split(',') : [];
        return (
            <div>
                <Form
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='报告类型:'>
                                {getFieldDecorator('rtype', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.rtype + '' : '',
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        <Option key={'0'} value="0">日报</Option>
                                        <Option key={'1'} value="1">月报</Option>
                                        <Option key={'2'} value="2">季报</Option>
                                        <Option key={'3'} value="3">年报</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="报告名称:">
                                {getFieldDecorator('name', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.name + '' : '',
                                })(
                                    <Input size="small" placeholder='' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='区域:'>
                                {getFieldDecorator('city', {
                                    initialValue: initCity,
                                    rules: [{
                                        required: false, message: '!',
                                    }],
                                })(
                                    <Cascader size="small" options={this.props.areaOptions} placeholder='' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='备注:'>
                                {getFieldDecorator('remark', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.remark + '' : '',
                                    rules: [{
                                        required: false, message: '备注!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' type="textarea" disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col span={10}>
                        <label htmlFor="" style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10px', color: 'rgba(0, 0, 0, 0.85)' }}>上传文件:</label>
                        </Col>
                        <Col span={12}>
                            {this.state.editRecord ? this.state.editRecord.file_name ? <div style={{ padding: '10px 0' }}><Icon type="paper-clip" />{this.state.editRecord.file_name}</div> : '' : ''}

                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const EidtDataForm = Form.create()(EidtData);

class EidtDataFormM extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            visible: false
        };
    }

    componentWillMount() {
        if (this.props.editObj && this.props.editObj.editRecord) {
            this.setState({
                visible: this.props.editObj.editModalVisible,
                editRecord: this.props.editObj.editRecord,
                evFlag: this.props.editObj.evFlag
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editObj && nextProps.editObj.editModalVisible !== this.state.visiblle) {
            this.setState({
                visible: nextProps.editObj.editModalVisible,
                editRecord: nextProps.editObj.editRecord,
                evFlag: nextProps.editObj.evFlag
            });
        }
    }

    handleOk = (e) => {
        this.refs.editData.validateFields((err, values) => {
            if (values.city) {
                if (values.city.length == 2) {
                    values.area = values.city[1];
                    values.city = values.city[0];
                } else {
                    values.area = '';
                    values.city = values.city[0];
                }
            }
            if (values.factor instanceof Array) {
                values.factor = values.factor.join(',');
            }
            values = Object.assign({}, this.state.editRecord, values);
            this.props.editOpt(values);
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
                    title={this.state.evFlag ? '报告详情' : '修改报告'}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={560}
                    footer={!this.state.evFlag ? [
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>确定</Button>
                    ] : null}
                >
                    <EidtDataForm {...this.props} ref="editData" recordObj={this.state} />
                </Modal>
            </div>
        )
    }
}

EidtDataFormM.propTypes = {
    queryOpt: React.PropTypes.func.isRequired,
    addOpt: React.PropTypes.func.isRequired
}

export default EidtDataFormM;