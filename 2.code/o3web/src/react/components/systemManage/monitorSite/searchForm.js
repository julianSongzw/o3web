/* 
 * @Title: $fileBasename 
 * @Description: Todo 
 * @Author: weijq@cychina.cn (韦继强) 
 * @Date: 2017-11-01 17:44:42 
 * @Last Modified by: weijq@cychina.cn (韦继强)
 * @Last Modified time: 2017-11-01 17:53:21
 * @Version:V1.0 
 * Company: 合肥安慧软件有限公司 
 * Copyright: Copyright (c) 2017' 
 */


import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, Cascader } from 'antd';

import styles from './searchForm.css';

const FormItem = Form.Item;
const Option = Select.Option;

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
        };
    }

    componentDidMount() {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let queryData = {
                    city: values.city,
                    area: values.area,
                    factor: values.factor,
                    user: values.user,
                    type: values.type,
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
                        values.area = '';
                        values.city = values.city[0];
                    }
                }
                let queryData = {
                    city: values.city,
                    area: values.area,                    
                    factor: values.factor,
                    user: values.user,
                    type: values.type,
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize
                }
                this.props.queryOpt(queryData);
            }
        })
    }

    onChange = () => {

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
                sm: { span: 12 },
            }
        };
        debugger;
        let siteType = this.props.siteType;
        // let siteTypeValue = siteType ? Object.keys(siteType) : [];

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
                        <FormItem label="类别:">
                            {getFieldDecorator('type')(
                                <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                    {siteType.length > 0 ? siteType.map(function (item, index) {
                                        console.log(item + '111' +index);
                                        return <Option key={index} value={item.name}>{item.value}</Option>
                                    }) : null}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="负责人:">
                            {getFieldDecorator('user')(
                                <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                    {this.props.userlist.length > 0 ? this.props.userlist.map(function (user, index) {
                                        return <Option key={index} value={user.id}>{user.name}</Option>
                                    }) : null}
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