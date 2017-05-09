import { WebClient } from './web_socket.js';
import Config from '../config/config.js';
import Model from '../model/model.js';
import md5 from 'md5';

const UserController = {
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
        Model.auth = authObj;
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
    if (Model.rosterInfo.header.code === 0) {
      cb(Model.rosterInfo);
      return;
    }

    const data = {
      userId: Model.auth.userid,
      version: 0
    };
    const self = this;
    WebClient.request(Config.restful.friend, data, function(res) {
      if (!self.checkResponse(res, cb)) {
        return;
      }
      if (res.body.errorCode === 0 && res.body.rosterInfo) {
        Model.rosterInfo.setData(res.body.rosterInfo);
        cb(Model.rosterInfo);
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