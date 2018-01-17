/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as deviceControlAc from '../../../../redux/actions/deviceManage/deviceControl'
import * as deviceConfiglAc from '../../../../redux/actions/deviceManage/deviceConfig'
// import styles from './index.css';
import Tables from '../../../components/deviceManage/deviceControl/table';
import SearchForm from '../../../components/deviceManage/deviceControl/searchForm';

class DeviceControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.deviceQuery();
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
    //质控类型,来自字典0005
    let cTypeList = new Array();
    if (state.Share.sysDic && state.Share.sysDic.datas) {
        let dicObj = state.Share.sysDic.datas.clone();
        let i = 0;
        for (i in dicObj) {
            if (dicObj[i].dtype == '0005') {
                cTypeList.push(dicObj[i]);
            }
        }
    }
    return {
        devControl: state.DeviceControl,
        //设备信息
        deviceList: state.DevConfig.list.datas,
        //质控类型
        cTypeList: cTypeList

    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(deviceControlAc.queryDeviceControl(param));
        },
        deviceControl: (param) => {
            dispatch(deviceControlAc.deviceControlSubmit(param));
        },
        deviceQuery: (param) => {
            dispatch(deviceConfiglAc.querySubmit(param));
        },

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DeviceControl);