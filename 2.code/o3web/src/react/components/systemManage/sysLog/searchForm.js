import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, DatePicker, TimePicker, } from 'antd';

import styles from './searchForm.css';

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker; 
const Option = Select.Option;
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
                    values.logTime_Start = values.timestamp[0].format('X') * 1000;
                    values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
                }
                let queryData = {
                    type: values.type,
                    logTime_Start: values.logTime_Start,
                    logTime_End: values.logTime_End,
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
                    values.logTime_Start = values.timestamp[0].format('X') * 1000;
                    values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
                }
                let queryData = {
                    type: values.type,
                    logTime_Start: values.logTime_Start,
                    logTime_End: values.logTime_End,
                    pageIndex: this.state.pageIndex,
                    pageSize: this.state.pageSize
                }
                this.props.queryOpt(queryData);
            }
        })
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

        return (
            <div className={styles.serchPanel}>
                <Form layout="inline" onSubmit={this.formSubmit}>
                    <Row gutter={8} >
                        <FormItem {...itemLayout} label="日志类型:">
                            {getFieldDecorator('type')(
                                <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                    <Option value={'0'} key={'0'}>登陆日志</Option>
                                    <Option value={'1'} key={'1'}>操作日志</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="操作时间"
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