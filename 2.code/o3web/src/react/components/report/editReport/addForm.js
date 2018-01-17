import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal, Cascader, Upload, message } from 'antd';
import styles from './searchForm.css';
import $ from "jquery"

class AddData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            uploading: false,
            fileNameList: []
        };
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
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='报告类型:'>
                                {getFieldDecorator('rtype', {
                                    initialValue: '',
                                    rules: [{
                                        required: false,
                                    }],
                                })(
                                    <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
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
                                    initialValue: '',
                                })(
                                    <Input size="small" placeholder='' style={{ display: 'inline-block', width: 130 }} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
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
                        <Col span={24}>
                            <FormItem {...formItemLayout} label='备注:'>
                                {getFieldDecorator('remark', {
                                    initialValue: '',
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
                <div>
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col span={10}>
                            <label htmlFor="" style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10px', color: 'rgba(0, 0, 0, 0.85)' }}>上传文件:</label>
                        </Col>
                        <Col span={12}>
                            <form className='fileForm' method="post" enctype="multipart/form-data">
                                <span style={{
                                    fontSize: 14, lineHeight: 1.5,
                                    color: 'rgba(0, 0, 0, 0.65)',
                                    boxSizing: 'border-box',
                                    margin: 0,
                                    padding: 0,
                                    listStyle: 'none',
                                    outline: 0
                                }} role='button'>
                                    <input type="file" name="pic" className='fileData' style={{ position: 'absolute', width: 100, height: 20, opacity: 0, zIndex: 99999 }} onChange={this.fileSubmit} />
                                    <Button type="submit" value="Submit"><Icon type="upload" />点击上传</Button>
                                </span>
                            </form>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col span={10}>
                        </Col>
                        <Col span={12}>
                            {this.state.fileNameList.length > 0 ?
                                this.state.fileNameList.map(function (item, index) {
                                    return (<div style={{ padding: '10px 0' }}><Icon type="paper-clip" />{item}</div>)
                                })
                                : null}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    fileSubmit = (e) => {
        e.preventDefault();
        let _self = this;
        var form = new FormData(document.querySelector('.fileForm'));
        let fileData = document.querySelector('.fileData');
        let fileNameList = new Array();
        if (fileData && fileData.files.length > 0) {
            for (let i = 0, len = fileData.files.length; i < len; i++) {
                fileNameList.push(fileData.files[i].name);
            }
            _self.setState({ fileNameList: fileNameList });
        }
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

    componentWillUnmount() {
        //重新 初始化 文件input数据
        let file = document.querySelector('.fileData');
        file.value = '';
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
                var form = new FormData(document.querySelector('.fileForm'));

                if (values.city) {
                    if (values.city.length == 2) {
                        values.area = values.city[1];
                        values.city = values.city[0];
                    } else {
                        values.area = '';
                        values.city = values.city[0];
                    }
                }
                form.append('area', values.area);
                form.append('city', values.city);
                form.append('rtype', values.rtype);
                form.append('name', values.name);
                form.append('remark', values.remark);
                form.append('user', localStorage.getItem('username'));
                $.ajax({
                    url: "http://192.168.10.139:4700/api/d_reports/add?access_token=" + localStorage.getItem('access_token') + '&username=' + localStorage.getItem('username'),
                    type: "post",
                    data: form,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        message.success('添加成功！');
                        _self.props.changeModalState();
                        _self.props.queryOpt();
                    },
                    error: function (e) {
                        message.error('添加失败！');
                    }
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
                    title='添加报告'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    width={560}
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