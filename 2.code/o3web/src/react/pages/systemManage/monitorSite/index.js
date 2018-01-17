/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as monitorAc from '../../../../redux/actions/sysManage/monitorSite';
import * as userAc from '../../../../redux/actions/sysManage/userManage';
// import styles from './index.css';
import Tables from '../../../components/systemManage/monitorSite/table';
import SearchForm from '../../../components/systemManage/monitorSite/searchForm';
import { pubFunc } from '../../../../utils/pubFnc';

/* Method of Array */
Array.prototype.clone = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i] === 'object' || typeof this[i] === 'string') {
            arr.push(this[i]);
        } else {
            arr.push(this[i].clone());
        }
    }
    return arr;
};

class monitorSite extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.areaOptions = [];
    }

    componentDidMount() {
        this.props.queryUserInfo();
    }

    ComponentWillRecieveProps(nextProps) {
        
    }

    render() {

        return (
            <div>
                <SearchForm  {...this.props} ref="searchForm" />
                <Tables {...this.props} searchForm={this.refs.searchForm} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    //站点 类型
    let siteType = new Array();
    if (state.Share.sysDic && state.Share.sysDic.datas) {
        let dicObj = state.Share.sysDic.datas.clone();
        let i = 0;
        for (i in dicObj) {
            if (dicObj[i].dtype == '0000') {
                siteType.push(dicObj[i]);
            }
        }
    }
    let userlist = state.SysUser.list ? state.SysUser.list.datas || [] : [];
    return {
        MonitorSite: state.MonitorSite,
        area: state.Share.area,
        areaOptions: pubFunc.areaOptions(state.Share.area),
        siteType: siteType,
        factor: state.Share.factor,
        userlist: userlist,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(monitorAc.querySiteSubmit(param));
        },
        addOpt: (param) => {
            dispatch(monitorAc.addSiteSubmit(param));
        },
        editOpt: (param) => {
            dispatch(monitorAc.editSiteSubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(monitorAc.deleteSiteSubmit(param));
        },
        queryUserInfo: (param) => {
            dispatch(userAc.querySubmit(param));
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(monitorSite);