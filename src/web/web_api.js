import { WebClient } from './web_socket.js';
import Config from '../config/config.js';
import md5 from 'md5';
import { QMMsgBuilder } from '../utils/qmmsg.js';
import Util from '../utils/util';

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

  usergroup: function(auth, cb) {
    const data = {
      userId: auth.userid,
      version: 0
    };
    WebClient.request(Config.restful.usergroup, data, cb);
  },

  baseusers: function(usersId, cb) {
    const data = {
      userId: [],
      version: [],
      reqDetail: false,
      ownerId: 0,
      removeAvatar: true
    }
    for (let i = 0, count = usersId.length; i < count; i++) {
      if (usersId[i]) {
        data.userId.push(usersId[i]);
        data.version.push(0);
      }
    }
    WebClient.request(Config.restful.baseusers, data, cb);
  },

  companies: function(companiesId, cb) {
    const data = {
      companyId: []
    }
    data.companyId = data.companyId.concat(companiesId);
    WebClient.request(Config.restful.company, data, cb);
  },

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
          resMsg.header.from = Util.myid;
        }
      }
      res.resMsg = resMsg;
      cb(res);
    });
  }
}

export default WebApi;