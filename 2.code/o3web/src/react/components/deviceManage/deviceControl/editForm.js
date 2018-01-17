import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Modal } from 'antd';
import moment from 'moment';

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
            labelCol: { span: 10 },
            wrapperCol: { span: 12 },
        };
        let devName = '';
        let ctype = '';
        if (this.state.editRecord && this.state.editRecord.code) {
            // debugger;
            let dev = this.props.deviceList ? this.props.deviceList.find(dev => this.state.editRecord.code == dev.code) : null;
            devName = dev ? dev.name : this.state.editRecord.code;
        }
        if (this.state.editRecord && this.state.editRecord.ctype) {
            let type = this.props.cTypeList ? this.props.cTypeList.find(type => this.state.editRecord.ctype == type.name) : null;
            ctype = type ? type.value : this.state.editRecord.ctype;
        }

        return (
            <div>
                <Form
                    onSubmit={this.handleAddSbumit}
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={24}>
                            <FormItem  {...formItemLayout} label="设备名称:">
                                {devName}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...formItemLayout} label="设备编码:">
                                {this.state.editRecord ? this.state.editRecord.code : ''}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...formItemLayout} label="质控类型:">
                                {ctype}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...formItemLayout} label="质控时间:">
                                {this.state.editRecord ? this.state.editRecord.ctime ? moment(this.state.editRecord.ctime).format('YYYY-MM-DD HH:mm:ss') : '--' : '--'}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...formItemLayout} label="质控人:">
                                {this.state.editRecord ? this.state.editRecord.user : ''}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...formItemLayout} label="质控类型:">
                                {ctype}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...psLayout} label='质控参数:'>
                                {this.state.editRecord ? this.state.editRecord.ps : ''}
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

    handleCancel = () => {
        this.props.changeModalState();
    }

    render() {
        return (
            <div>
                <Modal
                    title={'查看质控信息'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
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
}

export default EidtDataFormM;