import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Radio, DatePicker } from 'antd';

import styles from './searchForm.css';

class AddData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
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
        return (
            <div>
                <Form
                    onSubmit={this.handleAddSbumit}
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='设备编码:'>
                                {getFieldDecorator('code', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: true, message: '站点编码!',
                                    }],
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label="设备名称:">
                                {getFieldDecorator('name', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: true, message: '请输入内容!'
                                    }]
                                })(
                                    <Input placeholder="必填" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>

                        <Col span={8}>
                            <FormItem {...formItemLayout} label='设备类别:'>
                                {getFieldDecorator('otype', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: true, message: '必填'
                                    }],
                                })(
                                    <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                        {this.props.devTypeList.length > 0 ? this.props.devTypeList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='所属监测点:'>
                                {getFieldDecorator('site', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {this.props.msList.length > 0 ? this.props.msList.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='规格型号:'>
                                {getFieldDecorator('spec', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: '请输入违法描述!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='安装时间:'>
                                {getFieldDecorator('time_az', {
                                    rules: [{
                                        required: false, message: '负责人!',
                                    }],
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="安装时间"
                                        size="small"
                                        style={{ width: 130 }}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='经度:'>
                                {getFieldDecorator('longitude', {
                                    initialValue: '', rules: [{
                                        required: false,
                                    }, {
                                        pattern: /^\d+(\.\d+)?$/,
                                        message: '数字'
                                    }],
                                })(
                                    <Input placeholder="最多4位小数位" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='纬度:'>
                                {getFieldDecorator('latitude', {
                                    initialValue: '', rules: [{
                                        required: false,
                                    }, {
                                        pattern: /^\d+(\.\d+)?$/,
                                        message: '数字'
                                    }],
                                })(
                                    <Input placeholder="最多4位小数位" size='small' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
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
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='通信IP:'>
                                {getFieldDecorator('ip', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: 'ip!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='通信PORT:'>
                                {getFieldDecorator('port', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: 'port!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='时间间隔:'>
                                {getFieldDecorator('time', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: 'time!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label="扫描功能:">
                                {getFieldDecorator('scan', {
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
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='扫描距离:'>
                                {getFieldDecorator('scan_dis', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: 'time!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} label='扫描分辨率:'>
                                {getFieldDecorator('scan_pix', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: 'time!',
                                    }],
                                })(
                                    <Input placeholder="" size='small' />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='关联国控点:'>
                                {getFieldDecorator('union_gk', {
                                    initialValue:'',
                                    rules: [{
                                        required: false, message: '关联国控点!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {g_k_d.length > 0 ? g_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='关联省控点:'>
                                {getFieldDecorator('union_sk', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: '关联省控点!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                        {s_k_d.length > 0 ? s_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                        ) : null}
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label='关联常规站:'>
                                {getFieldDecorator('union_cg', {
                                    initialValue:'',                                    
                                    rules: [{
                                        required: false, message: '关联常规站!',
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
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
                if (values.time_az) {
                    values.time_az = values.time_az.format('X') * 1000;
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
                    title='添加设备'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={860}
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