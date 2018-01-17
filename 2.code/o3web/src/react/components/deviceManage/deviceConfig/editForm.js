import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Radio, DatePicker } from 'antd';
import moment from 'moment';

import styles from './searchForm.css';

const RadioGroup = Radio.Group;

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
        //国控点
        let g_k_d = new Array();
        //国控点
        let s_k_d = new Array();
        //国控点        
        let c_k_d = new Array();
        let siteArr = this.props.msList.clone();
        //监测点分类
        for (let i = 0, len = siteArr.length; i < len; i++) {
            if (siteArr[i].type == "0") {
                g_k_d.push(siteArr[i]);
            } else if (siteArr[i].type == "1") {
                s_k_d.push(siteArr[i]);
            } else if (siteArr[i].type == "3") {
                c_k_d.push(siteArr[i])
            }
        }

        let factorTemp = Object.assign({}, this.state.editRecord);
        let factorArr = factorTemp.factor ? factorTemp.factor.split(',') : [];
        return (
            <div>
                <Form
                    onSubmit={this.handleAddSbumit}
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='设备编码:'>
                                {getFieldDecorator('code', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.code : '',
                                    rules: [{
                                        required: true, message: '站点编码!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label="设备名称:">
                                {getFieldDecorator('name', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.name : '',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>

                        <Col span={8}>
                            <FormItem {...formItemLayout} label='设备类别:'>
                                {getFieldDecorator('otype', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.otype : '',
                                    rules: [{
                                        required: true, message: '必填'
                                    }],
                                })(
                                    <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear disabled={this.state.evFlag}>
                                        {this.props.devTypeList.length > 0 ? this.props.devTypeList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='所属监测点:'>
                                {getFieldDecorator('site', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.site : '',
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        {this.props.msList.length > 0 ? this.props.msList.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='规格型号:'>
                                {getFieldDecorator('spec', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.spec : '',
                                    rules: [{
                                        required: false, message: '请输入违法描述!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='安装时间:'>
                                {getFieldDecorator('time_az', {
                                    initialValue: this.state.editRecord ? moment(this.state.editRecord.time_az) : '',
                                    rules: [{
                                        required: false, message: '安装时间!',
                                    }],
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="安装时间"
                                        size="small"
                                        style={{ width: 130 }}
                                        disabled={this.state.evFlag}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='经度:'>
                                {getFieldDecorator('longitude', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.longitude : '',
                                    rules: [{
                                        required: false,
                                    }, {
                                        pattern: /^\d+(\.\d+)?$/,
                                        message: '数字'
                                    }],
                                })(
                                    <Input placeholder="最多4位小数位" size='small' style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='纬度:'>
                                {getFieldDecorator('latitude', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.latitude : '',
                                    rules: [{
                                        required: false, message: '纬度!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='监测因子:'>
                                {getFieldDecorator('factor', {
                                    initialValue: factorArr,
                                    rules: [{
                                        required: false,
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
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='通信IP:'>
                                {getFieldDecorator('ip', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.ip : '',
                                    rules: [{
                                        required: false, message: 'ip!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='通信PORT:'>
                                {getFieldDecorator('port', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.port : '',
                                    rules: [{
                                        required: false, message: 'port!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='时间间隔:'>
                                {getFieldDecorator('time', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.time : '',
                                    rules: [{
                                        required: false, message: 'time!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label="扫描功能:">
                                {getFieldDecorator('scan', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.scan + '' : '0',
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <RadioGroup style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        <Radio value={'0'}>无</Radio>
                                        <Radio value={'1'}>有</Radio>
                                    </RadioGroup>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='扫描距离:'>
                                {getFieldDecorator('scan_dis', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.scan_dis : '',
                                    rules: [{
                                        required: false, message: 'time!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='扫描分辨率:'>
                                {getFieldDecorator('scan_pix', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.scan_pix : '',
                                    rules: [{
                                        required: false, message: 'scan_pix!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' disabled={this.state.evFlag} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='关联国控点:'>
                                {getFieldDecorator('union_gk', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.union_gk : '',
                                    rules: [{
                                        required: false, message: '关联国控点!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        {g_k_d.length > 0 ? g_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='关联省控点:'>
                                {getFieldDecorator('union_sk', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.union_sk : '',
                                    rules: [{
                                        required: false, message: '关联省控点!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        {s_k_d.length > 0 ? s_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='关联常规站:'>
                                {getFieldDecorator('union_cg', {
                                    initialValue: this.state.editRecord ? this.state.editRecord.union_cg : '',
                                    rules: [{
                                        required: false, message: '关联常规站!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }} disabled={this.state.evFlag}>
                                        {c_k_d.length > 0 ? c_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
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
            if (!err) {
                if (values.time_az) {
                    values.time_az = values.time_az.format('X') * 1000;
                }
                // debugger;
                if (values.factor instanceof Array) {
                    values.factor = values.factor.join(',');
                }
                values = Object.assign({}, this.state.editRecord, values);
                this.props.editOpt(values);
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
                    title={this.state.evFlag ? '查看设备' : '修改设备'}
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