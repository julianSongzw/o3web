/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as syslogAc from '../../../../redux/actions/sysManage/sysLog'
// import styles from './index.css';
import Tables from '../../../components/systemManage/sysLog/table';
import SearchForm from '../../../components/systemManage/sysLog/searchForm';

class SysLog extends React.Component {

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
    return {
        sysLog:state.SysLog
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(syslogAc.querySubmit(param));
        },
        deleteOpt: (param) => {
            dispatch(syslogAc.deleteSubmit(param));
        },
         
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(SysLog);