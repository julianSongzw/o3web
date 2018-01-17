/**
 * Created by zll on 2017/10/11.
 */
import React from 'react';
import { connect } from 'react-redux';
import { message} from 'antd';
import * as act from '../../../redux/actions/login'
import * as shareAct from '../../../redux/actions/share';
import * as platAc from '../../../redux/actions/sysManage/platformConfig'
import styles from './login.css';
 import LoginForm from '../../components/loginForm/loginForm';
 import * as socketAc from '../../../redux/actions/SocketMiddle';
 

class Login extends React.Component {
    componentDidMount(){
        this.props.queryPlat();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.msgTip!==this.props.msgTip){
            message.error(nextProps.msgTip);
         }
    }
    render(){
        let platObj = this.props.platConfig ? this.props.platConfig.list.datas.length > 0 ? this.props.platConfig.list.datas[0] : {} : {};
        return (
            <div className={styles.login}>

                <LoginForm {...this.props} />
                <div className={styles.footer}>
                    <div className={styles.footerTitle}>
                        <div className={styles.footerFont}>
                        {!platObj?'支持谷歌浏览器 版权所有 @安徽蓝盾光电子股份有限公司':platObj.right}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// Login.propTypes = {
//     submitClick: React.PropTypes.func.isRequired
// };


function mapStateToProps(state) {
    return {
        loginRet: state.Login.loginRet,
        userInfo: state.Login.userInfo,
        msgTip:state.MsgTip.msg,
        sysDic:state.Share.sysDic,
        siteGroup:state.Share.monitorSiteGroup,
        factorColorList:state.Share.factorColorList,
        platConfig:state.PlatformConfig,        
    }
}

function mapDispatchToProps(dispatch) {
    return {
        submitClick: (param) => {
            dispatch(act.loginSubmit(param))
        },
        querySysdic: (param) => {
            dispatch(shareAct.querySysdic(param))
        },
        queryArea: (param) => {
            dispatch(shareAct.queryArea(param))
        },
        queryFactor: (param) => {
            dispatch(shareAct.queryFactor(param))
        },
        factorColorListQuery: (param) => {
            dispatch(shareAct.factorColorListQuery(param))
        },
        queryMonitorSite: (param) => {
            dispatch(shareAct.querySysSite(param))
        },
        queryMonitorSiteGroup: (param) => {
            dispatch(shareAct.querySiteGroup(param))
        },
        queryPlat: (param) => {
            dispatch(platAc.querySubmit(param));
        },
        conWebSocket: (url) => {
            dispatch(socketAc.connect(url));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);