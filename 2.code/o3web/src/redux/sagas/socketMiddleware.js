/**
 * Created by zll on 2017/6/23.
 */
import * as actions from '../actions/SocketMiddle'

const socketMiddleware = (function () {
    var socket = null;

    var heartCheck = {
        timeout: 6000,//60ms
        timeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            this.start();
        },
        start: function () {
            this.timeoutObj = setTimeout(function () {
                //socket.send("HeartBeat");
                //socket.send("HeartBeat");
            }, this.timeout)
        }
    };


    const onOpen = (ws, store, token) => evt => {
        store.dispatch(actions.connected());
        //heartCheck.start();
    };

    const onClose = (ws, store) => evt => {
        // debugger;
        store.dispatch(actions.disConnected());
    };


    const onError = (ws, store) => evt => {
        store.dispatch(actions.disConnected());
    };
    const onMessage = (ws, store) => evt => {
        //heartCheck.reset();

        var msg = JSON.parse(evt.data);
        // debugger;
        switch (msg.ret) {
            case 2:
                try { 
                    socket.send(JSON.stringify({ type: "0", value: ["cone", "gkDTTransport", "deviceOnline"] }));
                    console.log(msg, "88786662222");
                } catch (error) {
                    console.log(error+'websoclet异常');
                }
                break;
            default:
                console.log(msg, "8878666");
                store.dispatch(actions.message_received(msg));
                break;
        }
    };

    return store => next => action => {
        try {

            switch (action.type) {
                case actions.CONNECT:
                    //;
                    // if (socket != null) {
                      
                    //     socket.close();
                    //     // return;
                    // }
                    socket = new WebSocket(action.payload);
                    socket.onmessage = onMessage(socket, store);
                    socket.onclose = onClose(socket, store);
                    socket.onopen = onOpen(socket, store, action.token);
                    socket.onerror = onError(socket, store);
                    break;
                case actions.DISCONNECT:
                    // if (socket != null) {
                    //     socket.close();
                    // }
                    socket = null;
                    store.dispatch(actions.disConnected());
                    break;
                case actions.DISCONNECTED:
                    store.dispatch(actions.connect());
                    break;
                case actions.SEND_MESSAGE:
                    console.log('接收预警信息', action);
                    socket.send(JSON.stringify(action));
                    break;
                default:
                    return next(action);
            }
        }
        catch (ex) {
        }
    }

})();

export default socketMiddleware