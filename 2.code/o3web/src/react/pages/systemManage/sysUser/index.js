/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import axios from 'axios';
import { config } from '../../../../utils/config';
import * as sysUserAc from '../../../../redux/actions/sysManage/userManage'
// import styles from './index.css';
import Tables from '../../../components/systemManage/userManage/table';
import SearchForm from '../../../components/systemManage/userManage/searchForm';

class SysUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roleList:[]
        };
    }

    componentDidMount() {
        let _self = this;
        //角色列表
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        axios.get('/api/sys_roles' + '?access_token=' + access_token + '&username=' + username,config)
            .then(function (res) {
                if (res.data) {
                    _self.setState({ roleList: res.data.clone()});
                } else {
                    message.error('角色信息请求失败');
                }
            })
            .catch(function (err) {
                message.error('角色信息请求失败' + err);
            })
    }

    ComponentWillRecieveProps(nextProps) {

    }

    render() {

        return (
            <div>
                <SearchForm  {...this.props} ref="searchForm" roleList={this.state.roleList}/>
                <Tables {...this.props} searchForm={this.refs.searchForm} roleList={this.state.roleList}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    //处理 职称,来自字典0001
    let durList = new Array();
    if (state.Share.sysDic && state.Share.sysDic.datas) {
        let dicObj = state.Share.sysDic.datas.clone();
        let i = 0;
        for (i in dicObj) {
            if (dicObj[i].dtype == '0001') {
                durList.push(dicObj[i]);
            }
        }
    }
    return {
        sysUser: state.SysUser,
        durList: durList,
        area: state.Share.area,                
        areaOptions: state.Share.cityArea

    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(sysUserAc.querySubmit(param));
        },
        addOpt: (param) => {
            dispatch(sysUserAc.addSubmit(param));
        },
        editOpt: (param) => {
            dispatch(sysUserAc.editSubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(sysUserAc.deleteSubmit(param));
        },

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(SysUser);