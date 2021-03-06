import Config from '../config/config.js';
import ReconnectingWebSocket from './reconnecting_websocket';

/**
 * 组装消息
 * sn: 递增序列号
 * type: 请求：request, 应答：response，订阅：subscribe，推送：publish
 * url: 命令
 * token: token
 * data: 具体数据
 */
function packMessage(sn, type, url, token, data) {
  if (data && (typeof data === 'object')) {
    data = JSON.stringify(data);
  }
  
  const result = {
    sn: sn || 1,
    type: type || '',
    url: url || '',
    token: token,
    data: data || ''
  }

  return JSON.stringify(result);
}

var WebClient = function(wspath) {
  this.wspath = wspath;
  this.socket = null;
  this.auth = {};
  this.handlePublish = null;
  this.caller = { sn: 0 };

  if (WebSocket) {
    console.log('new web socket:' + wspath);
    const self = this;
    this.socket = new ReconnectingWebSocket(wspath);
    this.socket.onopen = function() {
      console.log('on open');
    };

    this.socket.onclose = function(event) {
      console.log('on close');
    };

    this.socket.onmessage = function(event) {
      console.log('on message');
      if (!event || !event.data) {
        console.error('on message error');
        return;
      }

      let res = event.data;
      if (res.length) {
        res = JSON.parse(res);
        if (res.type === 'subscribe') {

        } else if (res.type === 'response') {
          console.log('on response:' + JSON.stringify(res).slice(0, 100));
          if (self.caller[res.sn] !== 'undefined') {
            self.caller[res.sn].response(res.data);
            delete self.caller[res.sn];
          } else {
            console.error('onmessage sn error:' + res.sn);
          }
        } else if (res.type === 'publish') {
          if (self.handlePublish) {
            self.handlePublish(res);
          }
        }
      }
    };

    this.socket.onerror = function(event) {
      console.log('on error');
    };
  } else {
    console.error('not support web socket!!!');
    return;
  }

  this.connectStatus = function() {
    if (this.socket) {
      return this.socket.readyState;
    } else {
      return -1;
    }
  };

  this.init = function(auth, onMessageCb, cb) {
    this.auth = auth;
    this.handlePublish = onMessageCb;
    this.subscribe(cb);
  };

  this.request = function(url, data, cb) {
    console.log('111111111:' + url, 'data:' + JSON.stringify(data));
    const self = this;
    this.callerExec(function(sn) {
      const msg = packMessage(sn, 'request', url, JSON.stringify(self.auth), data);
      self.socket.send(msg);
    }, cb);
  };

  this.subscribe = function(cb) {
    const self = this;
    this.callerExec(function(sn) {
      const msg = packMessage(sn, 'subscribe', '', JSON.stringify(self.auth));
      console.log('send:' + msg);
      self.socket.send(msg);
    }, cb);
  };

  //////////////////////私有方法///////////////////////
  this.callerExec = function(requestFunc, responseFunc) {
    const func = {
      request: requestFunc,
      response: responseFunc
    };
    const sn = ++this.caller.sn;
    this.caller[sn] = func;
    requestFunc(sn);
  }
}

const webClient = new WebClient(Config.websocket);
console.log('init web socket');
export { webClient as WebClient };