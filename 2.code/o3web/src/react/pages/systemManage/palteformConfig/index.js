/**
 * weijq
 */
import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import * as platAc from '../../../../redux/actions/sysManage/platformConfig'
// import styles from './index.css';
import PlatConfigForm from '../../../components/systemManage/platformConfig';

class PaltformConfig extends React.Component {

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
                <PlatConfigForm {...this.props}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        platConfig:state.PlatformConfig,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryPlat: (param) => {
            dispatch(platAc.querySubmit(param));
        },
        submitClick: (param) => {
            dispatch(platAc.formSubmit(param));
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(PaltformConfig);