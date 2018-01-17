/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as alarmAc from '../../../../redux/actions/report/editReport'
// import styles from './index.css';
import Tables from '../../../components/report/editReport/table';
import SearchForm from '../../../components/report/editReport/searchForm';
import { pubFunc } from '../../../../utils/pubFnc';

class EditReport extends React.Component {

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
        editReport: state.EditReport,
        factor: state.Share.factor,
        area: state.Share.area,        
        areaOptions: pubFunc.areaOptions(state.Share.area),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(alarmAc.querySubmit(param));
        },
        addOpt: (param) => {
            dispatch(alarmAc.addSubmit(param));
        },
        downloadOpt: (param) => {
            dispatch(alarmAc.downloadSubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(alarmAc.deleteSubmit(param));
        },

    }
}



export default connect(mapStateToProps, mapDispatchToProps)(EditReport);