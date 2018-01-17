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
                let queryData = {
                    code: values.code,
                    state: values.state,
                    gtype: values.gtype,
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
                    code: values.code,
                    state: values.state,
                    gtype: values.gtype,
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

        return (
            <div className={styles.serchPanel}>
                <Form layout="inline" onSubmit={this.formSubmit}>
                    <Row gutter={8} >
                        <FormItem label="设备编号:">
                            {getFieldDecorator('code')(
                                <Input placeholder="设备编号" size='small' style={{ display: 'inline-block', width: 130 }} />
                            )}
                        </FormItem>
                        <FormItem label="设备状态:">
                            {getFieldDecorator('state')(
                                <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                    <Option value={'0'} key={'0'}>离线</Option>
                                    <Option value={'1'} key={'1'}>在线</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="故障类型"
                        >
                            {getFieldDecorator('gtype')(
                                <Select size="small" style={{ display: 'inline-block', width: 130 }} allowClear>
                                    {this.props.defaultTypeList.length ? this.props.defaultTypeList.map(function (item, index) { return <Option value={item.name} key={index}>{item.value}</Option> }
                                    ) : null}
                                </Select>
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