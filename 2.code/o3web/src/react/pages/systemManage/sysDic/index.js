/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import axios from 'axios';
import { config } from '../../../../utils/config';
import * as sysdicAc from '../../../../redux/actions/sysManage/sysDic'
// import styles from './index.css';
import Tables from '../../../components/systemManage/sysDic/table';
import SearchForm from '../../../components/systemManage/sysDic/searchForm';

class SysDic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dicTypeList: []            
        };
        
    }

    componentDidMount() {
        let _self = this;
        // window.addEventListener('resize', this.onWindowResize);
        //字典类型
        let access_token = localStorage.getItem('access_token');
        let username = localStorage.getItem('username');
        axios.post('/api/sys_dic_types/list' + '?access_token=' + access_token + '&username=' + username,{}, config)
            .then(function (res) {
                if (res.data.ret === 1) {
                    _self.setState({ dicTypeList: res.data.datas.clone() });
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
                 <SearchForm  {...this.props} ref="searchForm" dicTypeList={this.state.dicTypeList}/> 
                 <Tables {...this.props} searchForm={this.refs.searchForm} dicTypeList={this.state.dicTypeList}/> 
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sysDic: state.SysDic,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(sysdicAc.querySubmit(param));
        },
        addOpt: (param) => {
            dispatch(sysdicAc.addSubmit(param));
        },
        editOpt: (param) => {
            dispatch(sysdicAc.editSubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(sysdicAc.deleteSubmit(param));
        },
         
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(SysDic);