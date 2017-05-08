import $ from 'jquery';
import md5 from 'md5';
import Config from '../config/config.js'
import Model from '../model/model.js'

const RestfulApi = {
  isLogin: function() {
    return !($.isEmptyObject(Model.auth));
  },

  /**
   * 登录
   */
  login: function(username, password) {
    if (username.length === 0 || password.length === 0) {
      console.error('username or password is empty!');
      return;
    }

    let loginParams = {
      loginName: username,
      password: md5(password),
      bMonitor: false,
      ip: '',
      comment: ''
    };
    console.log('login:' + loginParams);
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: Config.restful.login,
        dataType: 'JSON',
        data: { data: JSON.stringify(loginParams) },
        success: function(res) {
          console.log('login:' + res);
          Model.auth = {};
          if (res && res.code && res.code === 0) {
            if (res.body.result === 0) {
              if (res.body.token && res.body.userid) {
                Model.auth.token = res.body.token;
                Model.auth.userid = res.body.userid;
              }
            }
          }
          resolve(res);
        },
        error: function(error) {
          console.error(error.statusText + '(' + error.status + ')');
          reject(error);
        }
      });
    });
  },

  getContacts: function() {
    const isHit = (Model.rosterInfo.header.code === 0);
    if (isHit) {
      return new Promise((resolve, reject) => {
        resolve({code: 0, error: ''});
      })
    } else {
      return this.getContactsFromServer();
    }
  },

  getContactsFromServer: function() {
    const data = {
      "userId": Model.auth.userid,
      "version": 0
    };
    this.post(Config.restful.friend, data)
    .then((res) => {
      console.log('getContactsFromServer res:' + res);
      if (res && res.code === 0) {
        if (res.body && res.rosterInfo) {
          Model.rosterInfo.setData(res.rosterInfo);
        }
      }
    })
    .catch((error) => {
      console.error('getContactsFromServer error:' + error);
    });
  },

  /**
   * 发送消息
   */
  post: function(url, data) {
    if (!this.isLogin()) {
      console.warn('please login!');
      return;
    }

    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: url,
        dataType: 'JSON',
        data: { token: JSON.stringify(Model.auth), data: data },
        success: function(res) {
          resolve(res);
        },
        error: function(error) {
          console.error(error.statusText + '(' + error.status + ')');
          reject(error);
        }
      });
    })
  }
}

export default RestfulApi;