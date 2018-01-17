import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Select } from 'antd';

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
                let queryData = {
                    type_code: values.type_code,
                    type_name: values.type_name,
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
                    type_code: values.type_code,
                    type_name: values.type_name,
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
                        <FormItem {...itemLayout} label="类型代码:">
                            {getFieldDecorator('type_code')(
                                <Input size="small" style={{ display: 'inline-block', width: 130 }} />
                            )}
                        </FormItem>
                        <FormItem {...itemLayout} label="类型名称:">
                            {getFieldDecorator('type_name')(
                               <Input size="small" style={{ display: 'inline-block', width: 130 }} />
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