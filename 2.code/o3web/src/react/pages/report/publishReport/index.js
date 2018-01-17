/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as alarmAc from '../../../../redux/actions/sysManage/alarmConfig'
// import styles from './index.css';
import Tables from '../../../components/systemManage/alarmConfig/table';
import SearchForm from '../../../components/systemManage/alarmConfig/searchForm';
import { pubFunc } from '../../../../utils/pubFnc';

class Alarm extends React.Component {

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
                <Tables {...this.props} searchForm={this.refs.searchForm} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        alarmConfig: state.AlarmConfig,
        factor: state.Share.factor,
        area: state.Share.area,        
        areaOptions: pubFunc.areaOptions(state.Share.area),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(alarmAc.queryAlarmSubmit(param));
        },
        addOpt: (param) => {
            dispatch(alarmAc.addAlarmSubmit(param));
        },
        editOpt: (param) => {
            dispatch(alarmAc.editAlarmSubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(alarmAc.deleteAlarmSubmit(param));
        },

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Alarm);