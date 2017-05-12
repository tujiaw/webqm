import { WebClient } from '../webapi/web_socket.js';
import Config from '../config/config.js';
import md5 from 'md5';
import ContactActions from '../actions/contact_actions';
import MsgController from './msg_controller';

const UserController = {
  auth: {},
  setAuth: function(auth) {
    this.auth = auth;
  },
  getAuth: function() {
    return this.auth;
  },
  isFriendLoad: false,

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
    const self = this;
    WebClient.request(Config.restful.login, data, function(res) {
      if (!self.checkResponse(res, cb)) {
        return;
      }
      
      if (res.body.result === 0) {
        const authObj = {
          token: res.body.token === undefined ? '' : res.body.token,
          userid: res.body.userid === undefined ? 0 : res.body.userid
        }
        self.setAuth(authObj);
        WebClient.init(authObj, MsgController.onMsgCallback);
        cb({code: 0, error: ''});
      } else {
        cb({code: res.result, error: res.error_desc});
      }
    });
  },

  /**
   * 获取好友列表
   */
  friend: function(cb) {
    if (this.isFriendLoad) {
      cb({code: 0, error: ''});
      return;
    }

    const data = {
      userId: this.getAuth().userid,
      version: 0
    };
    const self = this;
    WebClient.request(Config.restful.friend, data, function(res) {
      if (!self.checkResponse(res, cb)) {
        return;
      }
      self.isFriendLoad = true;
      if (res.body.errorCode === 0 && res.body.rosterInfo) {
        ContactActions.initContact(res.body.rosterInfo);
        cb({code: 0, error: ''});
      } else {
        cb({code: res.body.errorCode, error: 'body error'});
      }
    })
  },

  ////////////////////////////私有方法///////////////////////////////
  checkResponse: function(res, cb) {
    if (res) {
      if (res.code !== 0) {
        cb({code: res.code, error: res.error || ''});
        return false;
      } else if (res.body) {
        return true;
      }
    }
    console.error('应答内容出错, res:' + res);
    cb({code: 1, error: '登录失败，应答内容出错！'});
    return false;
  }
}

export default UserController;