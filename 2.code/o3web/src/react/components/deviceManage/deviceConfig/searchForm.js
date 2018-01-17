import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, DatePicker, TimePicker, } from 'antd';

import styles from './searchForm.css';

const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
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
                let queryData = {
                    name: values.name,
                    code: values.code,
                    site: values.site,
                    otype: values.otype,
                    factor: values.factor,
                    union_gk: values.union_gk,
                    union_sk: values.union_sk,
                    union_cg: values.union_cg,
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
                let queryData = {
                    name: values.name,
                    code: values.code,
                    site: values.site,
                    otype: values.otype,
                    factor: values.factor,
                    union_gk: values.union_gk,
                    union_sk: values.union_sk,
                    union_cg: values.union_cg,
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
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            }
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
            } else if (siteArr[i].type == "2") {
                c_k_d.push(siteArr[i])
            }
        }

        return (
            <div className={styles.serchPanel}>
                <Form layout="inline" onSubmit={this.formSubmit}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flexGrow: 12 }}>
                            <Row gutter={8} style={{ width: '100%' }}>
                                <Col span={6}>
                                    <FormItem {...itemLayout} label="设备名称:">
                                        {getFieldDecorator('name')(
                                            <Input size="small" style={{ display: 'inline-block', width: 130 }} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...itemLayout} label="设备编号:">
                                        {getFieldDecorator('code')(
                                            <Input size="small" style={{ display: 'inline-block', width: 130 }} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...itemLayout} label="所属监测点:">
                                        {getFieldDecorator('site')(
                                            <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                                {this.props.msList.length > 0 ? this.props.msList.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                                ) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...itemLayout} label="类型:">
                                        {getFieldDecorator('otype')(
                                            <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                                {this.props.devTypeList.length > 0 ? this.props.devTypeList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                                ) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...itemLayout} label="监测因子:">
                                        {getFieldDecorator('factor')(
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
                                <Col span={6} style={{ transform: 'translateX(-4px)' }}>
                                    <FormItem {...itemLayout} label='关联国控点:'>
                                        {getFieldDecorator('union_gk')(
                                            <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                                {g_k_d.length > 0 ? g_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                                ) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...itemLayout} label='关联省控点:'>
                                        {getFieldDecorator('union_sk')(
                                            <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                                {s_k_d.length > 0 ? s_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                                ) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ transform: 'translateX(-14px)' }}>
                                    <FormItem {...itemLayout} label='关联常规站:'>
                                        {getFieldDecorator('union_cg')(
                                            <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                                {c_k_d.length > 0 ? c_k_d.map(function (item, index) { return <Option value={item.code} key={index}>{item.name}</Option> }
                                                ) : null}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>

                            </Row>
                        </div>
                        <div style={{ display:'flex',alignItems:'flex-end',flexGrow: 1 }}>
                            <Button type='primary' size="small" htmlType='submit'>查询</Button>
                        </div>
                    </div>
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