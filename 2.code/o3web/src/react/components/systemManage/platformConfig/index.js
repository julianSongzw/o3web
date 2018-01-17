/**
 * weijq
 */

import React from 'react';
import styles from './index.css';
import { Form, Icon, Input, Button, Row, Col, Upload, Switch, message } from 'antd';
import $ from 'jquery';

const FormItem = Form.Item;

class platConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileNameList: []
        }
    }

    componentDidMount() {
        this.props.queryPlat();
    }

    componentWillReceiveProps(nextProps) {

    }

    formSubmit = (e) => {
        let _self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var form = new FormData(document.querySelector('.logoForm'));
                let fileData = document.querySelector('.logoFile');
                if(_self.state.fileNameList.length == 0){
                    message.warning('logo图片不能为空！');
                    return null;
                }
                form.append('title', values.title);
                form.append('english_title', values.english_title);
                form.append('is_english', values.is_english);
                form.append('version', values.version);
                form.append('right', values.right);
                $.ajax({
                    url: "http://192.168.10.139:4700/api/sys_platforms/add?access_token=" + localStorage.getItem('access_token') + '&username=' + localStorage.getItem('username'),
                    type: "post",
                    data: form,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        message.success('添加成功！');
                    },
                    error: function (e) {
                        message.error('添加失败！');
                    }
                })
            }
        });
    }

    fileSubmit = (e) => {
        e.preventDefault();
        let _self = this;
        let fileData = document.querySelector('.logoFile');
        let fileNameList = new Array();
        if (fileData && fileData.files.length > 0) {
            for (let i = 0, len = fileData.files.length; i < len; i++) {
                fileNameList.push(fileData.files[i].name);
            }
            _self.setState({ fileNameList: fileNameList });
        }
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const itemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            }
        };

        let platObj = this.props.platConfig ? this.props.platConfig.list.datas.length > 0 ? this.props.platConfig.list.datas[0] : {} : {};
        return (
            <div className={styles.formContent} >
                <h2 className={styles.platHeader}>平台信息配置</h2>
                <Form ref='formData' style={{ paddingTop: 40,display:'flex',flexDirection:'column',alignContent:'space-around' }} >

                    <FormItem {...itemLayout} label="系统标题:">
                        {getFieldDecorator('title', {
                            initialValue: platObj ? platObj.title : '',
                            rules: [{ required: false, message: '系统标题!' }],
                        })(
                            <Input placeholder="系统标题" />
                            )}
                    </FormItem>
                    <FormItem {...itemLayout} label="英文标题:">
                        {getFieldDecorator('english_title', {
                            initialValue: platObj ? platObj.english_title : '',                            
                            rules: [{ required: false, message: '英文标题!' }],
                        })(
                            <Input placeholder="英文标题" />
                            )}
                    </FormItem>
                    <FormItem {...itemLayout} label="启用英文标题:">
                        {getFieldDecorator('is_english', {
                            initialValue: platObj ? platObj.is_english : false,
                            rules: [{ required: false, message: '启用英文标题!' }],
                        })(
                            <Switch checkedChildren="启用" unCheckedChildren="不启用" />
                            )}
                    </FormItem>
                    <FormItem {...itemLayout} label="系统版本:">
                        {getFieldDecorator('version', {
                            initialValue: platObj ? platObj.version : '',
                            rules: [{ required: false, message: '系统版本!' }],
                        })(
                            <Input placeholder="系统版本" />
                            )}
                    </FormItem>
                    <FormItem {...itemLayout} label="系统版权:">
                        {getFieldDecorator('right', {
                            initialValue: platObj ? platObj.right : '',
                            rules: [{ required: false, message: '系统版权!' }],
                        })(
                            <Input placeholder="系统版权" />
                            )}
                    </FormItem>
                </Form>
                <div style={{ paddingBottom: 20 }}>
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col span={8}>
                            <label htmlFor="" style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '10px', color: 'rgba(0, 0, 0, 0.85)' }}>上传文件:</label>
                        </Col>
                        <Col span={12}>
                            <form className='logoForm' method="post" enctype="multipart/form-data">
                                <span style={{
                                    fontSize: 14, lineHeight: 1.5,
                                    color: 'rgba(0, 0, 0, 0.65)',
                                    boxSizing: 'border-box',
                                    margin: 0,
                                    padding: 0,
                                    listStyle: 'none',
                                    outline: 0
                                }} role='button'>
                                    <input type="file" name="pic" className='logoFile' accept="image/*" style={{ position: 'absolute', width: 100, height: 20, opacity: 0, zIndex: 99999 }} onChange={this.fileSubmit} />
                                    <Button type="submit" value="Submit"><Icon type="upload" />点击上传</Button>
                                </span>
                            </form>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Col span={8}>
                        </Col>
                        <Col span={12}>
                            {this.state.fileNameList.length > 0 ?
                                this.state.fileNameList.map(function (item, index) {
                                    return (<div style={{ padding: '10px 0' }} key={index}><Icon type="paper-clip" />{item}</div>)
                                })
                                : null}
                        </Col>
                    </Row>
                </div>
                <div className={styles.divButton}>
                    <Button type="primary" htmlType="submit" onClick={this.formSubmit.bind(this)} style={{width:'41%',transform:'translateX(10%)'}}>提交</Button>
                </div>
            </div>
        );

    }
}

platConfig.propTypes = {
    submitClick: React.PropTypes.func.isRequired
}

const platConfigForm = Form.create()(platConfig);

export default platConfigForm;