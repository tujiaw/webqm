import { WebClient } from './web_socket.js';
import Config from '../config/config.js';
import Util from '../utils/util';
import md5 from 'md5';

let serialNo = 0;
const WebApi = {
  /**
   * 登录
   * @param {*string} username
   * @param {*string} password
   * @param {*function}
   */
  login(username, password, cb) {
    const data = {
      loginName: username,
      password: md5(password),
      bMonitor: false,
      ip: '',
      comment: ''
    };
    WebClient.request(Config.restful.login, data, cb);
  },

  /**
   * 网关登录
   * @param {*object} auth 
   * @param {*function} cb 
   */
  gatewayLogin(auth, cb) {
    const data = {
      "token": auth.token
    }
    WebClient.request(Config.restful.gatewayLogin, data, cb);
  },

  /**
   * SM登录
   * @param {*object} auth 
   * @param {*function} cb 
   */
  smlogin(auth, cb) {
    ++serialNo;
    const data = {
      "header": {
        "from": auth.userid,
        "sourceNo": serialNo,
        "serialNo": serialNo,
        "errorCode": 0
      },
      "res": 0,
      "tokenInfo": {
        "token": auth.token,
        "userid": auth.userid,
      }
    }
    WebClient.request(Config.restful.smlogin, data, cb);
  },

  /**
   * 设置在线状态
   * @param {*object} auth 
   * @param {*function} cb 
   */
  presence(auth, cb) {
    ++serialNo;
    const data = {
      "header": {
        "from": auth.userid,
        "sourceNo": serialNo,
        "serialNo": serialNo,
        "errorCode": 0
      },
      "presence": {
        "id": auth.userid,
        "serialNo": serialNo,
        "show": 2,
        "res": 0,
        "token": auth.token
      }
    }
    WebClient.request(Config.restful.presence, data, cb);
  },

  /**
   * 认证
   * @param {*object} auth 
   * @param {*function} cb 
   */
  session(auth, cb) {
    ++serialNo;
    const data = {
      "header": {
        "from": auth.userid,
        "sourceNo": serialNo,
        "serialNo": serialNo,
        "errorCode": 0
      },
      "action": 1,
      "res": 0
    }
    WebClient.request(Config.restful.session, data, cb);
  },

  /**
   * 注册消息回调
   * @param {*object} auth 
   * @param {*function} onMessageFunc 
   * @param {*function} cb 
   */
  regMessageCallback(auth, onMessageFunc, cb) {
    WebClient.init(auth, onMessageFunc, cb);
  },

  /**
   * 获取连接状态
   */
  connectStatus() {
    return WebClient.connectStatus();
  },

  /**
   * 请求好友列表
   * @param {*object} auth 
   * @param {*function} cb 
   */
  friend(auth, cb) {
    const data = {
      userId: auth.userid || 0,
      version: 0
    };
    WebClient.request(Config.restful.friend, data, cb);
  },

  /**
   * 获取群列表
   * @param {*object} auth 
   * @param {*function} cb 
   */
  room(auth, cb) {
    const data = {
      "userId": auth.userid || 0,
      "version": 0
    }
    WebClient.request(Config.restful.room, data, cb);
  },

  /**
   * 获取群信息列表
   * @param {*object} auth 
   * @param {*number[]} roomIdList 
   * @param {*function} cb 
   */
  roomInfoList(auth, roomIdList, cb) {
    const data = {
      "userId": auth.userid || 0,
      "roomId": [],
      "version": [],
      "reqMember": false,
      "reqOwner": false,
      "removeAvatar": false
    }
    for (const id of roomIdList) {
      data.roomId.push(id);
      data.version.push(0);
    }
    WebClient.request(Config.restful.ISReqUserRoomInfo, data, cb);
  },

  /**
   * 设置群信息
   * @param {*object} auth 
   * @param {*number} roomid 
   * @param {*string} key 
   * @param {*string | object} value 
   * @param {*function} cb 
   */
  setRoomInfo(auth, roomid, key, value, cb) {
    const keyList = ['roomName', 'description', 'notice', 'openSearch', 'avatarId', 'avatar'];
    if (keyList.indexOf(key) < 0) {
      console.error('set room info not this key:' + key);
      return;
    }
    const data = {
      "userId": auth.userid || 0,
      "roomId": roomid,
    }
    data[key] = value;
    WebClient.request(Config.restful.ISReqUpdateRoom, data, cb);
  },

  /**
   * 获取群成员列表
   * @param {*object} auth 
   * @param {*number[]} roomIdList 
   * @param {*function} cb 
   */
  roomMemberList(auth, roomIdList, cb) {
    const data = {
      "userId": auth.userid || 0,
      "roomId": [],
      "version": [],
      "reqMember": true,
      "reqOwner": true,
      "removeAvatar": true
    }
    for (const id of roomIdList) {
      data.roomId.push(id);
      data.version.push(0);
    }
    WebClient.request(Config.restful.ISReqUserRoomInfo, data, cb);
  },

  /**
   * 获取用户组
   * @param {*object} auth 
   * @param {*function} cb 
   */
  usergroup(auth, cb) {
    const data = {
      userId: auth.userid || 0,
      version: 0
    };
    WebClient.request(Config.restful.usergroup, data, cb);
  },

  /**
   * 获取用户详细信息列表
   * @param {*object} auth 
   * @param {*number[]} usersId 
   * @param {*function} cb 
   */
  userdetail(auth, usersId, cb) {
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
   * 获取公司信息列表
   * @param {*string[]} companiesId 
   * @param {*function} cb 
   */
  companies(companiesId, cb) {
    const data = {
      companyId: []
    }
    data.companyId = data.companyId.concat(companiesId);
    WebClient.request(Config.restful.company, data, cb);
  },

  /**
   * 获取用户头像列表
   * @param {*number[]} usersId 
   * @param {*function} cb 
   */
  useravatar(usersId, cb) {
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
   * @param {*object} auth 
   * @param {*string[]} keyList 
   * @param {*string[]} valueList 
   * @param {*function} cb 
   */
  setcustomconfig(auth, keyList, valueList, cb) {
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
   * @param {*object} auth 
   * @param {*string[]} keyList 
   * @param {*function} cb 
   */
  customconfig(auth, keyList, cb) {
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
   * @param {*string[]} keyList 
   * @param {*function} cb 
   */
  globalconfig(keyList, cb) {
    const data = {
      "key": []
    }
    data['key'] = keyList;
    WebClient.request(Config.restful.globalconfig, data, cb);
  },

  /**
   * 发送消息
   * @param {*object} auth 
   * @param {*number} id - 对方ID
   * @param {*object} msgBody - 消息体
   * @param {*function} cb 
   */
  sendMsg(auth, id, msgBody, cb) {
    let type = 1;
    if (Util.isQmRoomId(id)) {
      type = 2;
    }
    const data = {
      "header": {
        "from": auth.userid || 0,
        "sourceNo": ++serialNo,
        "serialNo": serialNo,
        "errorCode": 0
      },
      "to": [
        id
      ],
      "type": type,
      "body": "{\"bodyList\":[{\"type\":10,\"msg\":{\"content\":\"hello, world!\",\"type\":0,\"color\":0,\"size\":0,\"fontstyle\":0},\"basiccontent\":\"hello, world!\"}],\"bodyListType\":0,\"ExtendContent\":\"\",\"ServerSent\":false,\"notify\":0,\"isQQMsg\":false}",
      "keyServer": 0,
      "keyId": 0,
      "res": 0,
      "ServerSent": false
    }

    data.body = JSON.stringify(msgBody);
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
  },
  /**
   * 搜索
   * @param {*object} auth 
   * @param {*string} key 
   * @param {*number} maxUser 
   * @param {*number} maxRoom 
   * @param {*function} cb 
   */
  search(auth, key, maxUser, maxRoom, cb) {
    const data = {
      "userId": auth.userid || 0,
      "key": key,
      "orgType": "",
      "province": "",
      "city": "",
      "limitUser": maxUser,
      "limitRoom": maxRoom,
      "onlyStranger": false,
      "onlyOnline": false
    };

    WebClient.request(Config.restful.search, data, cb);
  },

  /**
   * 获取未读消息，只在登录后调用一次
   * @param {*object} auth 
   * @param {*number} maxCount 
   * @param {*function} cb 
   */
  unreadmsg(auth, maxCount, cb) {
    const data = {
      "header": {
        "from": auth.userid,
        "sourceNo": ++serialNo,
        "serialNo": serialNo,
        "errorCode": 0
      },
      "timeStamp": 0,
      "lastCount": maxCount
    }
    WebClient.request(Config.restful.unreadmsg, data, cb);
  }
}

export default WebApi;