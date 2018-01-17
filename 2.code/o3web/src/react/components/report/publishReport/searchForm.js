import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Cascader } from 'antd';

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
                    factor: values.factor,
                    season: values.season,
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
                    factor: values.factor,
                    season: values.season,
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
                        <FormItem label="城市/区域:">
                            {getFieldDecorator('city')(
                                <Cascader size="small" options={this.props.areaOptions} placeholder='' changeOnSelect />
                            )}
                        </FormItem>
                        <FormItem label="监测因子:">
                            {getFieldDecorator('factor')(
                                <Select mode="multiple" size="small" allowClear style={{ display: 'inline-block', width: 180 }}>
                                    {
                                        this.props.factor ? this.props.factor.map(function (item, index) {
                                            return <Option key={index} value={item.fcode}>{item.fname}</Option>
                                        }) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='季度:'>
                            {getFieldDecorator('season', {
                                rules: [{
                                    required: false,
                                }],
                            })(
                                <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                    <Option key={'0'} value="0">第一季度</Option>
                                    <Option key={'1'} value="1">第二季度</Option>
                                    <Option key={'2'} value="2">第三季度</Option>
                                    <Option key={'3'} value="3">第四季度</Option>
                                </Select>
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