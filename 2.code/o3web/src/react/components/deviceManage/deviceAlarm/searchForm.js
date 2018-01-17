import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select, DatePicker, TimePicker, } from 'antd';

import styles from './searchForm.css';

const FormItem = Form.Item;
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
                let logTime_Start;
                let logTime_End;
                if (Object.prototype.toString.call(values.timestamp) == '[object Array]') {
                    values.logTime_Start = values.timestamp[0] ? values.timestamp[0].format('X') * 1000 : null;
                    values.logTime_End = values.timestamp.length == 2 ? values.timestamp[1].format('X') * 1000 : null;
                }
                let queryData = {
                    code: values.code,
                    factor: values.factor,
                    atype: values.atype,
                    atime_start: values.logTime_Start,
                    atime_end: values.logTime_End,
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
                    factor: values.factor,
                    atype: values.atype,
                    atime_start: values.logTime_Start,
                    atime_end: values.logTime_End,
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
                    <Row>
                        <FormItem label="设备编号:">
                            {getFieldDecorator('code')(
                                <Input placeholder="设备编号" size='small' style={{ display: 'inline-block', width: 130 }} />
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
                        <FormItem label="报警类型:">
                            {getFieldDecorator('atype')(
                                <Select size="small" allowClear style={{ display: 'inline-block', width: 130 }}>
                                    {this.props.aTypeList.length > 0 ? this.props.aTypeList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                    ) : null}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="报警时间"
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