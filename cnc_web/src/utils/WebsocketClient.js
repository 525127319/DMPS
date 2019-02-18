import {Observable, Observer, Subject } from 'rxjs';
import {websocketConfig, websocketStatus, evn} from './Config';
import _ from 'lodash';
var UUID = require('uuid');

const callBackMap = new Map();

class WebsocketClient {

    static clear_callback_interval = 3000;//默认清理的时间间隔

    static clear_callback_interval_obj = null;

    static subject = null;
    constructor() {
        this.init();
    }

    init() {
        //中控的回调。
        let listener = function (params) {
            //log
            let ln = callBackMap.get(params.msgType);
            if (!_.isUndefined(ln) && !_.isUndefined(ln.subject)) {//一次来回请求
                ln.subject.next(params.data);
            } else {//监听器
                if (!_.isUndefined(ln)) {
                    if (evn.dubuger){
                        // console.log('receiver:  '+JSON.stringify(params.data));
                    }
                    ln.next(params.data);
                }
            }
        }.bind(this);
        //ipcRenderer.on(MSG_TYPE.TO_RENDER, listener);

        let retryConnection = function(){
            this.createWebsocket(listener, retryConnection);
        }.bind(this);

        this.createWebsocket(listener, retryConnection);
    }

    createWebsocket(listener, retryConnection) {
        let _subject = this.subject = Observable.webSocket({
            url: 'ws://' + websocketConfig.ip + ':' + websocketConfig.port + '',
            openObserver: {
                next: () => {
                    console.log('open');
                    listener({ msgType: websocketStatus.open });
                },
                error: e => {console.error(e);
                    let timeout = setTimeout(()=>{
                        clearTimeout(timeout);
                        retryConnection();
                    }, websocketConfig.retryTimes);
                }
            },
            closeObserver: {
                next: () => {
                    console.log('close');
                    listener({ msgType: websocketStatus.close });
                    let timeout = setTimeout(()=>{
                        clearTimeout(timeout);
                        retryConnection();
                    }, websocketConfig.retryTimes);
                    
                    //_subject.retry(websocketConfig.retryTimes).delay(websocketConfig.interval);
                }
            }
        });
        //.retry(websocketConfig.retryTimes).delay(websocketConfig.interval)
        _subject.subscribe(
            listener,
            (err) => console.log(err),
            () => console.log('complete')
        );

//this.subject.next(JSON.stringify({ op: 'hello' }));
    }

    //下发指令到node的service，由node的service决定是查库还是到中间件。
    send(listener) {
        if (_.isEmpty(listener.msgType) || _.isEmpty(listener.data)){
            throw 'listener.msgType and listener.data can\'t be empty!';
        }
        // ipcRenderer.send(MSG_TYPE.TO_MID, {msgType: listener.msgType, data: listener.data});
        let msg = JSON.stringify({'msgType': listener.msgType, 'version': 'V0.0.1', 'msgId': UUID.v4(),
        'timestamp': new Date(), 'data': listener.data});
        this.subject.next(msg);
        let ln = { time: new Date().getTime(), subject: new Subject() };
        callBackMap.set(listener.msgType, ln);
        if (!this.clear_callback_interval_obj) {
            this.clear_callback_interval_obj = setInterval(function () {
                callBackMap.forEach((ln, key) => {
                    if (_.isUndefined(ln.time))
                        return;
                    if (new Date().getTime() - ln.time >= this.clear_callback_interval) {
                        callBackMap.delete(key);
                    }
                }, this);
            }.bind(this), this.clear_callback_interval);
        }
        return ln.subject;
    };

    /**
     * 添加监听者
     * @param {*} listener :  msgType
     */
    on(listener){
        if (_.isEmpty(listener.msgType)){
            throw 'listener.msgType can not be empty!';
        }

        let subject = null;
        if (callBackMap.has(listener.msgType)) {
            subject = callBackMap.get(listener.msgType);
        } else {
            subject = new Subject();
            callBackMap.set(listener.msgType, subject);
        }
        return subject;
    }

    off(listener) {
        // if (!this.callBackMap.has(listener.msgType))
        //     return;
        // let subject = this.callBackMap.get(listener.msgType);
        // let removeIndex = 0;
        // ls.forEach((ln, index) => {
        //     if (ln === listener){
        //         removeIndex = index;
        //     }
        // });
        // ls.splice(removeIndex, 1);
    }

}

const client = new WebsocketClient();

export default client;