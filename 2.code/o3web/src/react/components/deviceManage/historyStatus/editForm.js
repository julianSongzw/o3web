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
            labelCol: { span: 5 },
            wrapperCol: { span: 12 },
        };

        let defaultType = ''

        if (this.state.editRecord && this.state.editRecord.gtype) {
            let devType = this.props.defaultTypeList ? this.props.defaultTypeList.find(type => this.state.editRecord.gtype == type.name) : null;
            defaultType = devType.value;
        }
        return (
            <div>
                <Form
                    onSubmit={this.handleAddSbumit}
                    style={{ padding: '10px 10px 0 10px' }}>
                    <Row gutter={12} style={{ width: '100%' }}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='设备编码:'>
                                {this.state.editRecord ? this.state.editRecord.code : '--'}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formItemLayout} label="设备状态:">
                                {this.state.editRecord ? this.state.editRecord.state ? '在线' : '离线' : '--'}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <FormItem {...formItemLayout} label='故障类型:'>
                                {this.state.editRecord ? defaultType : '--'}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='开始时间:'>
                                {this.state.editRecord ? this.state.editRecord.time_ks ? moment(this.state.editRecord.time_ks).format('YYYY-MM-DD HH:mm:ss') : '--' : '--'}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label='结束时间:'>
                                {this.state.editRecord ? this.state.editRecord.time_js ? moment(this.state.editRecord.time_js).format('YYYY-MM-DD HH:mm:ss') : '--' : '--'}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem  {...psLayout} label='描述:'>
                                {this.state.editRecord ? this.state.editRecord.remark : '--'}
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
            console.log('handleOk666666666');
            if (!err) {
                this.props.addOpt(values);
                this.setState({
                    visible: false
                });
                this.props.changeModalState();
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
                    title={this.state.evFlag ? '查看日志' : '修改字典'}
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
}

export default EidtDataFormM;