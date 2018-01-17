/**
 * Created by zll on 2017/6/27.
 */
import * as ws from '../actions/SocketMiddle';
import moment from 'moment';
const initState = {
    connected: false,
    devTimeStatus:new Object(),
    nationalSiteTimeStaus:new Object(),
    errMsg: ''
};

export default function (state = initState, action) {
    // debugger;
    switch (action.type) {
        case ws.CONNECTED:
            return  {
                ...state,
                connected: true
            };
        case ws.DISCONNECTED:
            ////;
            return  {
                ...state,
                connected: false
            };
        case ws.MESSAGE_RECEIVED:
            ////;
            try{
                if(action.payload.wtype == 'gkDTTransport'){
                    //国控点状态推送数据更新
                    state.nationalSiteTimeStaus = action.payload;
                    return  {
                        ...state,
                    };
                }
                else if(action.payload.wtype == 'deviceOnline'){
                    state.devTimeStatus = action.payload;
                    return  {
                        ...state,
                    };
                }
            }
            catch (ex){
                ////;
                return state;
            }
        default:
            return state;
    }
}