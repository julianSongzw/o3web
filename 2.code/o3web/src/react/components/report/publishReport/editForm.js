import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal ,Cascader} from 'antd';

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
                    onSubmit={this.handleAddSbumit}
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='监测因子:'>
                                {getFieldDecorator('factor', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.factor : '',
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
                            <FormItem {...formItemLayout} label='最小值:'>
                                {getFieldDecorator('minv', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.minv : '',
                                    rules: [{
                                        required: true, message: '最小值!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="最大值 :">
                                {getFieldDecorator('maxv', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.maxv : '',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='季度:'>
                                {getFieldDecorator('season', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.season+'' : '',
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        <Option key={'0'} value="0">第一季度</Option>
                                        <Option key={'1'} value="1">第二季度</Option>
                                        <Option key={'2'} value="2">第三季度</Option>
                                        <Option key={'3'} value="3">第四季度</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
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
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='持续时间:'>
                                {getFieldDecorator('dur', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.dur : '',
                                    rules: [{
                                        required: false, message: '持续时间!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130, position: 'relative', top: 5 }} addonAfter='s' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label='平均值:'>
                                {getFieldDecorator('avg', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.avg : '',
                                    rules: [{
                                        required: false, message: '平均值!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label='百分点限值:'>
                                {getFieldDecorator('Per100', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.Per100 : '',
                                    rules: [{
                                        required: false, message: '百分点限值!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130, position: 'relative', top: 5 }} addonAfter='%' disabled={this.state.evFlag} />
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
                    title={this.state.evFlag ? '查看报警配置' : '修改报警配置'}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
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