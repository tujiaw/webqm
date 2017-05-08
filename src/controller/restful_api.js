import { cmds } from '../config/cmds.js'
import $ from 'jquery';
import md5 from 'md5';
import Config from '../config/config.js'

let s_auth = {};
const RestfulApi = {
  isLogin: function() {
    return !($.isEmptyObject(s_auth));
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
      resolve({code: 0});
      $.ajax({
        type: 'POST',
        url: Config.restful.login,
        dataType: 'JSON',
        data: { data: JSON.stringify(loginParams) },
        success: function(res) {
          s_auth = {};
          if (res && res.code && res.code === 0) {
            if (res.body.result === 0) {
              if (res.body.token && res.body.userid) {
                s_auth.token = res.body.token;
                s_auth.userid = res.body.userid;
              }
            }
          }
          console.log('auth:' + s_auth);
          resolve(res);
        },
        error: function(error) {
          console.error(error.statusText + '(' + error.status + ')');
          reject(error);
        }
      });
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
        data: { token: JSON.stringify(s_auth), data: data },
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