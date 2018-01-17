/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as deviceAlarmAc from '../../../../redux/actions/deviceManage/deviceAlarm'
// import styles from './index.css';
import Tables from '../../../components/deviceManage/deviceAlarm/table';
import SearchForm from '../../../components/deviceManage/deviceAlarm/searchForm';

class DeviceAlarm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    ComponentWillRecieveProps(nextProps) {

    }

    render() {

        return (
            <div>
                 <SearchForm  {...this.props} ref="searchForm" /> 
                 <Tables {...this.props} searchForm={this.refs.searchForm}/> 
            </div>
        )
    }
}

function mapStateToProps(state) {

    //报警类型,来自字典0006
    let aTypeList = new Array();
    if (state.Share.sysDic && state.Share.sysDic.datas) {
        let dicObj = state.Share.sysDic.datas.clone();
        let i = 0;
        for (i in dicObj) {
            if (dicObj[i].dtype == '0006') {
                aTypeList.push(dicObj[i]);
            }
        }
    }
    return {
        deviceAlarm: state.DeviceAlarm,
        aTypeList: aTypeList,
        factor: state.Share.factor,
        
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(deviceAlarmAc.querySubmit(param));
        },
        deleteOpt:(param)=>{
            dispatch(deviceAlarmAc.deleteSubmit(param));
        }
         
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DeviceAlarm);