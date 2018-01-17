/**
 * Created by zll on 2017/6/23.
 */
import { createAction } from 'redux-actions';
// debugger;
export const CONNECT = 'CONNECT';
export const CONNECTED = 'CONNECTED';
export const DISCONNECT = 'DISCONNECT';
export const DISCONNECTED = 'DISCONNECTED';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const ALARMSTATE_CHANGE = 'ALARMSTATE_CHANGE';

export const connect = createAction(CONNECT);

export const connected = createAction(CONNECTED);

export const disConnected = createAction(DISCONNECTED);

export const message_received = createAction(MESSAGE_RECEIVED);

export const alarm_changeState = createAction(ALARMSTATE_CHANGE);