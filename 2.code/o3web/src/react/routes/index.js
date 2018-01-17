/**
 * Created by zll on 2017/10/9.
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import { Layout } from 'antd';
import {qsMenu,analysisMenu,deviceMenu,reportMenu,systemMenu} from '../../utils/menu';
import Login from '../../react/pages/login';
import SingleQpag from '../pages/queryAndStatistics/singleQpag';
import SContrast from '../pages/queryAndStatistics/scontrast/sContrast';
import MContrast from '../pages/queryAndStatistics/mcontrast/mContrast';
import YmContrast from '../pages/queryAndStatistics/ymconstrast/ymContrast';
import Statistics from '../pages/queryAndStatistics/statistics/statistics';
import home from '../../react/pages/home/home';
import correlation from '../../react/pages/analysis/correlation/correlation';
import sequence from '../../react/pages/analysis/sequence/sequence';
import mainPage from '../../react/pages'
import test from '../../react/pages/testPage'
import platformConfig from '../pages/systemManage/palteformConfig'
import monitorSite from '../pages/systemManage/monitorSite'
import diffusion from '../../react/pages/analysis/diffusion/diffusion'
import radar from '../../react/pages/analysis/radar/radar'
import alramConfig from '../pages/systemManage/alramConfig';
import sysDic from '../pages/systemManage/sysDic';
import dicType from '../pages/systemManage/dicType';
import sysUser from '../pages/systemManage/sysUser';
import sysLog from '../pages/systemManage/sysLog';
import deviceConfig from '../pages/deviceManage/deviceConfig';
import deviceAlarm from '../pages/deviceManage/deviceAlarm';
import deviceControl from '../pages/deviceManage/deviceControl';
import historyStatus from '../pages/deviceManage/historyStatus';
import editReport from '../pages/report/editReport';
import publishReport from '../pages/report/publishReport';

import Store from '../../redux';
import  './index.css';
const store =Store();
const {Content } = Layout;
export default class Routes extends Component {
    componentDidMount(){

    }
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter >
                    <div style={{width:'100%',height:'100%'}}>
                        <div className="listen"></div>
                        <Switch>
                            <Route exact strict path="/login" component={Login} />
                            <Route path="/main" component={mainPage} />
                            <Redirect from='*' to='/login' />
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
};

export  class SideRoute extends React.Component {

    render() {
        return (
            <ul style={{ width:'200px',height:'100%',background: '#f2edf2',overflow:'auto'}} className="menu">
                <Route path="/main/qs" component={qsMenu} />
                <Route path="/main/analysis" component={analysisMenu} />
                <Route path="/main/device" component={deviceMenu} />
                <Route path="/main/report" component={reportMenu}/>
                <Route path="/main/system" component={systemMenu}/>
            </ul>
        );
    }
}

export  class ContentRoute extends React.Component {

    render() {
        return (
            <Content style={{ width:'100%',height:'100%',background: '#fff',overflow:'auto'}}>
                <Route path="/main/monitor" component={home} />
                <Route path="/main/qs" component={qsRoute} />
                <Route path="/main/analysis" component={analysisRoute} />
                <Route path="/main/device" component={deviceRoute} />
                <Route path="/main/report" component={reportRoute} />
                <Route path="/main/system" component={systemRoute} />
            </Content>
        );
    }
}

export  class qsRoute extends React.Component {

    render() {
        return (
            <Content className="content">
                <Switch>
                    <Route path="/main/qs/singleQ" component={SingleQpag}/>
                    <Route path="/main/qs/sContrast" component={SContrast}/>
                    <Route path="/main/qs/mContrast" component={MContrast}/>
                    <Route path="/main/qs/ymContrast" component={YmContrast}/>
                    <Route path="/main/qs/statistics" component={Statistics}/>
                    <Route path="/main/qs" component={SingleQpag}/>
                </Switch>
            </Content>
        );
    }
}

export  class analysisRoute extends React.Component {

    render() {
        return (
            <Content className="content">
                <Switch>
                    <Route path="/main/analysis/correlation" component={correlation}/>
                    <Route path="/main/analysis/sequence" component={sequence}/>
                    <Route path="/main/analysis/diffusion" component={diffusion}/>
                    <Route path="/main/analysis/radar" component={radar}/>
                    <Route path="/main/analysis" component={correlation}/>
                </Switch>
            </Content>
        );
    }
}

export  class reportRoute extends React.Component {

    render() {
        return (
            <Content className="content">
                <Switch>
                    <Route path="/main/report/edit" component={editReport}/>
                    <Route path="/main/report/publish" component={publishReport}/>
                    <Route path="/main/report" component={editReport}/>
                </Switch>
            </Content>
        );
    }
}

export  class deviceRoute extends React.Component {

    render() {
        return (
            <Content className="content">
                <Switch>
                    <Route path="/main/device/setting" component={deviceConfig}/>
                    <Route path="/main/device/history" component={historyStatus}/>
                    <Route path="/main/device/control" component={deviceControl}/>
                    <Route path="/main/device/alarm" component={deviceAlarm}/>
                    <Route path="/main/device" component={deviceConfig}/>
                </Switch>
            </Content>
        );
    }
}

export  class systemRoute extends React.Component {

    render() {
        return (
            <Content className="content">
                <Switch>
                    <Route path="/main/system/platform" component={platformConfig}/>
                    <Route path="/main/system/point" component={monitorSite}/>
                    <Route path="/main/system/alarm" component={alramConfig}/>
                    <Route path="/main/system/dictionary" component={sysDic}/>
                    <Route path="/main/system/dictype" component={dicType}/>
                    <Route path="/main/system/user" component={sysUser}/>
                    <Route path="/main/system/auth" component={test}/>
                    <Route path="/main/system/log" component={sysLog}/>
                    <Route path="/main/system" component={platformConfig}/>
                </Switch>
            </Content>
        );
    }
}