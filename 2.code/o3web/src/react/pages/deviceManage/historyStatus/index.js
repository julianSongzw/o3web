/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as act from '../../../../redux/actions/deviceManage/historyStatus'
// import styles from './index.css';
import Tables from '../../../components/deviceManage/historyStatus/table';
import SearchForm from '../../../components/deviceManage/historyStatus/searchForm';

class HistoryStatus extends React.Component {

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
    //故障类型,来自字典0004
    let defaultTypeList = new Array();
    if (state.Share.sysDic && state.Share.sysDic.datas) {
        let dicObj = state.Share.sysDic.datas.clone();
        let i = 0;
        for (i in dicObj) {
            if (dicObj[i].dtype == '0004') {
                defaultTypeList.push(dicObj[i]);
            }
        }
    }
    return {
        historyStatus:state.HistoryStatus,
        defaultTypeList:defaultTypeList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryOpt: (param) => {
            dispatch(act.querySubmit(param));
        }
         
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(HistoryStatus);