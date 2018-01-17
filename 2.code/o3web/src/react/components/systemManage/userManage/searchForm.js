import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Radio, Cascader } from 'antd';

import styles from './searchForm.css';

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
                    username: values.username,
                    flag: values.flag,
                    duties:values.duties,
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
                    username: values.username,
                    flag: values.flag,
                    duties:values.duties,                    
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize
                }
                this.props.queryOpt(queryData);
            }
        })
    }


    render() {

        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const RadioGroup = Radio.Group;
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
                        <FormItem {...itemLayout} label="用户名:">
                            {getFieldDecorator('username')(
                                <Input size="small" style={{ display: 'inline-block', width: 130 }} />
                            )}
                        </FormItem>
                        <FormItem {...itemLayout} label="职称:">
                            {getFieldDecorator('duties')(
                                <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                    {this.props.durList.length ? this.props.durList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                    ) : null}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="城市/区域:">
                            {getFieldDecorator('city')(
                                <Cascader size="small" options={this.props.areaOptions} placeholder='' changeOnSelect />
                            )}
                        </FormItem>
                        <FormItem {...itemLayout} label="登录权限:">
                            {getFieldDecorator('flag', {
                                initialValue: '1'
                            })(
                                <RadioGroup style={{ display: 'inline-block', width: 130 }}>
                                    <Radio value={'1'}>有</Radio>
                                    <Radio value={'0'}>无</Radio>
                                </RadioGroup>
                                )}
                        </FormItem>
                        <FormItem>
                            <Button type='primary' size="small" htmlType='submit'>查询</Button>
                        </FormItem>
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