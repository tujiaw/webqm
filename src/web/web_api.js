import { WebClient } from './web_socket.js';
import Config from '../config/config.js';
import md5 from 'md5';
import { QMMsgBuilder } from '../utils/qmmsg.js';

const WebApi = {
  /**
   * 登录
   */
  login: function(username, password, cb) {
    const data = {
      loginName: username,
      password: md5(password),
      bMonitor: false,
      ip: '',
      comment: ''
    };
    WebClient.request(Config.restful.login, data, cb);
  },

  regMessageCallback:function(auth, onMessageFunc) {
    WebClient.init(auth, onMessageFunc);
  },

  /**
   * 获取好友列表
   */
  friend: function(auth, cb) {
    const data = {
      userId: auth.userid,
      version: 0
    };
    WebClient.request(Config.restful.friend, data, cb);
  },

  sendMsg: function(auth, id, msg, cb) {
    const data = {
      "header": {
        "from": auth.userid,
        "sourceNo": 0,
        "serialNo": 0,
        "errorCode": 0
      },
      "to": [
        id
      ],
      "type": 1,
      "body": "{\"bodyList\":[{\"type\":10,\"msg\":{\"content\":\"hello, world!\",\"type\":0,\"color\":0,\"size\":0,\"fontstyle\":0},\"basiccontent\":\"hello, world!\"}],\"bodyListType\":0,\"ExtendContent\":\"\",\"ServerSent\":false,\"notify\":0,\"isQQMsg\":false}",
      "keyServer": 0,
      "keyId": 0,
      "res": 0,
      "ServerSent": false
    }

    const builder = new QMMsgBuilder();
    data.body = JSON.stringify(builder.pushText(msg).getMsg());
    WebClient.request(Config.restful.sendmsg, data, cb);
  }
}

export default WebApi;