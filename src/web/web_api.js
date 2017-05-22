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

  regMessageCallback:function(auth, onMessageFunc, cb) {
    WebClient.init(auth, onMessageFunc, cb);
  },

  connectStatus: function() {
    return WebClient.connectStatus();
  },

  /**
   * 获取好友列表
   */
  friend: function(auth, cb) {
    const data = {
      userId: auth.userid || 0,
      version: 0
    };
    WebClient.request(Config.restful.friend, data, cb);
  },

  /**
   * 获取用户组
   */
  usergroup: function(auth, cb) {
    const data = {
      userId: auth.userid || 0,
      version: 0
    };
    WebClient.request(Config.restful.usergroup, data, cb);
  },

  /**
   * 用户基本信息
   */
  userdetail: function(auth, usersId, cb) {
    const data = {
      "ownerId": auth.userid || 0,
      "userId": [],
      "version": [],
      "detail": true
    }
    for (let i = 0, count = usersId.length; i < count; i++) {
      if (usersId[i]) {
        data.userId.push(usersId[i]);
        data.version.push(0);
      }
    }
    WebClient.request(Config.restful.userdetail, data, cb);
  },

  /**
   * 公司信息
   */
  companies: function(companiesId, cb) {
    const data = {
      companyId: []
    }
    data.companyId = data.companyId.concat(companiesId);
    WebClient.request(Config.restful.company, data, cb);
  },

  /**
   * 用户头像
   */
  useravatar: function(usersId, cb) {
    const data = {
      userIdList: [],
      avatarIdList: []
    }
    for (let i = 0, count = usersId.length; i < count; i++) {
      data.userIdList.push(usersId[i]);
      data.avatarIdList.push(0);
    }
    WebClient.request(Config.restful.useravatar, data, cb);
  },

  /**
   * 设置自定义配置
   */
  setcustomconfig: function(auth, keyList, valueList, cb) {
    const data = {
      "userId": auth.userid || 0,
      "key": [],
      "value": []
    }
    const count = Math.min(keyList.length, valueList.length);
    if (count === 0) {
      cb({code: 1, error: '参数错误'});
      return;
    }
    for (let i = 0; i < count; i++) {
      data['key'].push(keyList[i]);
      data['value'].push(valueList[i]);
    }
    WebClient.request(Config.restful.setcustomconfig, data, cb);
  },

  /**
   * 获取自定义配置
   */
  customconfig: function(auth, keyList, cb) {
    const data = {
      "userId": auth.userid || 0,
      "key": [],
      "version": []
    }
    if (!keyList.length) {
      cb({code: 1, error: '参数错误'});
      return;
    }
    for (let i = 0, count = keyList.length; i < count; i++) {
      data['key'].push(keyList[i]);
      data['version'].push(0);
    }
    WebClient.request(Config.restful.customconfig, data, cb);
  },

  /**
   * 获取全局配置
   */
  globalconfig: function(keyList, cb) {
    const data = {
      "key": []
    }
    data['key'] = keyList;
    WebClient.request(Config.restful.globalconfig, data, cb);
  },

  /**
   * 发送消息
   */
  sendMsg: function(auth, id, msg, cb) {
    const data = {
      "header": {
        "from": auth.userid || 0,
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
    const resMsg = {
      id: 0,
      to: [],
      body: data.body,
      res: 'RES_PC',
      time: 0,
      keyServer: 0,
      newMsgId: 0,
      type: 'MSG_TYPE_CHAT',
      deleted: false,
      keyId: 0,
      header: {
        from: 0
      }
    }

    WebClient.request(Config.restful.sendmsg, data, (res) => {
      console.log('send msg responase:' + JSON.stringify(res))
      if (res.code === 0) {
        if (res.body.toUserMsgInfo) {
          const toUserMsgInfo = res.body.toUserMsgInfo;
          resMsg.id = toUserMsgInfo[0].msgid;
          resMsg.to.push(toUserMsgInfo[0].user);
          resMsg.time = toUserMsgInfo.time;
          resMsg.newMsgId = resMsg.id;
          resMsg.header.from = auth.userid || 0;
        }
      }
      res.resMsg = resMsg;
      cb(res);
    });
  }
}

export default WebApi;