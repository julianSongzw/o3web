/**
 * Created by zll on 2017/10/9.
 */
import axios from 'axios';
import { config } from './config';


export const dataService = {
    postRequest: (params) => {
        return new Promise(function (resolve, reject) {
            const access_token = localStorage.getItem('access_token');
            const username = localStorage.getItem('username');
            axios.post(params.reqUrl + '?access_token=' + access_token + '&username=' + username, params.reqParam, config)
                .then(function (res) {
                    resolve(res);
                })
                .catch(function (err) {
                    reject(err);
                })
        });
    },
    getRequest: (params) => {
        return new Promise(function (resolve, reject) {
            const access_token = localStorage.getItem('access_token');
            const username = localStorage.getItem('username');
            axios.get(params.reqUrl + '?access_token=' + access_token + '&username=' + username, config)
                .then(function (res) {
                    resolve(res);
                })
                .catch(function (err) {
                    reject(err);
                })
        });
    },

    reqUrl: {
        login: '/api/sys_users/webLogin',
        singleQuery: '/api/sys_users/webLogin',
        sysDic: '/api/sys_dics/listJson',
        area: '/api/b_areas/list',
        factor: '/api/b_factors/list',
        factorColorList: '/api/colors/list',
        monitorSite: '/api/sys_dic_types/list',
        monitorSiteGroup: '/api/b_areas/areaSite',

    },
    sysManageUrl: {

        queryPlat: '/api/sys_platforms/list',
        platSubmit: '/api/sys_manage/plat_submit',

        queryMS: '/api/b_sites/list',
        addMS: '/api/b_sites/add',
        editMS: '/api/b_sites/siteUpdate',
        delMS: '/api/b_sites/delete',

        queryUser: '/api/sys_users/list',
        addUser: '/api/sys_users/add',
        editUser: '/api/sys_users/userUpdate',
        delUser: '/api/sys_users/delete',

        queryAlarm: '/api/b_alarms/list',
        addAlarm: '/api/b_alarms/add',
        editAlarm: '/api/b_alarms/alarmUpdate',
        delAlarm: '/api/b_alarms/delete',
        
        querySysDic: '/api/sys_dics/list',
        addSysDic: '/api/sys_dics/add',
        editSysDic: '/api/sys_dics/dicUpdate',
        delSysDic: '/api/sys_dics/delete',

        queryDicType: '/api/sys_dic_types/list',
        addDicType: '/api/sys_dics/add',
        editDicType: '/api/sys_dics/dicUpdate',
        delDicType: '/api/sys_dics/delete',

        querySysLog: '/api/sys_logs/list',
    },

    homeUrl:{
        getDeviceListUrl:'/api/o_devices/list',
        getNationalCtlPointUrl:'/api/b_sites/list',
    },

    correlationUrl:{
        getCorrelationUrl:"/api/factor_relateds/list", //��������Ի�ȡ�ӿ�
    },
    devManageUrl:{

        queryDevConfig: '/api/o_devices/list',
        addDevConfig: '/api/o_devices/add',
        editDevConfig: '/api/o_devices/deviceUpdate',
        delDevConfig: '/api/o_devices/delete',

        queryHisStatus: '/api/o_histories/list',     

        queryDeviceControl: '/api/o_controls/list',        
        deviceControl: '/api/o_controls/add', 
        
        queryDeviceAlarm: '/api/o_alarms/list',                
        delDeviceAlarm: '/api/o_alarms/delete',

    },
    report:{
        queryReport: '/api/d_reports/list',
        addReport: '/api/d_reports/add',
        downloadReport: '/api/d_reports/choicesDownload',
        delReport: '/api/d_reports/delete',
    }
};