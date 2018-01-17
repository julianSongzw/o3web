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
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='站点编码:'>
                                {getFieldDecorator('code', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.code ? this.state.editRecord.code : '' : '',
                                    rules: [{
                                        required: true, message: '站点编码!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="站点名称:">
                                {getFieldDecorator('name', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.name ? this.state.editRecord.name : '' : '',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem {...formItemLayout} label='站点类别:'>
                                {getFieldDecorator('type', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.type ? this.state.editRecord.type : '' : '',
                                    rules: [{
                                        required: true, message: '必填'
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
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
                                    initialValue: initCity,
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Cascader size="small" options={this.props.areaOptions} placeholder='' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='经度:'>
                                {getFieldDecorator('longitude', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.longitude ? this.state.editRecord.longitude : '' : '',
                                    rules: [{
                                        required: false, message: '请输入合法经度!',
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
                                    initialValue: this.state.editRecord ? this.state.editRecord.latitude ? this.state.editRecord.latitude : '' : '',
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
                                    initialValue: factorArr,
                                    rules: [{
                                        required: false, message: '监测因子!',
                                    }],
                                })(
                                    <Select mode="multiple" size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
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
                                    initialValue: this.state.editRecord ? this.state.editRecord.user ? this.state.editRecord.user : '' : '',
                                    rules: [{
                                        required: false, message: '负责人!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
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
                                    initialValue: this.state.editRecord ? this.state.editRecord.remark ? this.state.editRecord.remark : '' : '',
                                    rules: [{
                                        required: false, message: '简介!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' type="textarea" disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
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
        let _self = this;
        this.refs.editData.validateFields((err, values) => {
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
                if (values.factor instanceof Array) {
                    values.factor = values.factor.join(',');
                }
                values = Object.assign({}, _self.state.editRecord, values);
                _self.props.editOpt(values);
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
                    title={this.state.evFlag ? '查看监测站点' : '修改监测站点'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={760}
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