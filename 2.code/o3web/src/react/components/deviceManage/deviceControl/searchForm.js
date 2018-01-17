import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, TimePicker, DatePicker } from 'antd';

import styles from './searchForm.css';

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
                let logTime_Start;
                let logTime_End;
                if (Object.prototype.toString.call(values.timestamp) == '[object Array]') {
                    values.logTime_Start = values.timestamp[0] ? values.timestamp[0].format('X') * 1000 : null;
                    values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
                }
                let queryData = {
                    code: values.code,
                    ctype: values.ctype,
                    result: values.result,
                    ctime_start: values.logTime_Start,
                    ctime_end: values.logTime_End,
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
                let logTime_Start;
                let logTime_End;
                if (Object.prototype.toString.call(values.timestamp) == '[object Array]') {
                    values.logTime_Start = values.timestamp[0] ? values.timestamp[0].format('X') * 1000 : null;
                    values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
                }
                let queryData = {
                    code: values.code,
                    ctype: values.ctype,
                    result: values.result,
                    ctime_start: values.logTime_Start,
                    ctime_end: values.logTime_End,
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
                        <FormItem label="设备编号:">
                            {getFieldDecorator('code')(
                                <Input placeholder="设备编号" size='small' style={{ display: 'inline-block', width: 130 }} />
                            )}
                        </FormItem>
                        <FormItem label="质控类型"
                        >
                            {getFieldDecorator('ctype')(
                                <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                    {this.props.cTypeList.length ? this.props.cTypeList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                    ) : null}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="质控评价"
                        >
                            {getFieldDecorator('result')(
                                <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                    <Option value='2'>成功</Option>
                                    <Option value='0'>失败</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="质控时间"
                        >
                            {getFieldDecorator('timestamp')(
                                <RangePicker
                                    size='small'
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder={['开始时间', '结束时间']}
                                    allowClear
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type='primary' size="small" htmlType='submit' className={styles.queryBtn}>查询</Button>
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