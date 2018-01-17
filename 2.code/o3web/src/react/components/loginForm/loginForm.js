/**
 * Created by zll on 2017/10/11.
 */
import React from 'react';
import styles from './loginForm.css';
import logImg from "../../../public/images/landun_logo.png";
import { Form, Icon, Input, Button, Checkbox, Tooltip } from 'antd';
const FormItem = Form.Item;

class LoginF extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loginFlag: 0,
        };
        //this.handleSubmit=this.handleSubmit.bind(this);
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        if (this.state.loading) {
            ///登录成功
            if (nextProps.loginRet === 0) {
                debugger;
                nextProps.location.pathname = '/main/monitor';
                nextProps.history.push(nextProps.location);

                // //请求数据字典
                this.props.querySysdic();
                this.props.queryArea();
                this.props.queryFactor();
                this.props.queryMonitorSite();
                this.props.factorColorListQuery();
                //区域关联监测点组
                this.props.queryMonitorSiteGroup();
                //ws实时信息
                let wsUrl = "ws://" +localStorage.getItem('wsUrl');
                // debugger;
                this.props.conWebSocket(wsUrl);

            }
            else {
                this.setState({
                    loading: false,
                    loginFlag: nextProps.loginRet
                });
            }
        }


    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    username: values.userName,
                    password: values.password
                };
                this.setState({
                    loading: true,
                    loginFlag: 0
                });
                this.props.submitClick(param);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        let platObj = this.props.platConfig ? this.props.platConfig.list.datas.length > 0 ? this.props.platConfig.list.datas[0] : {} : {};

        return (

            <div className={styles.formLogin}>
                <div className={styles.header}>
                    <img src={!platObj ? logImg : `http://${platObj.logo_url}`} className={styles.hImg} />
                    <span className={styles.hTitle}>
                        {!platObj ? 'O3立体监测分析平台' : platObj.title}
                    </span>
                </div>

                <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>记住密码</Checkbox>
                            )}
                        <Button type="primary" htmlType="submit" className={styles.loginFormButton} loading={this.state.loading}>
                            登陆
                        </Button>
                        <div style={{ display: this.state.loginFlag > 0 ? 'block' : 'none' }}>
                            <Tooltip title="登录失败" >
                                <span style={{ color: "red" }}>用户名密码不匹配.</span>
                            </Tooltip>
                        </div>
                    </FormItem>
                </Form>
            </div>

        );
    }
}
LoginF.propTypes = {
    submitClick: React.PropTypes.func.isRequired
};

const LoginForm = Form.create()(LoginF);
export default LoginForm;






