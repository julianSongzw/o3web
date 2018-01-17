/**
 * Created by zll on 2017/10/12.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Layout, message } from 'antd';

import styles from './index.css';
import logo from '../../public/images/mainLogo.png';
import * as act from '../../redux/actions/login';
import { MainMenu } from '../../utils/menu';
import { SideRoute, ContentRoute } from '../routes';
import PwdChangeFormM from '../components/systemManage/userManage/pwdChange';
const { Header } = Layout;

message.config({
    top: 50,
    duration: 1,
});
export class mainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            id: '',
            changeModalVisible: false
        };
        this.logOut = this.logOut.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.msgTip !== this.props.msgTip) {
            if (nextProps.msgTip.type === 0)
                message.success(nextProps.msgTip.msg);
            else if (nextProps.msgTip.type === 1) {
                if (nextProps.msgTip.msg == "Request failed with status code 401") {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('username');
                    this.props.history.push('/login');
                    message.error('登陆信息已过期，请重新登陆');
                } else {
                    message.error(nextProps.msgTip.msg);
                }
            }
        }
    }
    componentWillUpdate() {

    }

    componentWillMount() {
        if (localStorage.getItem('refresh')) {
            this.props.history.push('/main/monitor');
            localStorage.removeItem('refresh');
        }
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.beforeunload.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.beforeunload.bind(this));
    }

    beforeunload() {
        // localStorage.setItem('refresh', true);
    }

    render() {
        let platObj = this.props.platConfig ? this.props.platConfig.datas.length > 0 ? this.props.platConfig.datas[0] : {} : {};
        if (this.props.userInfo) {
            this.state.userName = this.props.userInfo.username;
        }

        return (
            <Layout style={{ width: '100%', height: '100%' }} >
                <Header style={{ height: '80px', backgroundColor: '#4a8de6', display: 'flex', justifyContent: 'space-between', padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', float: 'left' }}>
                        <img style={{ width: '76px', height: '76px', marginRight: '30px' }} src={!platObj ? logo : `http://${platObj.logo_url}`} />
                        <span style={{ whiteSpace: 'nowrap', height: '60px', color: '#f0f0f0', fontSize: '26px', fontWeight: 'bold', marginRight: '30px', letterSpacing: 10, textShadow: '0px 2px 6px #404040' }}
                        >{!platObj ? '蓝 盾 O3 立 体 监 测 分 析 平 台' : platObj.title}
                        </span>

                        <span style={{ whiteSpace: 'nowrap', height: '60px', color: 'white', fontSize: '10px' ,transform:'translate(-12px,12px)'}}>
                            {'欢迎您：' + this.state.userName}</span>
                    </div>
                    <div className="headMenu" style={{ display: 'flex', alignItems: 'center', flexDirection: "row", float: 'right' }}>
                        <MainMenu />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: 70, height: 70 }}>
                            <Button type="danger" title='修改密码' shape="circle" icon="edit" onClick={this.changePwd} />
                            <Button type="danger" title='退出登录' shape="circle" icon="logout" onClick={this.logOut} />
                        </div>
                    </div>
                </Header>
                <div style={{ width: '100%', display: 'flex', height: '100%' }} >
                    {
                        this.props.location.pathname !== '/main/monitor' ? <SideRoute /> : null
                    }
                    <div style={{ width: '100%', height: '100%' }}>
                        <ContentRoute />
                    </div>
                </div>
                {this.state.changeModalVisible ?
                    <PwdChangeFormM
                        {...this.props}
                        ref="addDataFormM"
                        userId={this.props.userInfo ? this.props.userInfo.id : ''}
                        changeModalVisible={this.state.changeModalVisible}
                        changeModalState={this.changeModalState.bind(this)}
                    /> : null}
            </Layout>
        );
    }

    changeModalState = () => {
        this.setState({
            changeModalVisible: false,
        });
    }

    changePwd = () => {
        this.setState({
            changeModalVisible: true,
        });
    }

    logOut() {
        this.props.history.push('/login');
    }
}


function mapStateToProps(state) {
    return {
        userInfo: state.Login.userInfo,
        msgTip: state.MsgTip,
        platConfig: state.Share.platConfig,

    }
}

function mapDispatchToProps(dispatch) {

    return {
        submitClick: (param) => {
            dispatch(act.loginSubmit(param))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(mainPage);

