/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as devcieConfigAc from '../../../../redux/actions/deviceManage/deviceConfig'
import * as msAc from '../../../../redux/actions/sysManage/monitorSite'
// import styles from './index.css';
import Tables from '../../../components/deviceManage/deviceConfig/table';
import SearchForm from '../../../components/deviceManage/deviceConfig/searchForm';

class DeviceConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
     this.props.queryMonitorSite();
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
    //处理 设备类别,来自字典0003
    let oTypeList = new Array();
    if (state.Share.sysDic && state.Share.sysDic.datas) {
        let dicObj = state.Share.sysDic.datas.clone();
        let i = 0;
        for (i in dicObj) {
            if (dicObj[i].dtype == '0003') {
                oTypeList.push(dicObj[i]);
            }
        }
    }
    return {
        devConfig: state.DevConfig,
        devTypeList: oTypeList,
        msList:state.MonitorSite.list.datas,
        factor: state.Share.factor,
        
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(devcieConfigAc.querySubmit(param));
        },
        addOpt: (param) => {
            dispatch(devcieConfigAc.addSubmit(param));
        },
        editOpt: (param) => {
            dispatch(devcieConfigAc.editSubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(devcieConfigAc.deleteSubmit(param));
        },
        queryMonitorSite: (param) => {
            dispatch(msAc.querySiteSubmit(param));
        }

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DeviceConfig);