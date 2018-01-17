import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Cascader } from 'antd';

import styles from './searchForm.css';
import { config } from './../../../../utils/config';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10
        };
    }

    componentDidMount() {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.city) {
                    if (values.city.length == 2) {
                        values.area = values.city[1];
                        values.city = values.city[0];
                    } else {
                        values.area = 'undefined';
                        values.city = values.city[0];
                    }
                }
                let queryData = {
                    city: values.city,
                    area: values.area,
                    code: values.code,
                    name: values.name,
                    rtype: values.rtype,
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize
                }
                this.props.queryOpt(queryData);
            }
        })
    }

    formSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.city) {
                    if (values.city.length == 2) {
                        values.area = values.city[1];
                        values.city = values.city[0];
                    } else {
                        values.area = 'undefined';
                        values.city = values.city[0];
                    }
                }
                let queryData = {
                    city: values.city,
                    area: values.area,
                    code: values.code,
                    name: values.name,
                    rtype: values.rtype,
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize
                }
                this.props.queryOpt(queryData);
            }
        })
    }

    exportData() {
        var form = document.querySelector('#form');
        var input = document.querySelector('.data');
        var value = this.props.form.getFieldsValue();
        if (value.city) {
            if (value.city.length == 2) {
                value.area = value.city[1];
                value.city = value.city[0];
            } else {
                value.area = 'undefined';
                value.city = value.city[0];
            }
        }
        var data = {
            code: value.code || "",
            name: value.name || "",
            rtype: value.rtype || "",
            city: value.city || "",
            area: value.area || "",
        };
        input.value = JSON.stringify(data);
        form.submit();


    }


    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const itemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            }
        };

        return (
            <div className={styles.serchPanel}>
                <Form layout="inline" onSubmit={this.formSubmit}>
                    <Row gutter={8} >
                        <FormItem label="报告编号:">
                            {getFieldDecorator('code')(
                                <Input size="small" placeholder='' />
                            )}
                        </FormItem>
                        <FormItem label="报告名称:">
                            {getFieldDecorator('name')(
                                <Input size="small" placeholder='' />
                            )}
                        </FormItem>
                        <FormItem label='报告类型:'>
                            {getFieldDecorator('rtype', {
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
                        <FormItem label="城市/区域:">
                            {getFieldDecorator('city')(
                                <Cascader size="small" options={this.props.areaOptions} placeholder='' changeOnSelect />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type='primary' size="small" htmlType='submit'>查询</Button>
                        </FormItem>
                        <form action={`${config.baseURL}/api/d_reports/searchDownload?access_token=${localStorage.getItem('access_token')}&username=${localStorage.getItem('username')}`}
                            style={{ display: "inline-block", marginLeft: 30 }}
                            id="form"
                            target="_blank"
                            method="post"
                        >
                            <Button size='small' target="_blank" htmlType="button" type="primary" style={{ marginRight: 20 ,marginTop:6}} onClick={this.exportData.bind(this)}>
                                全部导出
                        </Button>
                            <input type="text" hidden="hidden" name="id" className="data" />
                        </form>
                    </Row>
                </Form>
            </div>

        )
    }
}

Search.propTypes = {
    queryOpt: React.PropTypes.func.isRequired
}

const SearchForm = Form.create()(Search);

export default SearchForm;