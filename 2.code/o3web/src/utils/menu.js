/**
 * Created by zll on 2017/10/9.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, } from 'antd';

export class MainMenu extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <Menu
                mode="horizontal"
                defaultSelectedKeys={['monitor']}
                style={{ height: '100%', width: '100%', backgroundColor: '#4a8de6', display: 'flex', alignItems: 'center' }}
            >
                <Menu.Item key="monitor">
                    <Link to="/main/monitor"><Icon type="video-camera" style={{ fontSize: '16px', color: '#ffffff' }} />
                        <span style={{ fontSize: '14px', color: '#ffffff' }}> 实时监测 </span></Link>
                </Menu.Item>
                <Menu.Item key="q&s" >
                    <Link to="/main/qs"><Icon type="area-chart" style={{ fontSize: '16px', color: '#ffffff' }} />
                        <span style={{ fontSize: '14px', color: '#ffffff' }}> 查询统计 </span></Link>
                </Menu.Item>
                <Menu.Item key="analysis" >
                    <Link to="/main/analysis"><Icon type="sync" style={{ fontSize: '16px', color: '#ffffff' }} />
                        <span style={{ fontSize: '14px', color: '#ffffff' }}>数据分析</span></Link>
                </Menu.Item>
                <Menu.Item key="report" >
                    <Link to="/main/report"><Icon type="copy" style={{ fontSize: '16px', color: '#ffffff' }} />
                        <span style={{ fontSize: '14px', color: '#ffffff' }}> 报告管理</span></Link>
                </Menu.Item>
                <Menu.Item key="device" >
                    <Link to="/main/device"><Icon type="hdd" style={{ fontSize: '16px', color: '#ffffff' }} />
                        <span style={{ fontSize: '14px', color: '#ffffff' }}> 设备管理</span></Link>
                </Menu.Item>
                <Menu.Item key="system" >
                    <Link to="/main/system"><Icon type="setting" style={{ fontSize: '16px', color: '#ffffff' }} />
                        <span style={{ fontSize: '14px', color: '#ffffff' }}> 系统管理</span></Link>
                </Menu.Item>
            </Menu>
        )
    }
}

export class qsMenu extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%' }}
            >
                <Menu.Item key="1"><Link to="/main/qs/singleQ"><Icon type="search" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}>单点查询</span></Link></Menu.Item>
                <Menu.Item key="2"><Link to="/main/qs/sContrast"><Icon type="dot-chart" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}>单点对比</span></Link></Menu.Item>
                <Menu.Item key="3"><Link to="/main/qs/mContrast"><Icon type="picture" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}>多点对比</span></Link></Menu.Item>
                <Menu.Item key="4"><Link to="/main/qs/ymContrast"><Icon type="line-chart" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 同比环比</span></Link></Menu.Item>
                <Menu.Item key="5"><Link to="/main/qs/statistics"><Icon type="layout" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 报表统计</span></Link></Menu.Item>

            </Menu>
        )

    };
}


export class analysisMenu extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <Menu
                theme="dark"
                mode="inline"
                style={{ height: '100%' }}
                defaultSelectedKeys={['1']}
            >
                <Menu.Item key="1"><Link to="/main/analysis/correlation"><Icon type="link" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 因子相关性</span></Link></Menu.Item>
                <Menu.Item key="2"><Link to="/main/analysis/sequence"><Icon type="picture" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 时序分布</span></Link></Menu.Item>
                <Menu.Item key="3"><Link to="/main/analysis/diffusion"><Icon type="environment-o" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 扩散分析</span></Link></Menu.Item>
                <Menu.Item key="4"><Link to="/main/analysis/radar"><Icon type="wifi" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 雷达分析</span></Link></Menu.Item>

            </Menu>
        )

    };
}


export class reportMenu extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <Menu
                theme="dark"
                mode="inline"
                style={{ height: '100%' }}
                defaultSelectedKeys={['1']}
            >
                <Menu.Item key="1"><Link to="/main/report/edit"><Icon type="file-text" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 报告编辑</span></Link></Menu.Item>
                {/* <Menu.Item key="2"><Link to="/main/report/publish"><Icon type="setting"  style={{fontSize: '16px', color: '#FOFOFO'}}/>
                    <span style={{fontSize: '14px', color: '#F0F0F0'}}> 报告发布</span></Link></Menu.Item> */}

            </Menu>
        )

    };
}


export class deviceMenu extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <Menu
                theme="dark"
                mode="inline"
                style={{ height: '100%' }}
                defaultSelectedKeys={['1']}
            >
                <Menu.Item key="1"><Link to="/main/device/setting"><Icon type="tool" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 设备配置</span></Link></Menu.Item>
                <Menu.Item key="2"><Link to="/main/device/history"><Icon type="ellipsis" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 历史状态</span></Link></Menu.Item>
                <Menu.Item key="3"><Link to="/main/device/control"><Icon type="safety" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}>设备质控</span></Link></Menu.Item>
                <Menu.Item key="4"><Link to="/main/device/alarm"><Icon type="bell" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 设备报警</span></Link></Menu.Item>
            </Menu>
        )

    };
}

export class systemMenu extends React.Component {
    componentDidMount() {

    }
    render() {
        return (
            <Menu
                theme="dark"
                mode="inline"
                style={{ height: '100%' }}
                defaultSelectedKeys={['1']}
            >
                <Menu.Item key="1"><Link to="/main/system/platform"><Icon type="desktop" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 平台信息配置</span></Link></Menu.Item>
                <Menu.Item key="2"><Link to="/main/system/point"><Icon type="compass" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 监测点配置</span></Link></Menu.Item>
                <Menu.Item key="3"><Link to="/main/system/alarm"><Icon type="bell" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 报警配置</span></Link></Menu.Item>
                <Menu.Item key="4"><Link to="/main/system/dictionary"><Icon type="folder" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 系统字典</span></Link></Menu.Item>
                <Menu.Item key="8"><Link to="/main/system/dicType"><Icon type="folder" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 字典类型</span></Link></Menu.Item>
                <Menu.Item key="5"><Link to="/main/system/user"><Icon type="user" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}>用户管理</span></Link></Menu.Item>
                {/* <Menu.Item key="6"><Link to="/main/system/auth"><Icon type="setting"  style={{fontSize: '16px', color: '#FOFOFO'}}/>
                    <span style={{fontSize: '14px', color: '#F0F0F0'}}> 权限管理</span></Link></Menu.Item> */}
                <Menu.Item key="7"><Link to="/main/system/log"><Icon type="book" style={{ fontSize: '16px', color: '#FOFOFO' }} />
                    <span style={{ fontSize: '14px', color: '#F0F0F0' }}> 日志管理</span></Link></Menu.Item>

            </Menu>
        )

    };
}